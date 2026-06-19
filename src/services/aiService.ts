import { knowledgeBase, greetingResponses, fallbackResponse } from '../data/knowledgeBase';
import { KnowledgeEntry } from '../types';

const GREETING_PATTERNS = /^(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings|what can you do|help me|start|begin)/i;
const SYMPTOM_CHECK_PATTERNS = /symptoms?|signs?|what are|tell me about|information on|explain|describe|overview/i;
const PREVENTION_PATTERNS = /prevent|avoid|protect|reduce risk|stop|ward off|stay healthy/i;
const TREATMENT_PATTERNS = /treat|cure|remedy|medicine|medication|drug|therapy|manage|relief|help with/i;
const WHEN_SEEK_PATTERNS = /when.*doctor|should i see|emergency|urgent|go to hospital|call 911|seek help|serious/i;

function scoreEntry(entry: KnowledgeEntry, query: string): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;
  for (const keyword of entry.keywords) {
    if (lowerQuery.includes(keyword.toLowerCase())) {
      score += keyword.length > 5 ? 3 : 2;
    }
  }
  if (lowerQuery.includes(entry.topic.toLowerCase())) score += 10;
  return score;
}

function buildResponse(entry: KnowledgeEntry, query: string): string {
  const lines: string[] = [];
  lines.push(`## ${entry.topic}`);
  lines.push('');
  lines.push(entry.overview);
  lines.push('');

  const wantsSymptoms = SYMPTOM_CHECK_PATTERNS.test(query) || (!PREVENTION_PATTERNS.test(query) && !TREATMENT_PATTERNS.test(query) && !WHEN_SEEK_PATTERNS.test(query));
  const wantsPrevention = PREVENTION_PATTERNS.test(query);
  const wantsTreatment = TREATMENT_PATTERNS.test(query);
  const wantsWhen = WHEN_SEEK_PATTERNS.test(query);

  const showAll = !wantsPrevention && !wantsTreatment && !wantsWhen;

  if ((wantsSymptoms || showAll) && entry.symptoms) {
    lines.push('**Common Symptoms:**');
    entry.symptoms.forEach(s => lines.push(`- ${s}`));
    lines.push('');
  }

  if ((wantsPrevention || showAll) && entry.prevention) {
    lines.push('**Prevention Strategies:**');
    entry.prevention.forEach(p => lines.push(`- ${p}`));
    lines.push('');
  }

  if ((wantsTreatment || showAll) && entry.treatment) {
    lines.push('**Treatment & Management:**');
    entry.treatment.forEach(t => lines.push(`- ${t}`));
    lines.push('');
  }

  if ((wantsWhen || showAll) && entry.whenToSeek) {
    lines.push('**When to Seek Medical Help:**');
    lines.push(entry.whenToSeek);
    lines.push('');
  }

  if (entry.facts && showAll) {
    lines.push('**Key Facts:**');
    entry.facts.forEach(f => lines.push(`- ${f}`));
    lines.push('');
  }

  lines.push('---');
  lines.push('*This information is for general educational purposes. Please consult a qualified healthcare provider for personalized medical advice.*');

  return lines.join('\n');
}

export async function getAIResponse(query: string): Promise<string> {
  if (GREETING_PATTERNS.test(query.trim())) {
    return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
  }

  try {
    const xaiResponse = await fetchGrokResponse(query);
    if (xaiResponse) return xaiResponse;
  } catch {
    // fall through to local knowledge base
  }

  return getLocalResponse(query);
}

async function fetchGrokResponse(query: string): Promise<string | null> {
  const model = import.meta.env.VITE_XAI_MODEL || 'gemini-2.5-flash';

  const systemPrompt = [
    'You are Health Shield AI, a public health assistant focused on practical health measures.',
    'Answer the user fully and directly in one response. Do not stop mid-explanation.',
    'Give accurate guidance about symptoms, prevention, self-care, treatment, and when to seek medical help.',
    'If the user asks about a disease or symptom, explain it in simple terms, then provide a complete response with clear sections or bullet points.',
    'Use markdown if helpful, but keep the answer complete and not overly brief.',
    'Always include a brief reminder that the information is general education, not a substitute for professional medical advice.',
  ].join(' ');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  // Check if running locally or deployed on Vercel production
  const isLocal = import.meta.env.DEV;

  // Use the local proxy if dev environment; connect straight to Google endpoint if production
  // Note: We removed the inline URL `?key=` query param here since the OpenAI compatibility layer expects the Authorization header instead
  const API_URL = isLocal
    ? '/api/gemini/v1beta/openai/chat/completions'
    : 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

  try {
    console.log('[Gemini] Fetching with model:', model);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the API key using standard OpenAI Bearer format for both environments
        'Authorization': `Bearer ${import.meta.env.VITE_XAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.2,
        max_tokens: 900,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    console.log('[Gemini] Response status:', response.status, response.ok);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.log('[Gemini] Error response:', errData);
      return null;
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(messageContent)
      ? messageContent
          .map(part => (typeof part === 'string' ? part : part?.text || ''))
          .join('')
          .trim()
      : typeof messageContent === 'string'
        ? messageContent.trim()
        : '';

    if (text && text.length > 20) {
      return `${text}\n\n---\n*This information is for general educational purposes. Please consult a qualified healthcare provider for personalized medical advice.*`;
    }
    return null;
  } catch (error) {
    clearTimeout(timeout);
    return null;
  }
}

function getLocalResponse(query: string): string {
  const scored = knowledgeBase
    .map(entry => ({ entry, score: scoreEntry(entry, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return fallbackResponse;

  if (scored.length > 1 && scored[0].score === scored[1].score) {
    const lines: string[] = [];
    lines.push(`I found information on multiple related topics. Here's a summary:\n`);
    scored.slice(0, 2).forEach(({ entry }) => {
      lines.push(`## ${entry.topic}`);
      lines.push(entry.overview);
      lines.push('');
    });
    lines.push('Would you like more detailed information on any of these topics?');
    return lines.join('\n');
  }

  return buildResponse(scored[0].entry, query);
}
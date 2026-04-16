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
    const hfResponse = await fetchHuggingFace(query);
    if (hfResponse) return hfResponse;
  } catch {
    // fall through to local knowledge base
  }

  return getLocalResponse(query);
}

async function fetchHuggingFace(query: string): Promise<string | null> {
  const systemPrompt = `You are Health Shield AI, a public health information assistant. Provide accurate, concise health information using markdown formatting with bullet points. Always remind users to consult a healthcare professional for personal advice. Keep responses under 400 words.`;

  const prompt = `<|system|>\n${systemPrompt}\n<|user|>\n${query}\n<|assistant|>`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    if (Array.isArray(data) && data[0]?.generated_text) {
      const text = data[0].generated_text.trim();
      if (text.length > 50) {
        return text + '\n\n---\n*Always consult a qualified healthcare provider for personal medical advice.*';
      }
    }
    return null;
  } catch {
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

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.XAI_API_KEY || process.env.VITE_XAI_API_KEY;
const defaultModel = process.env.XAI_MODEL || process.env.VITE_XAI_MODEL || 'gemini-3-flash-preview';

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function buildHealthPrompt(message) {
  return [
    'You are a public health assistant focused on practical health measures.',
    'Give concise, accurate guidance about prevention, hygiene, symptom monitoring, self-care, and when to seek medical help.',
    'Keep the response under 300 words and use bullet points when helpful.',
    'Always include a brief disclaimer that this is general education, not a substitute for professional medical advice.',
    '',
    `User question: ${message}`,
  ].join('\n');
}

async function handleCheckKey(req, res) {
  if (!apiKey) {
    sendJson(res, 400, {
      ok: false,
      error: 'Missing XAI_API_KEY or VITE_XAI_API_KEY in the environment. (Google Gemini API)',
    });
    return;
  }

  try {
    const rawBody = await readBody(req);
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const message = typeof payload.message === 'string' && payload.message.trim()
      ? payload.message.trim()
      : 'Give practical health measures for staying healthy during flu season.';
    const model = typeof payload.model === 'string' && payload.model.trim()
      ? payload.model.trim()
      : defaultModel;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildHealthPrompt(message) },
          { role: 'user', content: message },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';

    sendJson(res, response.ok ? 200 : response.status, {
      ok: response.ok,
      model,
      status: response.status,
      response: text,
      raw: response.ok ? undefined : data,
    });
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendJson(res, 400, { ok: false, error: 'Missing request URL.' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    sendJson(res, 200, {
      ok: true,
      service: 'xai-test-server',
      keyConfigured: Boolean(apiKey),
      model: defaultModel,
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/check-key') {
    handleCheckKey(req, res);
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Not found' });
});

server.listen(port, () => {
  console.log(`Gemini API test server running at http://localhost:${port}`);
  console.log(`GET  /health`);
  console.log(`POST /check-key`);
});
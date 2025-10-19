import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

// Import site facts (lightweight fallback context). You can regenerate this via a crawler later.
import siteFactsJson from '@/data/site_facts.json';
import fs from 'node:fs';
import path from 'node:path';

type Fact = { id: string; text: string };

// Keep a tiny in-memory session history per process (best-effort; stateless deployments will not share this).
// For production, back this with a store (KV, Redis) keyed by a session identifier.
declare global {
  // eslint-disable-next-line no-var
  var __klausSessions: Map<string, ChatMessage[]> | undefined;
}

function getSessionStore(): Map<string, ChatMessage[]> {
  if (!globalThis.__klausSessions) {
    globalThis.__klausSessions = new Map<string, ChatMessage[]>();
  }
  return globalThis.__klausSessions;
}

function getContactEmail(): string {
  // Prefer configured email if available, else fallback to known portfolio address
  return process.env.MAIL_TO || 'sandeepcool2036@gmail.com';
}

function buildSystemPrompt(): string {
  const contactEmail = getContactEmail();
  return (
    `You are Klaus, a friendly assistant representing Sandeep Balabantaray (portfolio). ` +
    `Use the provided site_facts and any retrieved documents first to answer. ` +
    `Keep replies concise (1–5 short lines) and speak in first person. Do not add any signature lines. ` +
    `You MUST only answer if supported by the provided facts. ` +
    `Respond STRICTLY in JSON with the following schema: {"answer": string, "supported_by_facts": boolean, "citations": string[]} ` +
    `Where citations must reference the [id] values from Context Facts below. If not supported, set supported_by_facts=false and craft a brief fallback that says you are not sure and offers contact at ${contactEmail}. ` +
    `If you cannot answer from facts, say: "I’m not sure about that — you can email Sandeep at ${contactEmail} or use the contact form on the site." ` +
    `Do not invent facts. Provide short links to Projects/Resume sections when relevant and ask one follow-up question if helpful.`+
    `Always read the information you have and then answer mindfully. The JSON.answer must be clean Markdown (no code fences), use bullet points when helpful, and bold key entities with **bold**.`
  );
}

function smallTalkReply(message: string): string | null {
  const q = normalize(message);
  const greet = /^(hi|hii|hello|hey|yo|hola)\b/;
  if (greet.test(q)) {
    return 'Hey! I\'m Klaus — Sandeep\'s portfolio assistant. Ask me about projects, skills, experience, or how to contact him.';
  }
  if (/^thank(s| you)\b/.test(q)) {
    return 'You\'re welcome! If you\'d like, I can share a quick summary of Sandeep\'s recent projects.';
  }
  if (/how are you|how\'s it going|hows it going/.test(q)) {
    return 'Doing great and ready to help. What would you like to know about Sandeep?';
  }
  return null;
}

function normalize(input: string): string {
  return (input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(input: string): string[] {
  return normalize(input)
    .split(' ')
    .filter((t) => t.length >= 3);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function similarityScore(queryTokens: string[], factText: string, factId: string, intentKeywords: string[] = []): number {
  const factTokens = tokenize(`${factText} ${factId}`);
  let score = 0;
  for (const q of queryTokens) {
    for (const t of factTokens) {
      if (t.includes(q) || q.includes(t)) {
        score += 2; // strong partial/exact
        break;
      }
      if (q.length >= 5 && t.length >= 5) {
        const dist = levenshtein(q, t);
        if (dist <= 1) { // minor typo tolerance
          score += 1;
          break;
        }
      }
    }
  }
  // Intent alignment boosts
  if (intentKeywords.length > 0) {
    const factJoined = factTokens.join(' ');
    let aligned = false;
    for (const k of intentKeywords) {
      if (factJoined.includes(k)) { aligned = true; break; }
    }
    if (aligned) score += 4; else score -= 2; // prefer on-topic facts
  }
  return score;
}

type Intent = { name: 'ml' | 'identity' | 'general'; keywords: string[] };

function detectIntent(message: string): Intent {
  const q = normalize(message);
  const mlKeywords = ['machine', 'learning', 'ml', 'scikit', 'tensorflow', 'keras', 'pytorch', 'hugging', 'vision', 'nlp', 'deep'];
  const tokens = q.split(' ');
  const hit = tokens.some((t) => mlKeywords.includes(t));
  if (hit || /machine\s+learning|deep\s+learning|computer\s+vision|nlp/.test(q)) {
    return { name: 'ml', keywords: mlKeywords };
  }
  const identityKeywords = ['master', 'owner', 'creator', 'author', 'made', 'built', 'who', 'klaus', 'portfolio', 'sandeep'];
  const identityHit = identityKeywords.some((k) => q.includes(k));
  if (identityHit) {
    return { name: 'identity', keywords: identityKeywords };
  }
  return { name: 'general', keywords: [] };
}

// Markdown knowledge base loader (cached)
declare global {
  // eslint-disable-next-line no-var
  var __klausMdFacts: Fact[] | undefined;
}

function parseMarkdownFacts(markdown: string): Fact[] {
  const lines = markdown.split(/\r?\n/);
  const facts: Fact[] = [];
  let currentId = '';
  let buffer: string[] = [];
  let paraIndex = 0;
  const flush = () => {
    const text = buffer.join(' ').trim();
    if (text.length > 0) {
      const id = currentId ? `${currentId}-${paraIndex++}` : `kb-${facts.length}`;
      facts.push({ id, text });
    }
    buffer = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flush();
      const slug = headingMatch[2]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      currentId = slug;
      paraIndex = 0;
      continue;
    }
    if (line.length === 0) {
      flush();
      continue;
    }
    buffer.push(line.replace(/^[-*]\s+/, ''));
  }
  flush();
  return facts;
}

function loadMarkdownFacts(): Fact[] {
  if (process.env.NODE_ENV === 'production' && globalThis.__klausMdFacts) return globalThis.__klausMdFacts;
  try {
    const kbPath = path.join(process.cwd(), 'src', 'data', 'site_facts.md');
    if (fs.existsSync(kbPath)) {
      const md = fs.readFileSync(kbPath, 'utf8');
      const facts = parseMarkdownFacts(md);
      globalThis.__klausMdFacts = facts;
      return facts;
    }
  } catch (err) {
    console.error('[Klaus] failed loading markdown KB', err);
  }
  globalThis.__klausMdFacts = [];
  return [];
}

function selectRelevantFacts(message: string): Fact[] {
  const qTokens = tokenize(message || '');
  const mdFacts = loadMarkdownFacts();
  const source: Fact[] = mdFacts.length > 0 ? mdFacts : (siteFactsJson as Fact[]);
  const intent = detectIntent(message || '');
  const facts = source
    .map((f) => ({ f, s: similarityScore(qTokens, f.text, f.id, intent.keywords) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map(({ f }) => f);
  return facts;
}

function buildPrompt(message: string, history: ChatMessage[]): string {
  const system = buildSystemPrompt();
  const facts = selectRelevantFacts(message);
  const intent = detectIntent(message);
  const historyText = history
    .slice(-10)
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
  const context = facts.length > 0
    ? `\n\nContext Facts (cite by [id]):\n${facts.map((f) => `- [${f.id}] ${f.text}`).join('\n')}`
    : '';
  const intentLine = intent.name === 'ml'
    ? `\n\nIntent: MACHINE LEARNING. Only answer about machine learning, ML skills, or ML-labeled projects. Ignore unrelated AI-native engineering facts unless they explicitly mention ML.`
    : '';
  return `${system}${intentLine}${context}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;
}

async function callGemini(promptText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fail closed but with a clear message to the UI
    return 'I’m not sure about that right now — the backend API key is not configured. Please try again later or use the contact form. — Klaus';
  }

  // Public Generative Language API (free tier). Adjust model if desired.
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // We send a single user-turn containing our composed system + context + user message.
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }],
      },
    ],
  } as const;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // Note: no streaming in this minimal example
  });

  if (!resp.ok) {
    let providerMessage = '';
    try {
      const asJson = await resp.json();
      providerMessage = asJson?.error?.message || JSON.stringify(asJson);
    } catch {
      providerMessage = await resp.text().catch(() => '');
    }
    console.error('[Klaus] Gemini error', resp.status, providerMessage);
    if (process.env.NODE_ENV !== 'production') {
      if (resp.status === 401 || resp.status === 403) {
        return 'Server config issue: GEMINI_API_KEY is missing or invalid. Update .env.local and restart. — Klaus';
      }
      if (resp.status === 404) {
        return 'Server config issue: model name might be wrong. Try GEMINI_MODEL=gemini-1.5-flash. — Klaus';
      }
    }
    return 'Sorry — my brain is having a moment. Please try again in a bit or reach out via the contact form. — Klaus';
  }

  const data: unknown = await resp.json();
  const text = extractGeminiText(data);
  if (typeof text === 'string' && text.trim().length > 0) return text.trim();
  return 'I could not find an answer in my available facts. Feel free to ask differently or use the contact form. — Klaus';
}

export async function POST(req: Request) {
  try {
    const { message, history = [], pageUrl } = await req.json().catch(() => ({ message: '', history: [], pageUrl: '' }));

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ reply: 'Please type a question for me to help with. — Klaus' }, { status: 200 });
    }

    // Handle small-talk/greetings locally for natural responses without strict grounding
    const chit = smallTalkReply(message);
    if (chit) {
      return NextResponse.json({ reply: chit });
    }

    // Persist conversation per page as a lightweight key (better: use a proper session id)
    const sessionKey = `default:${(pageUrl || '').slice(0, 200)}`;
    const store = getSessionStore();
    const existing = store.get(sessionKey) || [];
    const mergedHistory: ChatMessage[] = [...existing, ...history].slice(-10);

    const prompt = buildPrompt(message, mergedHistory);
    const rawReply = await callGemini(prompt);
    let reply = sanitizeReply(rawReply);
    try {
      const extracted = extractJsonFromText(rawReply);
      const parsed = extracted ? (JSON.parse(extracted) as { answer?: string; supported_by_facts?: boolean; citations?: string[] }) : undefined;
      if (parsed && typeof parsed.answer === 'string') {
        if (parsed.supported_by_facts && Array.isArray(parsed.citations) && parsed.citations.length > 0) {
          reply = sanitizeReply(parsed.answer);
        } else {
          reply = `I’m not sure about that — you can email Sandeep at ${getContactEmail()} or use the contact form on the site.`;
        }
      }
    } catch {
      // if model didn't return JSON, keep original sanitized reply
    }

    const updated: ChatMessage[] = [
      ...mergedHistory,
      { role: 'user', content: message } as ChatMessage,
      { role: 'assistant', content: reply } as ChatMessage,
    ];
    store.set(sessionKey, updated);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[Klaus] handler failed', err);
    return NextResponse.json({ reply: 'Something went wrong on the server. Please try again later. — Klaus' }, { status: 200 });
  }
}

export async function GET() {
  try {
    const apiKeyPresent = !!process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!apiKeyPresent) {
      return NextResponse.json({ ok: false, hasKey: false, model, note: 'GEMINI_API_KEY is missing' }, { status: 200 });
    }
    // Try a tiny probe call to validate connectivity and key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const payload = { contents: [{ role: 'user', parts: [{ text: 'ping (respond with: pong)' }] }] } as const;
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      console.error('[Klaus] health probe failed', r.status, t);
      return NextResponse.json({ ok: false, hasKey: true, model, providerStatus: r.status }, { status: 200 });
    }
    const j: unknown = await r.json();
    const text = extractGeminiText(j) || '';
    const ok = typeof text === 'string' && text.length > 0;
    return NextResponse.json({ ok, hasKey: true, model }, { status: 200 });
  } catch (err) {
    console.error('[Klaus] health endpoint error', err);
    return NextResponse.json({ ok: false, error: 'healthcheck_failed' }, { status: 200 });
  }
}

function sanitizeReply(text: string): string {
  if (!text) return text;
  // Remove common signature variants like "— Klaus", "-- Klaus", "- Klaus" at line end
  const cleaned = text
    .replace(/[\s\n]*[—–-]{1,2}\s*Klaus\.?\s*$/i, '')
    .trim();
  return cleaned;
}

function extractJsonFromText(text: string): string | undefined {
  if (!text) return undefined;
  // Try code fence first
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  if (fence && fence[1]) return fence[1].trim();
  // Try to find first { ... } block
  const braceIdx = text.indexOf('{');
  if (braceIdx >= 0) {
    const tail = text.slice(braceIdx);
    // naive balance
    let depth = 0;
    for (let i = 0; i < tail.length; i++) {
      const ch = tail[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return tail.slice(0, i + 1);
      }
    }
  }
  return undefined;
}

function extractGeminiText(data: unknown): string | undefined {
  const d = data as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>;
  };
  return d?.candidates?.[0]?.content?.parts?.[0]?.text;
}



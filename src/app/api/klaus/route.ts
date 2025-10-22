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
    `Where citations must reference ONLY the exact [id] values from Context Facts below (no invented ids). If ANY citation is not present in Context Facts, you MUST set supported_by_facts=false. If not supported, set supported_by_facts=false and craft a brief, natural fallback that acknowledges the user's intent (e.g., if they ask for a phone number, say you don't have it) and offer contact at ${contactEmail} or the contact form. ` +
    `If you cannot answer from facts, politely say you don't have that information and offer to connect via email at ${contactEmail} or the contact form. Do not output any specific phone numbers or private data unless explicitly present in Context Facts.` +
    `Do not invent facts. Provide short links to Projects/Resume sections when relevant and ask one follow-up question if helpful.`+
    `Always read the information you have and then answer mindfully. The JSON.answer must be clean Markdown (no code fences), use bullet points when helpful, and bold key entities with **bold**.`+
    `You are able to give basic greetings and small talk as long as they are not related to facts regarding Sandeep or his projects.`
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
      if (q.length >= 4 && t.length >= 4) {
        const dist = levenshtein(q, t);
        // allow a bit more fuzziness to catch common typos like 'scholl' vs 'school', 'cllg' vs 'college'
        if (dist <= 2) {
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

function getOriginFromPageUrl(pageUrl?: string): string | null {
  try {
    if (!pageUrl) return null;
    const u = new URL(pageUrl);
    return u.origin;
  } catch {
    return null;
  }
}

function buildPrompt(message: string, history: ChatMessage[], pageUrl?: string): string {
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
  const origin = getOriginFromPageUrl(pageUrl) || process.env.SITE_BASE_URL || '';
  const linkPolicy = origin
    ? `\n\nLink policy: Use only these exact links when relevant — Projects: ${origin}/#projects , Resume: ${origin}/Resume.pdf . Do not use other domains.`
    : `\n\nLink policy: Use only relative links when relevant — Projects: /#projects , Resume: /Resume.pdf .`;
  return `${system}${intentLine}${linkPolicy}${context}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;
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

    const reply = await routerAgent(message, mergedHistory, pageUrl);

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

function rewriteSiteLinks(answer: string, pageUrl?: string): string {
  if (!answer) return answer;
  const origin = getOriginFromPageUrl(pageUrl) || process.env.SITE_BASE_URL || '';
  const projects = origin ? `${origin}/#projects` : '/#projects';
  const resume = origin ? `${origin}/Resume.pdf` : '/Resume.pdf';
  let out = answer;
  // Replace any references to known old domains pointing to projects
  out = out.replace(/https?:\/\/[^\s)]+\/#projects/g, projects);
  // Replace generic 'Projects page' bracketed links if present
  out = out.replace(/\[Projects[^\]]*\]\([^\)]+\)/gi, `[Projects](${projects})`);
  // Normalize resume links
  out = out.replace(/https?:\/\/[^\s)]+\/Resume\.pdf/gi, resume);
  return out;
}


// ===== Agentic RAG helpers (embeddings + router) =====
function expandUserQuery(message: string): string {
  const q = normalize(message);
  // very small synonym expansions for common short typos
  if (/\bclg|cllg|college\b/.test(q)) {
    return `${message} college education university`;
  }
  if (/\bschl|scholl|school\b/.test(q)) {
    return `${message} school education academics`; 
  }
  if (/\bedu|education\b/.test(q)) {
    return `${message} VIT Bhopal University CGPA bachelor`;
  }
  // program/degree semantics (general, not hard-coded to any school)
  if (/\bdegree|program|course\b/.test(q)) {
    return `${message} bachelor masters b.tech b.e. bs ms program`;
  }
  if (/\benroll|enrolled|studying|study\b/.test(q)) {
    return `${message} degree program university college`;
  }
  return message;
}

type KbVec = { id: string; text: string; embedding: number[] };

function cosineSim(a: number[], b: number[]): number {
  let dot = 0; let na = 0; let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

let __kbCache: KbVec[] | null = null;
function loadKbVectors(): KbVec[] {
  if (__kbCache) return __kbCache;
  try {
    const p = path.join(process.cwd(), 'src', 'data', 'kb_embeddings.json');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      const arr = JSON.parse(raw) as KbVec[];
      __kbCache = Array.isArray(arr) ? arr : [];
      return __kbCache;
    }
  } catch (e) {
    console.error('[Klaus] loadKbVectors failed', e);
  }
  __kbCache = [];
  return __kbCache;
}

async function embedQuery(text: string): Promise<number[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.GEMINI_EMBED_MODEL || 'text-embedding-004';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
  const payload = { content: { parts: [{ text }] }, taskType: 'RETRIEVAL_QUERY' } as const;
  const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!resp.ok) { console.error('[Klaus] embedQuery error', resp.status); return null; }
  const j: any = await resp.json().catch(() => ({}));
  const vals: number[] = j?.embedding?.values || j?.embedding?.value || j?.embeddings?.[0]?.values || j?.embeddings?.[0]?.value || [];
  return Array.isArray(vals) && vals.length > 0 ? vals.map(Number) : null;
}

type SourceFilter = 'any' | 'kb' | 'li';
function idHasSource(id: string, src: SourceFilter): boolean {
  if (src === 'any') return true;
  return id.startsWith(src + ':');
}

async function retrieveEmbeddingFactsScoped(query: string, k = 6, src: SourceFilter = 'any'): Promise<Fact[]> {
  const kb = loadKbVectors();
  if (kb.length === 0) return [];
  const qEmb = await embedQuery(query);
  if (!qEmb) return [];
  const shortQuery = (query || '').trim().split(/\s+/).filter(Boolean).length <= 3;
  const cutoff = shortQuery ? 0.1 : 0.2;
  const scored = kb
    .filter((d) => idHasSource(d.id, src))
    .map((d) => ({ d, s: cosineSim(qEmb, d.embedding) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .filter((x) => x.s > cutoff)
    .map(({ d }) => ({ id: d.id, text: d.text }));
  return scored;
}

function classifyDomain(message: string): SourceFilter {
  const q = normalize(message);
  const liHints = [
    'linkedin', 'resume', 'cv', 'work history', 'work experience', 'experience',
    'job', 'roles', 'positions', 'employer', 'company', 'education', 'certification',
    'skills', 'endorsements', 'recommendations',
  ];
  if (liHints.some((k) => q.includes(k))) return 'li';
  const kbHints = ['portfolio', 'project', 'this site', 'on your site'];
  if (kbHints.some((k) => q.includes(k))) return 'kb';
  return 'any';
}

function formatContextFacts(facts: Fact[]): string {
  return facts.length
    ? `\n\nContext Facts (cite by [id]):\n${facts.map((f) => `- [${f.id}] ${f.text}`).join('\n')}`
    : '';
}

// Unified retrieval: embeddings first; if empty/weak, fall back to lexical facts
async function retrieveUnifiedFacts(query: string, k: number, src: SourceFilter): Promise<Fact[]> {
  const emb = await retrieveEmbeddingFactsScoped(query, k, src);
  if (emb.length > 0) return emb;
  // fallback to lexical using existing selector but without limiting to src prefixes (site facts are all kb)
  const lexical = selectRelevantFacts(query);
  return lexical.slice(0, k);
}

async function improveQueries(message: string, facts: Fact[]): Promise<string[]> {
  const prompt = [
    'You will write up to 3 concise search queries for a vector DB to answer the user.',
    'Use only essential keywords and entities; each under 8 words.',
    'Return JSON array of strings, no prose.',
    '',
    `User: ${message}`,
    facts.length ? `Known facts:\n${facts.map((f) => `- ${f.text}`).join('\n')}` : '',
  ].join('\n');
  const raw = await callGemini(prompt);
  try {
    const json = extractJsonFromText(raw) || raw;
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string').slice(0, 3) : [];
  } catch {
    return [];
  }
}

async function agentAnswerScoped(message: string, history: ChatMessage[], pageUrl: string | undefined, src: SourceFilter): Promise<string> {
  const origin = getOriginFromPageUrl(pageUrl) || process.env.SITE_BASE_URL || '';
  let workingQuery = expandUserQuery(message);
  for (let turn = 0; turn < 2; turn++) {
    const facts = await retrieveUnifiedFacts(workingQuery, 6, src);

    const system = buildSystemPrompt();
    const linkPolicy = origin
      ? `\n\nLink policy: Use only these exact links when relevant — Projects: ${origin}/#projects , Resume: ${origin}/Resume.pdf .`
      : `\n\nLink policy: Use only relative links when relevant — Projects: /#projects , Resume: /Resume.pdf .`;
    const historyText = history.slice(-10).map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = `${system}${linkPolicy}${formatContextFacts(facts)}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;

    const raw = await callGemini(prompt);
    try {
      const extracted = extractJsonFromText(raw);
      if (extracted) {
        const parsed = JSON.parse(extracted) as { answer?: string; supported_by_facts?: boolean; citations?: string[] };
        const contextIds = new Set(facts.map((f) => f.id));
        const allCitationsValid = Array.isArray(parsed?.citations) && parsed.citations.length > 0 && parsed.citations.every((c) => contextIds.has(c));
        if (parsed?.supported_by_facts && allCitationsValid && parsed.answer) {
          return rewriteSiteLinks(sanitizeReply(parsed.answer), pageUrl);
        }
        // If unsupported, allow a natural fallback generated by the model
        if (parsed && parsed.supported_by_facts === false && typeof parsed.answer === 'string' && parsed.answer.trim().length > 0) {
          return rewriteSiteLinks(sanitizeReply(parsed.answer), pageUrl);
        }
      }
    } catch {}

    // Attempt a citation-repair pass with the same facts
    const repaired = await enforceGroundedAnswer(message, facts, history, origin, pageUrl);
    if (repaired) return repaired;

    // Heuristic auto-grounding: accept answer if each sentence is supported by provided facts
    const auto = await autoGroundedAnswer(raw, facts, pageUrl);
    if (auto) return auto;

    // If the user is clearly asking for degree/education and we have an education fact in context, extract program via a constrained prompt
    if (/\bdegree|program|course|major|study|studying|enrolled\b/i.test(message) && facts.length > 0) {
      const eduPrompt = [
        'From the provided facts, extract the exact degree/program and university if present. Return strictly JSON:',
        '{"answer": string, "supported_by_facts": boolean, "citations": string[]}',
        'Do not invent anything. If not present, set supported_by_facts=false and answer with a brief polite fallback.',
        '',
        'Facts:',
        ...facts.map((f) => `- [${f.id}] ${f.text}`)
      ].join('\n');
      const eduRaw = await callGemini(eduPrompt);
      try {
        const ex = extractJsonFromText(eduRaw);
        if (ex) {
          const p = JSON.parse(ex) as { answer?: string; supported_by_facts?: boolean; citations?: string[] };
          const contextIds = new Set(facts.map((f) => f.id));
          const allOk = Array.isArray(p?.citations) && p.citations.length > 0 && p.citations.every((c) => contextIds.has(c));
          if (p?.supported_by_facts && allOk && p.answer) return rewriteSiteLinks(sanitizeReply(p.answer), pageUrl);
        }
      } catch {}
    }

    if (turn === 0) {
      const suggestions = await improveQueries(message, facts);
      if (suggestions.length > 0) {
        workingQuery = `${message} ${suggestions[0]}`;
        continue;
      }
    }
    break;
  }
  return `I’m not sure about that — you can email Sandeep at ${getContactEmail()} or use the contact form on the site.`;
}

async function routerAgent(message: string, history: ChatMessage[], pageUrl?: string): Promise<string> {
  const src = classifyDomain(message);
  return agentAnswerScoped(message, history, pageUrl, src);
}

async function enforceGroundedAnswer(message: string, facts: Fact[], history: ChatMessage[], origin: string, pageUrl?: string): Promise<string | null> {
  if (facts.length === 0) return null;
  const historyText = history.slice(-6).map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
  const linkPolicy = origin
    ? `\n\nLink policy: Use only these exact links when relevant — Projects: ${origin}/#projects , Resume: ${origin}/Resume.pdf .`
    : `\n\nLink policy: Use only relative links when relevant — Projects: /#projects , Resume: /Resume.pdf .`;
  const system = buildSystemPrompt();
  const enforcement = `\n\nIMPORTANT: Use only these citation ids: ${facts.map((f) => `[${f.id}]`).join(', ')}. Do NOT invent new ids. If you cannot support the answer with ONLY these ids, set supported_by_facts=false.`;
  const prompt = `${system}${linkPolicy}${formatContextFacts(facts)}${enforcement}\n\n${historyText ? historyText + '\n' : ''}User: ${message}\nAssistant:`;
  const raw = await callGemini(prompt);
  try {
    const extracted = extractJsonFromText(raw);
    if (!extracted) return null;
    const parsed = JSON.parse(extracted) as { answer?: string; supported_by_facts?: boolean; citations?: string[] };
    const contextIds = new Set(facts.map((f) => f.id));
    const allCitationsValid = Array.isArray(parsed?.citations) && parsed.citations.length > 0 && parsed.citations.every((c) => contextIds.has(c));
    if (parsed?.supported_by_facts && allCitationsValid && parsed.answer) {
      return rewriteSiteLinks(sanitizeReply(parsed.answer), pageUrl);
    }
  } catch {}
  return null;
}

function splitSentences(text: string): string[] {
  return (text || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function scoreSupport(sentence: string, facts: Fact[]): number {
  const qTokens = tokenize(sentence);
  let best = 0;
  for (const f of facts) {
    const s = similarityScore(qTokens, f.text, f.id);
    if (s > best) best = s;
  }
  return best;
}

function groundAnswerAgainstFacts(answer: string, facts: Fact[]): { supported: boolean; citations: string[] } {
  const sentences = splitSentences(answer);
  const citations = new Set<string>();
  let allSupported = true;
  for (const s of sentences) {
    const qTokens = tokenize(s);
    if (qTokens.length < 3) continue; // ignore trivial sentences
    let bestFact: Fact | null = null;
    let bestScore = -Infinity;
    for (const f of facts) {
      const sc = similarityScore(qTokens, f.text, f.id);
      if (sc > bestScore) { bestScore = sc; bestFact = f; }
    }
    if (bestFact && bestScore >= 3) {
      citations.add(bestFact.id);
    } else {
      allSupported = false;
      break;
    }
  }
  return { supported: allSupported && citations.size > 0, citations: Array.from(citations).slice(0, 4) };
}

async function autoGroundedAnswer(rawModelText: string, facts: Fact[], pageUrl?: string): Promise<string | null> {
  const extracted = extractJsonFromText(rawModelText);
  const candidate = extracted ? (() => { try { const p = JSON.parse(extracted) as { answer?: string }; return p.answer || ''; } catch { return ''; } })() : rawModelText;
  const answer = sanitizeReply(candidate || '');
  if (!answer) return null;
  const res = groundAnswerAgainstFacts(answer, facts);
  if (res.supported) {
    return rewriteSiteLinks(answer, pageUrl);
  }
  return null;
}


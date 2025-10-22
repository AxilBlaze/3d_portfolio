import fs from 'node:fs';
import path from 'node:path';

function loadEnvFiles() {
  const root = process.cwd();
  const candidates = ['.env.local', '.env'];
  for (const name of candidates) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    try {
      const txt = fs.readFileSync(p, 'utf8');
      for (const rawLine of txt.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
        if (!m) continue;
        const key = m[1];
        let val = m[2];
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    } catch {}
  }
}

function tokenizeMd(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let curId = '';
  let buf = [];
  let para = 0;
  const flush = () => {
    const text = buf.join(' ').trim();
    if (text.length > 0) {
      const id = curId ? `kb:${curId}-${para++}` : `kb:kb-${out.length}`;
      out.push({ id, text });
    }
    buf = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    const m = /^(#{1,6})\s+(.+)$/.exec(line);
    if (m) {
      flush();
      const slug = m[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      curId = slug;
      para = 0;
      continue;
    }
    if (line.length === 0) { flush(); continue; }
    buf.push(line.replace(/^[-*]\s+/, ''));
  }
  flush();
  return out;
}

function flattenLinkedIn(li) {
  if (!li || typeof li !== 'object') return [];
  const docs = [];

  const safe = (v) => (v ?? '').toString().trim();

  if (li.headline) docs.push({ id: `li:headline`, text: `Headline: ${safe(li.headline)}` });
  if (li.summary) docs.push({ id: `li:about`, text: `About: ${safe(li.summary)}` });

  (li.experiences || li.positions || []).forEach((p, i) => {
    const company = safe(p.company || p.company_name || p.organization);
    const title = safe(p.title || p.position);
    const loc = safe(p.location);
    const desc = safe(p.description || p.summary);
    const from = [safe(p.start_date?.year), safe(p.start_date?.month)].filter(Boolean).join('-');
    const to = [safe(p.end_date?.year), safe(p.end_date?.month)].filter(Boolean).join('-') || (p.current ? 'Present' : '');
    const text = [
      `Experience: ${title}`,
      company && `Company: ${company}`,
      loc && `Location: ${loc}`,
      from && `From: ${from}`,
      to && `To: ${to}`,
      desc && `Details: ${desc}`
    ].filter(Boolean).join(' | ');
    if (text) docs.push({ id: `li:exp:${i}`, text });
  });

  (li.educations || []).forEach((e, i) => {
    const school = safe(e.school || e.school_name);
    const degree = safe(e.degree_name || e.degree);
    const field = safe(e.field_of_study);
    const text = [`Education: ${school}`, degree && `Degree: ${degree}`, field && `Field: ${field}`].filter(Boolean).join(' | ');
    if (text) docs.push({ id: `li:edu:${i}`, text });
  });

  (li.certifications || []).forEach((c, i) => {
    const name = safe(c.name);
    const org = safe(c.authority || c.issuer);
    const lic = safe(c.license_number);
    const url = safe(c.url);
    const text = [`Certification: ${name}`, org && `Issuer: ${org}`, lic && `License: ${lic}`, url && `URL: ${url}`].filter(Boolean).join(' | ');
    if (text) docs.push({ id: `li:cert:${i}`, text });
  });

  (li.skills || []).forEach((s, i) => {
    const name = typeof s === 'string' ? s : safe(s.name);
    if (name) docs.push({ id: `li:skill:${i}`, text: `Skill: ${name}` });
  });

  (li.projects || []).forEach((p, i) => {
    const name = safe(p.name || p.title);
    const desc = safe(p.description);
    const url = safe(p.url);
    const text = [`Project: ${name}`, desc && `Details: ${desc}`, url && `URL: ${url}`].filter(Boolean).join(' | ');
    if (text) docs.push({ id: `li:proj:${i}`, text });
  });

  return docs;
}

async function embedOne(text, apiKey, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
  const payload = { content: { parts: [{ text }] }, taskType: 'RETRIEVAL_DOCUMENT' };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error(`embed failed ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const v = j?.embedding?.values || j?.embedding?.value || j?.embeddings?.[0]?.values || j?.embeddings?.[0]?.value;
  if (!Array.isArray(v)) throw new Error('no embedding in response');
  return v.map(Number);
}

async function main() {
  loadEnvFiles();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.error('GEMINI_API_KEY missing'); process.exit(1); }
  const model = process.env.GEMINI_EMBED_MODEL || 'text-embedding-004';

  const root = process.cwd();
  const mdPath = path.join(root, 'src', 'data', 'site_facts.md');
  const jsonPath = path.join(root, 'src', 'data', 'site_facts.json');
  const liPath = path.join(root, 'src', 'data', 'linkedin_profile.json');

  const docs = [];
  if (fs.existsSync(mdPath)) {
    const md = fs.readFileSync(mdPath, 'utf8');
    docs.push(...tokenizeMd(md));
  }
  if (fs.existsSync(jsonPath)) {
    const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    for (const x of j) if (x?.text) docs.push({ id: `kb:${x.id || `json-${docs.length}`}`, text: x.text });
  }
  if (fs.existsSync(liPath)) {
    const li = JSON.parse(fs.readFileSync(liPath, 'utf8'));
    docs.push(...flattenLinkedIn(li));
  }
  if (docs.length === 0) { console.error('No docs found'); process.exit(1); }

  console.log(`Embedding ${docs.length} docs...`);
  const out = [];
  for (const d of docs) {
    const emb = await embedOne(d.text, apiKey, model);
    out.push({ id: d.id, text: d.text, embedding: emb });
  }
  const outPath = path.join(root, 'src', 'data', 'kb_embeddings.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });



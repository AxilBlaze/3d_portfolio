import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'linkedin_profile.json');

function readCached(): unknown | null {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch {
    // Ignore file read errors
  }
  return null;
}

export async function GET() {
  try {
    const cached = readCached();
    return NextResponse.json({ ok: true, cached: !!cached, profile: cached || null });
  } catch {
    return NextResponse.json({ ok: false, error: 'read_failed' }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json().catch(() => ({ url: process.env.LINKEDIN_PROFILE_URL || '' }));
    const apiKey = process.env.PROXYCURL_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: false, error: 'no_api_key' }, { status: 200 });
    if (!url) return NextResponse.json({ ok: false, error: 'no_profile_url' }, { status: 200 });

    const r = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!r.ok) {
      const t = await r.text().catch(() => '');
      return NextResponse.json({ ok: false, status: r.status, error: t.slice(0, 300) }, { status: 200 });
    }
    const profile = await r.json();

    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(profile, null, 2), 'utf8');

    return NextResponse.json({ ok: true, saved: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'refresh_failed' }, { status: 200 });
  }
}



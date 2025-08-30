import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

// Daily email cap (best-effort in-memory). For production, back with a persistent store.
const EMAIL_DAILY_LIMIT = process.env.CONTACT_DAILY_LIMIT
  ? Number(process.env.CONTACT_DAILY_LIMIT)
  : 100;

type DailyCounter = { dateKey: string; count: number };

declare global {
  // eslint-disable-next-line no-var
  var __emailDailyCounter: DailyCounter | undefined;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function isLimitReached(): boolean {
  const today = getTodayKey();
  const counter = globalThis.__emailDailyCounter;
  if (!counter || counter.dateKey !== today) {
    globalThis.__emailDailyCounter = { dateKey: today, count: 0 };
    return false;
  }
  return counter.count >= EMAIL_DAILY_LIMIT;
}

function incrementCounter(): void {
  const today = getTodayKey();
  const counter = globalThis.__emailDailyCounter;
  if (!counter || counter.dateKey !== today) {
    globalThis.__emailDailyCounter = { dateKey: today, count: 1 };
    return;
  }
  counter.count += 1;
}

export async function POST(req: Request) {
  try {
    const { message, fromEmail, fromName } = await req.json().catch(() => ({}));

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 });
    }

    if (isLimitReached()) {
      return NextResponse.json({ ok: false, error: 'Daily email limit reached' }, { status: 429 });
    }

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true' || (port === 465);
    const from = process.env.MAIL_FROM || user;
    const to = process.env.MAIL_TO || 'sandeepcool2036@gmail.com';

    if (!host || !port || !user || !pass || !from || !to) {
      return NextResponse.json({ ok: false, error: 'Email is not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const subject = `New message from portfolio${fromName ? ` - ${fromName}` : ''}`;
    const textBody = `From: ${fromName || 'Anonymous'} ${fromEmail ? `<${fromEmail}>` : ''}\n\n${message}`;
    const htmlBody = `<div>
<p><strong>From:</strong> ${fromName || 'Anonymous'} ${fromEmail ? `&lt;${fromEmail}&gt;` : ''}</p>
<pre style="white-space:pre-wrap;font-family:ui-monospace, Menlo, Consolas, monospace">${escapeHtml(message)}</pre>
</div>`;

    await transporter.sendMail({ from, to, subject, text: textBody, html: htmlBody });
    incrementCounter();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Email send failed', err);
    return NextResponse.json({ ok: false, error: 'Failed to send message' }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}



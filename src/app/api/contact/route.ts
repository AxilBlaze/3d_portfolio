import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { message, fromEmail, fromName } = await req.json().catch(() => ({}));

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 });
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



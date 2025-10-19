"use client";

import React, { useEffect, useRef, useState } from 'react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function KlausWidget(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const greetRef = useRef<boolean>(false);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    const onReady = () => {
      setTimeout(() => {
        if (greetRef.current) return;
        greetRef.current = true;
        // ephemeral bubble near button
        const host = document.getElementById('klaus-fab-host');
        if (!host) return;
        const bubble = document.createElement('div');
        const welcome = "Greetings, traveler! You’ve entered my master’s domain — I’m Klaus, your AI companion, here to unveil everything about my creator.";
        bubble.textContent = welcome;
        bubble.style.position = 'absolute';
        bubble.style.bottom = '78px';
        bubble.style.right = '0';
        bubble.style.background = 'rgba(255,255,255,0.88)';
        bubble.style.backdropFilter = 'blur(8px)';
        bubble.style.padding = '12px 14px';
        bubble.style.borderRadius = '14px';
        bubble.style.boxShadow = '0 12px 30px rgba(2,6,23,0.18)';
        bubble.style.border = '1px solid rgba(2,6,23,0.08)';
        bubble.style.width = 'min(420px, 92vw)';
        bubble.style.lineHeight = '1.35';
        bubble.style.color = '#0f172a';
        bubble.style.fontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        bubble.style.fontWeight = '500';
        bubble.style.pointerEvents = 'none';
        bubble.id = 'klaus-ephemeral-greet';
        host.appendChild(bubble);
        // seed intro into conversation history only
        const intro = welcome;
        setMessages((prev) => [...prev, { role: 'assistant', content: intro }]);
        setWaving(true);
        setTimeout(() => {
          const g = document.getElementById('klaus-ephemeral-greet');
          if (g) g.remove();
        }, 4500);
        setTimeout(() => setWaving(false), 2500);
      }, 700);
    };
    if (document.readyState === 'complete' || document.readyState === 'interactive') onReady();
    else document.addEventListener('DOMContentLoaded', onReady, { once: true });
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  async function send(): Promise<void> {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    try {
      const resp = await fetch('/api/klaus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages, pageUrl: window.location.href }),
      });
      const data = (await resp.json().catch(() => ({}))) as { reply?: string };
      const reply = data?.reply || "Sorry, I couldn't get a response.";
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error — please try again later.' }]);
    }
  }

  function escapeHtml(raw: string): string {
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderAssistantHtml(text: string): string {
    const safe = escapeHtml(text);
    const linked = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-cyan-700 hover:text-cyan-600">$1</a>');
    const bolded = linked.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    const lines = bolded.split(/\n+/);
    let html = '';
    let inList = false;
    for (const line of lines) {
      const liMatch = /^\s*[-\*]\s+(.+)$/.exec(line);
      if (liMatch) {
        if (!inList) { html += '<ul class="list-disc pl-5 my-1">'; inList = true; }
        html += `<li>${liMatch[1]}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (line.trim().length > 0) html += `<p class="my-1">${line}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html || bolded;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[99999] select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Chat panel */}
      <div
        className="flex flex-col items-stretch mb-3"
        style={{ display: open ? 'flex' : 'none' }}
      >
        <div className="w-[380px] max-w-[92vw] h-[520px] rounded-2xl overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(2,6,23,0.35)]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(250,253,255,0.88) 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="px-4 py-3 font-semibold flex items-center justify-between text-white bg-gradient-to-r from-cyan-500 to-teal-500">
            <div className="tracking-wide">Klaus — portfolio assistant</div>
            <button className="text-white/90 hover:text-white" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div ref={bodyRef} className="flex-1 overflow-auto p-4" style={{ background: 'radial-gradient(1200px 600px at 80% -10%, rgba(6,182,212,0.08), transparent), #f6fbff' }}>
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                {m.role === 'user' ? (
                  <span
                    className={`inline-block px-3 py-2 rounded-2xl max-w-[85%] shadow text-white rounded-br-md`}
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)' }}
                  >
                    {m.content}
                  </span>
                ) : (
                  <span
                    className={`inline-block px-3 py-2 rounded-2xl max-w-[85%] shadow bg-white/90 text-[#0b1220] border border-[#e6eef0]`}
                    dangerouslySetInnerHTML={{ __html: renderAssistantHtml(m.content) }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/60 flex gap-2 bg-white/70 backdrop-blur">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void send();
              }}
              placeholder="Ask me about Sandeep, projects, or contact..."
              className="flex-1 px-4 py-3 rounded-full text-[14px] placeholder:text-gray-400"
              style={{
                border: '1px solid rgba(2,6,23,0.12)',
                background: 'rgba(255,255,255,0.9)',
                fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
                color: '#0f172a',
                caretColor: '#0ea5e9',
                fontWeight: 600,
              }}
            />
            <button onClick={() => void send()} className="px-4 py-2.5 rounded-full text-white shadow"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Floating button host for ephemeral bubble */}
      <div id="klaus-fab-host" className="relative flex flex-col items-end">
        <button
          title="Klaus — ask me anything"
          onClick={() => setOpen((v) => !v)}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: 'linear-gradient(135deg,#5eead4,#06b6d4)', color: '#042a2b' }}
        >
          {/* Minimal formal assistant avatar (SVG) */}
          <svg width="44" height="44" viewBox="0 0 64 64" aria-hidden="true">
            {/* Head */}
            <circle cx="32" cy="18" r="10" fill="#ffdfc4" />
            {/* Hair */}
            <path d="M22 18c0-6 5-10 10-10s10 4 10 10v2H22z" fill="#2f2f2f" />
            {/* Body (suit) */}
            <rect x="18" y="28" width="28" height="22" rx="6" fill="#0b3b47" />
            {/* Shirt */}
            <path d="M32 30l6 8h-12z" fill="#ffffff" />
            {/* Tie */}
            <path d="M32 30l-3 6 3 6 3-6z" fill="#e11d48" />
            {/* Left arm */}
            <path d="M18 34c-4 2-6 6-6 10h6z" fill="#0b3b47" />
            {/* Right arm + hand (waving) */}
            <g className={`klaus-hand ${waving ? 'klaus-wave' : ''}`}>
              <path d="M46 34c4 2 6 6 6 10h-6z" fill="#0b3b47" />
              <circle cx="52" cy="22" r="4" fill="#ffdfc4" />
              <rect x="50" y="24" width="4" height="8" rx="2" fill="#ffdfc4" />
            </g>
          </svg>
        </button>
      </div>
      <style jsx>{`
        .klaus-hand { transform-origin: 48px 22px; transform-box: fill-box; }
        @keyframes klaus-wave-keyframes {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(18deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(14deg); }
          100% { transform: rotate(0deg); }
        }
        .klaus-wave { animation: klaus-wave-keyframes 700ms ease-in-out 0s 3; }
        #klaus-fab-host:hover .klaus-hand { animation: klaus-wave-keyframes 900ms ease-in-out; }
      `}</style>
    </div>
  );
}



"use client";

import { useRef, useState } from 'react';

type Win = {
  id: string;
  org: string;
  title: string;
  href: string;
  rank: string;
  rankLabel: string;
  period?: string;
  body: string;
  accent: string;
  glow: string;
};

const wins: Win[] = [
  {
    id: 'kaggle',
    org: 'Google × Kaggle',
    title: 'Agents Intensive Capstone',
    href: 'https://www.kaggle.com/competitions/agents-intensive-capstone-project/writeups/new-writeup-1763193371592',
    rank: '15',
    rankLabel: 'Top 15',
    period: 'Nov 2025 – Dec 2025',
    body: 'Selected among the Top 15 teams. Built the face-recognition module and Gemini-powered image extraction with re-ranking for semantic retrieval at 99% accuracy.',
    accent: 'from-cyan-400 to-teal-500',
    glow: 'rgba(34, 211, 238, 0.35)',
  },
  {
    id: 'meta',
    org: 'AI Track',
    title: 'Meta Hacker Cup',
    href: 'https://www.facebook.com/codingcompetitions/hacker-cup/2025/final-round/scoreboard?track=AI_CLOSED_TRACK',
    rank: '10',
    rankLabel: 'Top 10',
    period: 'Finalist',
    body: 'Reached the Top 10 globally and finished as a finalist in Meta’s official AI-focused coding competition.',
    accent: 'from-indigo-400 to-blue-600',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
];

function TiltCard({ win }: { win: Win }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, px: 50, py: 50, active: false });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * 16,
      ry: (px - 0.5) * 20,
      px: px * 100,
      py: py * 100,
      active: true,
    });
  }

  function onLeave() {
    setTilt({ rx: 0, ry: 0, px: 50, py: 50, active: false });
  }

  return (
    <div className="acc-scene" style={{ perspective: 1200 }}>
      <a
        href={win.href}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="acc-card relative block min-h-[280px] overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 no-underline"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
          transition: tilt.active ? 'transform 80ms linear' : 'transform 400ms ease',
          background: `linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.92) 100%)`,
          boxShadow: tilt.active
            ? `0 30px 60px -20px ${win.glow}, 0 0 0 1px rgba(255,255,255,0.08)`
            : `0 16px 40px -24px ${win.glow}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(420px circle at ${tilt.px}% ${tilt.py}%, ${win.glow}, transparent 55%)`,
            transform: 'translateZ(20px)',
          }}
        />
        <div
          aria-hidden
          className="acc-rank pointer-events-none absolute -right-2 -top-4 select-none font-extrabold leading-none text-white/5"
          style={{ fontSize: 'clamp(6rem, 14vw, 9rem)', transform: 'translateZ(10px)' }}
        >
          {win.rank}
        </div>
        <div className="relative" style={{ transform: 'translateZ(48px)' }}>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className={`inline-flex min-h-8 items-center rounded-full bg-gradient-to-r ${win.accent} px-3 text-xs font-bold text-slate-950`}>
              {win.rankLabel}
            </span>
            {win.period && (
              <span className="inline-flex min-h-8 items-center rounded-full border border-white/15 bg-white/5 px-3 text-xs text-gray-300">
                {win.period}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{win.org}</p>
          <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{win.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">{win.body}</p>
        </div>
        <div
          className="acc-orb pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-2xl"
          style={{ background: win.glow, transform: 'translateZ(8px)' }}
        />
      </a>
    </div>
  );
}

export default function Accomplishments() {
  return (
    <section id="accomplishments" className="relative scroll-mt-20 overflow-hidden bg-black py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="acc-grid absolute inset-0" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-white xs:text-4xl sm:text-5xl">
            Major accomplishments
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {wins.map((win) => (
            <TiltCard key={win.id} win={win} />
          ))}
        </div>
      </div>
      <style jsx global>{`
        .acc-grid {
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);
        }
        .acc-orb {
          animation: acc-float 7s ease-in-out infinite;
        }
        @keyframes acc-float {
          0%, 100% { transform: translateZ(8px) translateY(0); }
          50% { transform: translateZ(8px) translateY(-12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .acc-orb { animation: none; }
          .acc-card { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

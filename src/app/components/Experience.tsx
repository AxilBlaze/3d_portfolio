"use client";

import { useState } from 'react';

type Role = {
  id: string;
  company: string;
  title: string;
  period: string;
  location: string;
  current: boolean;
  bullets: string[];
  videoUrl?: string;
};

const CODEBLAZE_VIDEO =
  'https://www.loom.com/share/11d561e2a78a4d25aff85c16116326fe?sid=007cf708-84c4-4109-a75c-b5ff29b32f59';

const roles: Role[] = [
  {
    id: 'airdawgs',
    company: 'AirDawgs Labs',
    title: 'AI Engineer — LLM Evaluation & Benchmarking',
    period: 'Jul 2026 – Present',
    location: 'Remote (Freelance)',
    current: true,
    bullets: [
      'Engineered 10+ terminal-based coding benchmarks using Go, Docker, and deterministic verifiers to evaluate frontier models including GPT-5.5 and Claude Opus 4.8.',
      'Built differential evaluation pipelines with oracle implementations and dynamic tests, analyzing frontier-model failures to improve benchmark reliability and difficulty.',
    ],
  },
  {
    id: 'deccan',
    company: 'Deccan AI',
    title: 'Ops Associate & AI Trainer',
    period: 'Feb 2026 – May 2026',
    location: 'Remote',
    current: false,
    bullets: [
      'Annotated and ranked Gemini LLM responses across Web, Android, and iOS for RLHF/SFT workflows.',
      'Evaluated generative AI outputs for factuality, safety, relevance, and instruction-following to improve model alignment.',
    ],
  },
  {
    id: 'algo',
    company: 'AlgoUniversity (YC S21)',
    title: 'SWE Co-Op Intern',
    period: 'May 2025 – July 2025',
    location: 'Remote',
    current: false,
    bullets: [
      'Architected CodeBlaze, an AI-enabled online judge for 500+ users, with a self-built Docker-based compiler, React + Tailwind dashboards, and an LLM-assisted evaluation pipeline.',
      'Scaled backend in Django/DRF with Docker-sandboxed judging and SQLite, handling 10K+ submissions/day.',
      'Deployed secure AWS infrastructure and developed an AI coding assistant for feedback, validation, and hint generation.',
    ],
    videoUrl: CODEBLAZE_VIDEO,
  },
  {
    id: 'mp-police',
    company: 'Madhya Pradesh Police',
    title: 'Frontend Web Developer & Database Manager Intern',
    period: 'Dec 2024 – Feb 2025',
    location: 'Bhopal, Madhya Pradesh',
    current: false,
    bullets: [
      'Built intuitive React-based UI systems to digitize 50+ police forms and reduce paperwork by 70%.',
      'Automated MongoDB and Excel-based workflows, improving data retrieval and processing efficiency by 60%.',
    ],
  },
];

const rest = [
  { left: '0%', top: '0%', right: 'auto', bottom: 'auto', ry: 18, delay: '0s' },
  { left: 'auto', top: '0%', right: '0%', bottom: 'auto', ry: -18, delay: '1.5s' },
  { left: '0%', top: 'auto', right: 'auto', bottom: '0%', ry: 14, delay: '3s' },
  { left: 'auto', top: 'auto', right: '0%', bottom: '0%', ry: -14, delay: '4.5s' },
];

function finePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function reduceMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Experience() {
  const [focused, setFocused] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function focusCard(index: number) {
    setFocused(index);
    setTilt({ rx: 0, ry: 0 });
  }

  function clearFocus() {
    setFocused(null);
    setTilt({ rx: 0, ry: 0 });
  }

  function onStageLeave() {
    if (finePointer()) clearFocus();
  }

  function onCardEnter(index: number) {
    if (finePointer()) focusCard(index);
  }

  function onCardClick(index: number) {
    if (finePointer()) return;
    if (focused === index) clearFocus();
    else focusCard(index);
  }

  function onCardMove(e: React.MouseEvent<HTMLButtonElement>, index: number) {
    if (focused !== index || !finePointer() || reduceMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 8, ry: (px - 0.5) * 10 });
  }

  const live = focused !== null ? roles[focused]!.company : '';

  return (
    <section id="experience" className="relative scroll-mt-20 overflow-hidden bg-black py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="exp-stage relative mx-auto min-h-[80vh] w-full outline-none md:min-h-[85vh]"
          style={{ perspective: 1600 }}
          onMouseLeave={onStageLeave}
          onClick={(e) => {
            if (e.target === e.currentTarget && !finePointer()) clearFocus();
          }}
        >
          <h2
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-extrabold tracking-tight text-white xs:text-5xl sm:text-6xl lg:text-7xl"
            style={{
              opacity: focused === null ? 1 : 0,
              transition: 'opacity 300ms ease',
            }}
          >
            Experience
          </h2>
          {roles.map((role, i) => {
            const slot = rest[i]!;
            const isFocus = focused === i;
            const othersFocus = focused !== null && !isFocus;
            const transform = isFocus
              ? `translate(-50%, -50%) translateZ(80px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.08)`
              : `rotateY(${slot.ry}deg) translateZ(${othersFocus ? -120 : 0}px) scale(${othersFocus ? 0.86 : 1})`;

            return (
              <div
                key={role.id}
                className="absolute"
                style={{
                  left: isFocus ? '50%' : slot.left,
                  top: isFocus ? '50%' : slot.top,
                  right: isFocus ? 'auto' : slot.right,
                  bottom: isFocus ? 'auto' : slot.bottom,
                  transform,
                  opacity: othersFocus ? 0.45 : 1,
                  zIndex: isFocus ? 30 : 10,
                  transition: 'left 400ms cubic-bezier(0.22, 1, 0.36, 1), top 400ms cubic-bezier(0.22, 1, 0.36, 1), right 400ms ease, bottom 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease',
                  transformStyle: 'preserve-3d',
                }}
              >
                <button
                  type="button"
                  className={`exp-card w-[min(22rem,46vw)] rounded-3xl border border-white/10 p-5 text-left sm:w-[24rem] sm:p-6 ${isFocus ? 'exp-card-focus' : ''} ${focused === null ? 'exp-float' : ''}`}
                  style={{
                    animationDelay: slot.delay,
                    background: 'linear-gradient(160deg, rgba(15,23,42,0.96) 0%, rgba(2,6,23,0.94) 100%)',
                    boxShadow: isFocus
                      ? '0 32px 70px -20px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 16px 40px -24px rgba(0,0,0,0.85)',
                  }}
                  onMouseEnter={() => onCardEnter(i)}
                  onMouseMove={(e) => onCardMove(e, i)}
                  onClick={() => onCardClick(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (focused === i) clearFocus();
                      else focusCard(i);
                    }
                  }}
                  aria-pressed={isFocus}
                  aria-label={`${role.company}, ${role.current ? 'Current' : 'Completed'}`}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-bold ${
                        role.current
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950'
                          : 'border border-white/15 bg-white/5 text-gray-300'
                      }`}
                    >
                      {role.current ? 'Current' : 'Completed'}
                    </span>
                    <span className="text-xs text-gray-400">{role.period}</span>
                    <span className="text-xs text-gray-500">· {role.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">{role.company}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-indigo-200">{role.title}</p>
                  <div
                    className="exp-details overflow-hidden"
                    style={{
                      maxHeight: isFocus ? 280 : 0,
                      opacity: isFocus ? 1 : 0,
                      transition: 'max-height 400ms ease, opacity 300ms ease',
                    }}
                  >
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-300">
                      {role.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    {role.videoUrl && (
                      <a
                        href={role.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                      >
                        Video Link
                      </a>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {live}
        </p>
      </div>
      <style jsx>{`
        .exp-float {
          animation: exp-idle 6s ease-in-out infinite;
        }
        @keyframes exp-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .exp-float { animation: none; }
        }
      `}</style>
    </section>
  );
}


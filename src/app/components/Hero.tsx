"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import ParticleWireBackground from './ParticleWireBackground';
import { FaLinkedin, FaGithub, FaCode } from 'react-icons/fa';

const socials = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sandeep-balabantaray-69b60221b/',
    icon: <FaLinkedin size={22} />,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/AxilBlaze',
    icon: <FaGithub size={22} />,
  },
  {
    name: 'CodingProfile',
    href: 'https://codolio.com/profile/Axil_Blaze',
    icon: <FaCode size={22} />,
  },
];

const Hero = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to send');
      }
      setStatus('Message sent successfully.');
      setMessage('');
    } catch {
      setStatus('Failed to send. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-start bg-black overflow-hidden">
      <ParticleWireBackground />
      {/* Animated glowing background for the whole hero section */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(99,102,241,0.35) 0%, rgba(59,130,246,0.18) 60%, transparent 100%)',
          filter: 'blur(120px)',
          animation: 'moveGlow 18s ease-in-out infinite alternate',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex justify-between items-center">
          <div className="max-w-2xl text-left">
            <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight font-sans bg-gradient-to-r from-[#A3BFFA] via-[#7F9CF5] to-[#B794F4] text-transparent bg-clip-text">
              Sandeep Balabantaray
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed font-sans">
              I&#39;m an AI/ML engineer on a mission to drive change with intelligent systems. I craft powerful algorithms, harness data, and build solutions that make a real impact—whether it&#39;s improving lives, optimizing industries, or pushing the boundaries of innovation. AI isn&#39;t just my work; it&#39;s my tool for shaping a smarter, more connected world.
            </p>
            <form onSubmit={handleSend} className="mb-6">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Drop me a message..."
                className="bg-[#23272F] text-gray-200 placeholder-gray-400 rounded-lg px-5 py-3 w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#23272F] mb-2"
                required
              />
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white font-semibold rounded-lg px-6 py-3 shadow transition-all duration-200 w-full sm:w-auto ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSending ? 'Sending…' : 'Send Message'}
                </button>
                <a
                  href="/Resume.pdf"
                  download
                  aria-label="Download Resume"
                  className="bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-100 hover:to-gray-300 text-black font-semibold rounded-lg px-6 py-3 shadow transition-all duration-200 w-full sm:w-auto text-center"
                >
                  Download Resume
                </a>
              </div>
            {status && (
              <p className="text-sm mt-2 text-gray-300">{status}</p>
            )}
            </form>
            <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white font-semibold rounded-lg px-6 py-3 shadow transition-all duration-200 w-full sm:w-auto justify-center"
                >
                  {social.icon}
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden lg:block w-5/6 relative translate-x-20 -translate-y-8">
            <Image
              src="/brain.png"
              alt="Brain visualization"
              width={1200}
              height={1200}
              priority
              className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 animate-brain-rotate"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))',
                transform: 'scale(2.2)',
                transformOrigin: 'center',
              }}
            />
          </div>
        </div>
      </div>
      {/* Cloudy white SVG bottom with gradient for smooth transition */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 z-20" style={{height: '140px'}}>
        <svg viewBox="0 0 1440 140" width="100%" height="140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cloudFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,23,42,0.8)" />
              <stop offset="60%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
          </defs>
          <path fill="url(#cloudFade)" d="M0,80 C360,160 1080,0 1440,80 L1440,140 L0,140 Z" />
        </svg>
      </div>
      <style jsx global>{`
        @keyframes moveGlow {
          0% {
            background-position: 60% 40%;
            opacity: 0.7;
          }
          50% {
            background-position: 40% 60%;
            opacity: 1;
          }
          100% {
            background-position: 70% 30%;
            opacity: 0.7;
          }
        }

        @keyframes brainRotate {
          0% {
            transform: scale(2.2) rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: scale(2.2) rotateY(90deg) rotateX(15deg);
          }
          50% {
            transform: scale(2.2) rotateY(180deg) rotateX(0deg);
          }
          75% {
            transform: scale(2.2) rotateY(270deg) rotateX(-15deg);
          }
          100% {
            transform: scale(2.2) rotateY(360deg) rotateX(0deg);
          }
        }

        .animate-brain-rotate {
          animation: brainRotate 20s linear infinite;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Hero; 
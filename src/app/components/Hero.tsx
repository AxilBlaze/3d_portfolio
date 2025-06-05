"use client";

import React, { useState } from 'react';
import ParticleWireBackground from './ParticleWireBackground';
import { FaLinkedin, FaGithub, FaCode } from 'react-icons/fa';

const socials = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sandeepbalabantaray/',
    icon: <FaLinkedin size={22} />,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/sandeepbalabantaray',
    icon: <FaGithub size={22} />,
  },
  {
    name: 'LeetCode',
    href: 'https://leetcode.com/sandeepbalabantaray/',
    icon: <FaCode size={22} />,
  },
];

const Hero = () => {
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add your message handling logic here (e.g., send to email or API)
    alert('Message sent!');
    setMessage('');
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
        <div className="max-w-2xl text-left">
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight font-sans bg-gradient-to-r from-[#A3BFFA] via-[#7F9CF5] to-[#B794F4] text-transparent bg-clip-text">
            Sandeep Balabantaray
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed font-sans">
            I'm an AI/ML engineer on a mission to drive change with intelligent systems. I craft powerful algorithms, harness data, and build solutions that make a real impact—whether it's improving lives, optimizing industries, or pushing the boundaries of innovation. AI isn't just my work; it's my tool for shaping a smarter, more connected world.
          </p>
          <form onSubmit={handleSend} className="mb-6">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Drop me a message..."
              className="bg-[#23272F] text-gray-200 placeholder-gray-400 rounded-lg px-5 py-3 w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#23272F] mb-2"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white font-semibold rounded-lg px-6 py-3 shadow transition-all duration-200 w-full sm:w-auto"
            >
              Send Message
            </button>
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
      `}</style>
    </div>
  );
};

export default Hero; 
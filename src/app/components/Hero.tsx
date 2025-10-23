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
  const [isFlipped, setIsFlipped] = useState(false);

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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-12">
          <div className="w-full lg:max-w-2xl text-left">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight font-sans bg-gradient-to-r from-[#A3BFFA] via-[#7F9CF5] to-[#B794F4] text-transparent bg-clip-text">
              Sandeep Balabantaray
            </h1>
            <p className="text-sm xs:text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed font-sans">
              I&#39;m an AI/ML engineer on a mission to drive change with intelligent systems. I craft powerful algorithms, harness data, and build solutions that make a real impact—whether it&#39;s improving lives, optimizing industries, or pushing the boundaries of innovation. AI isn&#39;t just my work; it&#39;s my tool for shaping a smarter, more connected world.
            </p>
            <form onSubmit={handleSend} className="mb-6">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Drop me a message..."
                className="bg-[#23272F] text-gray-200 placeholder-gray-400 rounded-lg px-4 sm:px-5 py-3 w-full h-24 sm:h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#23272F] mb-3 text-sm sm:text-base"
                required
              />
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white font-semibold rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 shadow transition-all duration-200 w-full sm:w-auto text-sm sm:text-base ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSending ? 'Sending…' : 'Send Message'}
                </button>
                <a
                  href="/Resume.pdf"
                  download
                  aria-label="Download Resume"
                  className="bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-100 hover:to-gray-300 text-black font-semibold rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 shadow transition-all duration-200 w-full sm:w-auto text-center text-sm sm:text-base"
                >
                  Download Resume
                </a>
              </div>
            {status && (
              <p className="text-xs sm:text-sm mt-2 text-gray-300">{status}</p>
            )}
            </form>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-8 sm:mb-12 relative z-30">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white font-semibold rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 shadow transition-all duration-200 w-full sm:w-auto justify-center text-sm sm:text-base relative z-30"
                >
                  {social.icon}
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          {/* Mobile 3D Photo Card */}
          <div className="block lg:hidden w-full max-w-sm mx-auto relative">
            <div className="relative w-64 h-80 mx-auto" style={{ perspective: '1000px' }}>
              <div 
                className="relative w-full h-full transition-transform duration-700 ease-in-out cursor-pointer"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front - Photo */}
                <div 
                  className="mobile-photo-card absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Image
                    src="/my_photo.jpg"
                    alt="Sandeep Balabantaray"
                    fill
                    className="object-cover"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.4))',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/brain.png'; // Fallback to brain image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">Click to learn more</p>
                  </div>
                </div>
                
                {/* Back - Summary */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 flex flex-col justify-center"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                >
                  <h3 className="text-white text-lg font-bold mb-4 text-center">About Me</h3>
                  <p className="text-gray-300 text-sm leading-relaxed text-center">
                    I&apos;m a passionate Computer Science engineer skilled in full-stack development, machine learning, and AI integration. I&apos;ve built impactful projects like adaptive learning systems, healthcare platforms, and legal AI tools.
                  </p>
                  <div className="mt-4 text-center">
                    <p className="text-blue-400 text-xs">Click to flip back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop 3D Photo Card with Enhanced Right Side */}
          <div className="hidden lg:block w-5/6 relative translate-x-20 -translate-y-8 flex flex-col items-center">



            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-20 right-16 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-32 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
              <div className="absolute top-40 right-32 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Skill Icons - Right side of photo */}
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
              <div className="flex flex-col gap-8">
                {/* ML Icon */}
                <div className="relative w-32 h-32 group cursor-pointer">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(59, 130, 246, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient1)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      className="animate-spin group-hover:animate-pulse"
                      style={{ animationDuration: '3s' }}
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300">ML</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                      <div className="text-sm font-bold">Machine Learning Engineer</div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-[225deg]"></div>
                    </div>
                  </div>
                </div>

                  {/* AI Icon */}
                  <div className="relative w-32 h-32 group cursor-pointer">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(34, 197, 94, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient2)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="50.24"
                      className="animate-spin group-hover:animate-pulse"
                      style={{ animationDuration: '4s' }}
                    />
                    <defs>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300">AI</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none z-20">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                        <div className="text-sm font-bold">AI Native Engineer</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  {/* DS Icon */}
                  <div className="relative w-32 h-32 group cursor-pointer">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(168, 85, 247, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient3)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="75.36"
                      className="animate-spin group-hover:animate-pulse"
                      style={{ animationDuration: '5s' }}
                    />
                    <defs>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300">DS</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none z-20">
                      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                        <div className="text-sm font-bold">Data Scientist</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-600 rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  {/* Python Developer Icon */}
                  <div className="relative w-32 h-32 group cursor-pointer">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(245, 158, 11, 0.2)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient4)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset="100.48"
                      className="animate-spin group-hover:animate-pulse"
                      style={{ animationDuration: '6s' }}
                    />
                    <defs>
                      <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300">PY</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none z-20">
                      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-lg shadow-2xl whitespace-nowrap">
                        <div className="text-sm font-bold">Python Developer</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-600 rotate-45"></div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>


            {/* Connection Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 500">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
                  </linearGradient>
                </defs>
                <path
                  d="M350 100 Q380 200 320 300 Q280 400 250 450"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <path
                  d="M380 150 Q400 250 360 350 Q320 450 280 480"
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3,3"
                  className="animate-pulse"
                  style={{ animationDelay: '1s' }}
                />
              </svg>
            </div>

            {/* Main Photo Card */}
            <div className="relative w-96 h-[500px] mb-2" style={{ perspective: '1200px' }}>
              <div 
                className="relative w-full h-full transition-transform duration-700 ease-in-out cursor-pointer group"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
                onMouseEnter={() => {
                  if (!isFlipped) {
                    const element = document.querySelector('.desktop-photo-card') as HTMLElement;
                    if (element) {
                      element.style.transform = 'scale(1.05)';
                    }
                  }
                }}
                onMouseLeave={() => {
                  if (!isFlipped) {
                    const element = document.querySelector('.desktop-photo-card') as HTMLElement;
                    if (element) {
                      element.style.transform = 'scale(1)';
                    }
                  }
                }}
              >
                {/* Front - Photo */}
                <div 
                  className="desktop-photo-card absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
            <Image
                    src="/my_photo.jpg"
                    alt="Sandeep Balabantaray"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
              style={{
                      filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.5))',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/brain.png'; // Fallback to brain image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 z-30">
                    <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">Sandeep Balabantaray</h3>
                    <p className="text-blue-300 text-sm font-medium drop-shadow-lg">Click to learn more about me</p>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                  </div>
                </div>
                
                {/* Back - Summary */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-8 flex flex-col justify-center"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                  }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-white text-2xl font-bold mb-2">About Me</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full" />
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-300 text-base leading-relaxed">
                      I&apos;m a passionate Computer Science engineer skilled in full-stack development, machine learning, and AI integration.
                    </p>
                    
                    <p className="text-gray-300 text-base leading-relaxed">
                      I&apos;ve built impactful projects like adaptive learning systems, healthcare platforms, and legal AI tools.
                    </p>
                    
                    <p className="text-gray-300 text-base leading-relaxed">
                      My experience as a Frontend Web Developer & Database Manager for the Madhya Pradesh Police and national-level hackathon achievements reflect my drive to build intelligent, data-driven, and user-centric solutions that make a real-world impact.
                    </p>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      Click to flip back
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-blue-400/30 rounded-full" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-purple-400/30 rounded-full" />
                  <div className="absolute top-1/2 right-4 w-4 h-4 border-2 border-cyan-400/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* Stats Cards - Now positioned below the photo */}
            <div className="flex flex-row gap-4 -mt-2">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-white text-2xl font-bold text-center">1+</div>
                <div className="text-gray-300 text-sm text-center">Years Experience</div>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-white text-2xl font-bold text-center">15+</div>
                <div className="text-gray-300 text-sm text-center">Projects Built</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-white text-2xl font-bold text-center">30+</div>
                <div className="text-gray-300 text-sm text-center">Technologies</div>
              </div>
            </div>
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
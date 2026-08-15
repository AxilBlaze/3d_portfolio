import React from 'react';
import { FaLinkedin, FaGithub, FaCode } from 'react-icons/fa';

const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sandeep-balabantaray-69b60221b/', icon: <FaLinkedin size={20} /> },
  { name: 'GitHub', href: 'https://github.com/AxilBlaze', icon: <FaGithub size={20} /> },
  { name: 'Codolio', href: 'https://codolio.com/profile/Axil_Blaze', icon: <FaCode size={20} /> },
];

const Footer = () => {
  return (
    <footer className="footer-purple py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest">
          <span className="silver-shimmer">Thank you</span>
        </h2>
        <a href="#contact" className="mt-6 inline-flex min-h-11 items-center text-sm text-gray-300 hover:text-white">
          Get in touch
        </a>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              {social.icon}
              {social.name}
            </a>
          ))}
        </div>
        <p className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} Sandeep Balabantaray</p>
      </div>
      <style jsx>{`
        .footer-purple {
          background:
            radial-gradient(1200px 400px at 10% -20%, rgba(124, 58, 237, 0.20), transparent 60%),
            radial-gradient(1000px 500px at 90% 0%, rgba(59, 130, 246, 0.16), transparent 60%),
            radial-gradient(800px 400px at 50% 120%, rgba(99, 102, 241, 0.18), transparent 55%),
            linear-gradient(180deg, #0b0f1f 0%, #0d122a 45%, #0e1024 100%);
        }
        .silver-shimmer {
          background: linear-gradient(90deg, #d1d5db, #f3f4f6, #9ca3af, #f3f4f6, #d1d5db);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3.5s infinite;
          text-shadow: 0 0 12px rgba(255,255,255,0.15);
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .silver-shimmer { animation: none; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

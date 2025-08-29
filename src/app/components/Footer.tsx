import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-purple py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h3 className="text-5xl md:text-6xl font-extrabold tracking-widest">
          <span className="silver-shimmer">Thank you</span>
        </h3>
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
      `}</style>
    </footer>
  );
};

export default Footer; 
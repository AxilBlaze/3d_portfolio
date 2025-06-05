"use client";

import React from 'react';

const AnimatedBrain = () => {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full flex items-center justify-center pointer-events-none select-none">
      <div className="relative w-[40rem] h-[40rem] flex items-center justify-center">
        {/* Multiple animated wireframe elements */}
        <div className="absolute inset-0 z-0">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${50 + Math.random() * 20}% ${50 + Math.random() * 20}%, rgba(99,102,241,0.2) 0%, rgba(59,130,246,0.1) 60%, transparent 100%)`,
                filter: 'blur(40px)',
                animation: `moveWireframe${index} ${15 + Math.random() * 10}s ease-in-out infinite alternate`,
                transform: `scale(${0.8 + Math.random() * 0.4})`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {/* Main wireframe brain */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.3) 0%, rgba(59,130,246,0.15) 60%, transparent 100%)',
            filter: 'blur(20px)',
            animation: 'pulseMain 8s ease-in-out infinite',
          }}
        />

        <style jsx global>{`
          @keyframes moveWireframe0 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(20px, -20px) rotate(5deg); }
            100% { transform: translate(-20px, 20px) rotate(-5deg); }
          }
          @keyframes moveWireframe1 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-30px, 10px) rotate(-8deg); }
            100% { transform: translate(30px, -10px) rotate(8deg); }
          }
          @keyframes moveWireframe2 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(15px, 30px) rotate(12deg); }
            100% { transform: translate(-15px, -30px) rotate(-12deg); }
          }
          @keyframes moveWireframe3 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-25px, -15px) rotate(-15deg); }
            100% { transform: translate(25px, 15px) rotate(15deg); }
          }
          @keyframes moveWireframe4 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(10px, -25px) rotate(10deg); }
            100% { transform: translate(-10px, 25px) rotate(-10deg); }
          }
          @keyframes pulseMain {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.7; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AnimatedBrain; 
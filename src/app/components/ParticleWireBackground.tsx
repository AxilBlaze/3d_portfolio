"use client";

import React, { useRef, useEffect } from 'react';

const NUM_PARTICLES = 35;
const PARTICLE_COLOR = 'rgba(99,102,241,0.5)'; // Indigo-500 with reduced opacity
const LINE_COLOR = 'rgba(61, 124, 234, 0.15)'; // Lighter indigo for lines
const PARTICLE_RADIUS = 2.5;
const SPEED = 0.3;
const MAX_DIST = 220;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

type Particle = { x: number; y: number; vx: number; vy: number };

const ParticleWireBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Initialize particles
    particles.current = Array.from({ length: NUM_PARTICLES }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height * 0.7),
      vx: randomBetween(-SPEED, SPEED),
      vy: randomBetween(-SPEED, SPEED),
    }));

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      // Draw lines
      for (let i = 0; i < NUM_PARTICLES; i++) {
        for (let j = i + 1; j < NUM_PARTICLES; j++) {
          const p1 = particles.current[i]!;
          const p2 = particles.current[j]!;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx!.strokeStyle = LINE_COLOR;
            ctx!.lineWidth = 1.2;
            ctx!.beginPath();
            ctx!.moveTo(p1.x, p1.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.stroke();
          }
        }
      }
      // Draw particles
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles.current[i]!;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
        ctx!.fillStyle = PARTICLE_COLOR;
        ctx!.shadowColor = PARTICLE_COLOR;
        ctx!.shadowBlur = 12;
        ctx!.fill();
        ctx!.shadowBlur = 0;
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height * 0.7) p.vy *= -1;
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();
    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none"
      style={{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        opacity: 0.7,
      }}
    />
  );
};

export default ParticleWireBackground; 
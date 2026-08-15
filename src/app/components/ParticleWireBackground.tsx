"use client";

import React, { useRef, useEffect } from 'react';

const PARTICLE_COLOR = 'rgba(99,102,241,0.5)';
const LINE_COLOR = 'rgba(61, 124, 234, 0.15)';
const PARTICLE_RADIUS = 2.5;
const SPEED = 0.3;
const MAX_DIST = 220;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function particleCount(opts: { reduced: boolean; coarse: boolean }): number {
  if (opts.reduced) return 0;
  return opts.coarse ? 16 : 35;
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
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;
    const count = particleCount({ reduced, coarse });
    const useShadow = !coarse;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    particles.current = Array.from({ length: count }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height * 0.7),
      vx: randomBetween(-SPEED, SPEED),
      vy: randomBetween(-SPEED, SPEED),
    }));

    function drawFrame() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
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
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i]!;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
        ctx!.fillStyle = PARTICLE_COLOR;
        if (useShadow) {
          ctx!.shadowColor = PARTICLE_COLOR;
          ctx!.shadowBlur = 12;
        }
        ctx!.fill();
        ctx!.shadowBlur = 0;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height * 0.7) p.vy *= -1;
      }
    }

    function animate() {
      if (document.hidden) return;
      drawFrame();
      animationRef.current = requestAnimationFrame(animate);
    }

    if (count > 0) {
      if (reduced) {
        drawFrame();
      } else {
        animate();
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const handleVisibility = () => {
      if (document.hidden) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      } else if (!reduced && count > 0) {
        animate();
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
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

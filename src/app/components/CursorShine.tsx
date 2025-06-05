"use client";

import React, { useEffect, useState } from 'react';

const CursorShine = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 12.5%)`,
      }}
    />
  );
};

export default CursorShine; 
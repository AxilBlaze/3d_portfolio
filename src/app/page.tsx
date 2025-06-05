"use client";

import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import ThreeScene from './components/ThreeScene';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Three.js scene as background */}
      <div className="fixed inset-0 z-0">
        <ThreeScene />
      </div>

      {/* Content layers */}
      <div className="relative z-10">
      <Hero />
      <Features />
      <Footer />
      </div>
    </main>
  );
}

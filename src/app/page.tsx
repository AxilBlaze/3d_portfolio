"use client";

import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Projects from './components/Projects';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Content layers */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <Projects />
        <Footer />
      </div>
    </main>
  );
}

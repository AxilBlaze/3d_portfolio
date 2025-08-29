"use client";

import React, { useEffect, useRef, useState } from 'react';
import EducationTimeline from './EducationTimeline';
import CertificatesSection from './CertificatesSection';

const Features = () => {
  const [background, setBackground] = useState('transparent');
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = 'white';
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;
        const scrollProgress = 1 - (rect.top / viewportHeight);
        
        // Calculate background color based on scroll progress
        if (scrollProgress > 0.9) { // Start transition after 90% scroll
          setBackground('black');
        } else {
          setBackground('white');
        }
      },
      { threshold: [0, 0.15, 0.25, 0.4, 0.6, 0.8, 1.0] }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  // removed accelerators/companies section per design update

  return (
    <div
      ref={featuresRef}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-8">
        {/* Education timeline above the tech stack */}
        <EducationTimeline />
        {/* Main Content Box with SVG */}
        <div className={`w-full max-w-full flex flex-col items-center justify-start py-20 px-40 rounded-lg ${background === 'white' ? 'bg-white-pattern' : background === 'black' ? 'bg-black-pattern' : ''} transition-colors duration-1000 ease-in-out`}>
          {/* SVG Title */}
          <div className="w-full flex justify-center items-start -mt-20">
            <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <defs>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#2d3748', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#4a5568', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#718096', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#1a202c" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Main text */}
              <text x="400" y="80" 
                    style={{ fontFamily: 'Arial, sans-serif', fontSize: '48px', fontWeight: 'bold' }}
                    textAnchor="middle" 
                    fill="url(#textGradient)"
                    filter="url(#shadow)">
                YOUR
              </text>
              
              <text x="400" y="140" 
                    style={{ fontFamily: 'Arial, sans-serif', fontSize: '42px', fontWeight: '300' }}
                    textAnchor="middle" 
                    fill="#4a5568"
                    letterSpacing="2px">
                MACHINE LEARNING
              </text>
              
              <text x="400" y="180" 
                    style={{ fontFamily: 'Arial, sans-serif', fontSize: '38px', fontWeight: 'bold' }}
                    textAnchor="middle" 
                    fill="url(#textGradient)"
                    filter="url(#shadow)">
                EXPERT
              </text>
              
              {/* Decorative elements */}
              <line x1="150" y1="100" x2="250" y2="100" stroke="#718096" strokeWidth="2" opacity="0.6"/>
              <line x1="550" y1="100" x2="650" y2="100" stroke="#718096" strokeWidth="2" opacity="0.6"/>
              
              {/* Tech-inspired dots */}
              <circle cx="120" cy="100" r="3" fill="#4a5568" opacity="0.7"/>
              <circle cx="680" cy="100" r="3" fill="#4a5568" opacity="0.7"/>
              <circle cx="100" cy="100" r="1.5" fill="#718096" opacity="0.5"/>
              <circle cx="700" cy="100" r="1.5" fill="#718096" opacity="0.5"/>
            </svg>
          </div>

          {/* All Images in Three Rows */}
          <div className="w-full flex flex-col gap-8 mt-4 px-4">
            {/* Row 1 */}
            <div className="flex justify-center items-center gap-16">
              <div className="flex flex-col items-center">
                <img src="/TensorFlow_logo.svg.png" alt="TensorFlow" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">TensorFlow</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/keras.png" alt="Keras" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Keras</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/scikit_learn.png" alt="Scikit-learn" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Scikit-learn</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/open_cv.png" alt="OpenCV" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">OpenCV</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/cuda.png" alt="CUDA" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">CUDA</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex justify-center items-center gap-16">
              <div className="flex flex-col items-center">
                <img src="/flask.png" alt="Flask" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Flask</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/python.jpeg" alt="Python" className="w-28 h-28 object-contain rounded-full hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Python</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/sql.png" alt="SQL" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">SQL</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/nextjs.png" alt="Next.js" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Next.js</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/tailwind-css.png" alt="Tailwind" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Tailwind</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex justify-center items-center gap-20">
              <div className="flex flex-col items-center">
                <img src="/NLTK.png" alt="NLTK" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">NLTK</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/hugging face.png" alt="Development" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Hugging Face</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/django.png" alt="django" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">django</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/gemini.png" alt="gemini" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Gemini</span>
              </div>
              
            </div>
            {/* Row 4 (New additions) */}
            <div className="flex justify-center items-center gap-16">
              <div className="flex flex-col items-center">
                <img src="/reactjs.png" alt="React" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">React</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/docker.png" alt="Docker" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">Docker</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/AWS.png" alt="AWS" className="w-28 h-28 object-contain hover:scale-110 transition-transform duration-300" />
                <span className="mt-2 text-gray-600 text-sm">AWS</span>
              </div>
            </div>
          </div>
        </div>

        {/* accelerators section removed */}

      </div>

      {/* Certificates section placed after Tech Stack */}
      <CertificatesSection />

      {/* companies section removed */}
    </div>
  );
};

export default Features; 
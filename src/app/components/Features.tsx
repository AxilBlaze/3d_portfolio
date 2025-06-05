"use client";

import React, { useEffect, useRef, useState } from 'react';

const Features = () => {
  const [background, setBackground] = useState('transparent');
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        const isAboveViewport = rect.bottom <= 0;
        const isBelowViewport = rect.top >= window.innerHeight;

        if (entry.isIntersecting) {
          // When intersecting, set to white
          setBackground('white');
        } else if (isAboveViewport) {
          // When not intersecting AND the bottom is above the viewport, set to black
          setBackground('black');
        } else if (isBelowViewport) {
           // When not intersecting AND the top is below the viewport, set to transparent (or initial state)
           setBackground('transparent');
        }
      },
      { threshold: [0, 0.1, 1.0] }
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

  const accelerators = [
    'Foundation Capital',
    'Astir',
    'StartX',
    'Betaworks',
  ];

  const companies = [
    'Amazon',
    'LinkedIn',
    'Cisco',
    'Uber',
    'Stanford',
    'Coinbase',
    'Apple',
    'Facebook',
    'Microsoft',
    'Discord',
    'Netflix',
  ];

  return (
    <div
      ref={featuresRef}
      className={`py-20 transition-colors duration-1000 ease-in-out ${background === 'white' ? 'bg-white-pattern' : background === 'black' ? 'bg-black-pattern' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section: Text and Icons */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className={`text-3xl font-bold mb-4 ${background === 'white' ? 'text-gray-900' : 'text-white'}`}>
            Your machine learning expert
          </h2>
          {/* Placeholder for ML Icons */}
          <div className="flex justify-center md:justify-start gap-8 mt-8">
            {/* Add ML icons here */}
            <div className={`w-12 h-12 bg-gray-300 rounded-full ${background === 'black' ? 'bg-gray-700' : ''}`}></div>
            <div className={`w-12 h-12 bg-gray-300 rounded-full ${background === 'black' ? 'bg-gray-700' : ''}`}></div>
            <div className={`w-12 h-12 bg-gray-300 rounded-full ${background === 'black' ? 'bg-gray-700' : ''}`}></div>
          </div>
        </div>

        {/* Right Section: Logos */}
        <div className="w-full md:w-1/2 flex flex-wrap justify-center md:justify-end gap-8 mt-8">
          {/* Placeholder for Accelerator Logos */}
          {accelerators.map((accelerator, index) => (
            <div
              key={index}
              className={`text-gray-600 font-medium ${background === 'black' ? 'text-gray-300' : ''}`}
            >
              {/* Replace with logo images */}
              {accelerator}
            </div>
          ))}
        </div>
      </div>

      {/* Keep the second section as is for now */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 ${background === 'white' ? 'text-gray-900' : 'text-white'}`}>
            Trusted by Founders From
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {companies.map((company, index) => (
              <div
                key={index}
                className={`text-gray-600 font-medium ${background === 'black' ? 'text-gray-300' : ''}`}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 
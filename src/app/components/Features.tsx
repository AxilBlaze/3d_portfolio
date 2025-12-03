"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import EducationTimeline from './EducationTimeline';
import CertificatesSection from './CertificatesSection';

const Features = () => {
  const [background, setBackground] = useState('black');
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {


        // Calculate background color based on scroll progress
        setBackground('black');
      },
      { threshold: [0, 0.15, 0.25, 0.4, 0.6, 0.8, 1.0] }
    );

    const currentRef = featuresRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // removed accelerators/companies section per design update

  return (
    <div
      ref={featuresRef}
      className="py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6 sm:gap-8">
        {/* Education timeline above the tech stack */}
        <EducationTimeline />
        {/* Main Content Box with SVG */}
        <div className={`w-full max-w-full flex flex-col items-center justify-start py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40 rounded-lg ${background === 'white' ? 'bg-white-pattern' : background === 'black' ? 'bg-black-pattern' : ''} transition-colors duration-1000 ease-in-out`}>
          {/* Responsive Title */}
          <div className="w-full flex flex-col items-center justify-center -mt-4 sm:-mt-6 md:-mt-10 lg:-mt-20 mb-4 sm:mb-6">
            <div className="text-center">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                YOUR
              </h2>
              <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-600 dark:text-gray-400 mb-2 tracking-wider">
                MACHINE LEARNING
              </h3>
              <h4 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200">
                EXPERT
              </h4>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-8 sm:w-12 h-0.5 bg-gray-400"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <div className="w-8 sm:w-12 h-0.5 bg-gray-400"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* All Images in Responsive Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-4 px-2 sm:px-4">
            <div className="flex flex-col items-center">
              <Image src="/TensorFlow.svg.png" alt="TensorFlow" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">TensorFlow</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/keras.png" alt="Keras" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Keras</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/scikit_learn.png" alt="Scikit-learn" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Scikit-learn</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/open_cv.png" alt="OpenCV" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">OpenCV</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/cuda.png" alt="CUDA" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">CUDA</span>
            </div>

            <div className="flex flex-col items-center">
              <Image src="/flask.png" alt="Flask" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Flask</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/python.jpeg" alt="Python" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain rounded-full hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Python</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/sql.png" alt="SQL" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">SQL</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/nextjs.png" alt="Next.js" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Next.js</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/tailwind-css.png" alt="Tailwind" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Tailwind</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/NLTK.png" alt="NLTK" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">NLTK</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/hugging face.png" alt="Development" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Hugging Face</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/django.png" alt="django" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">django</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/gemini.png" alt="gemini" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Gemini</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/reactjs.png" alt="React" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">React</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/docker.png" alt="Docker" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Docker</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/AWS.png" alt="AWS" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">AWS</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/chroma_db.png" alt="ChromaDB" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">ChromaDB</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/cloudinary.png" alt="Cloudinary" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Cloudinary</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/deep_face.png" alt="DeepFace" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">DeepFace</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/fast_api.jpg" alt="FastAPI" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">FastAPI</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/google_adk.jpg" alt="Google ADK" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Google ADK</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/langchain.png" alt="LangChain" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">LangChain</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/optuna.jpg" alt="Optuna" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Optuna</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/qdrant.png" alt="Qdrant" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Qdrant</span>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/Selenium.png" alt="Selenium" width={112} height={112} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover:scale-110 transition-transform duration-300" />
              <span className="mt-2 text-gray-600 text-xs sm:text-sm text-center">Selenium</span>
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
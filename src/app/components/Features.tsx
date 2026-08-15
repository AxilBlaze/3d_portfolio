"use client";

import Image from 'next/image';
import EducationTimeline from './EducationTimeline';
import CertificatesSection from './CertificatesSection';
import Accomplishments from './Accomplishments';

const tech = [
  { src: '/TensorFlow.svg.png', alt: 'TensorFlow', label: 'TensorFlow' },
  { src: '/keras.png', alt: 'Keras', label: 'Keras' },
  { src: '/scikit_learn.png', alt: 'Scikit-learn', label: 'Scikit-learn' },
  { src: '/open_cv.png', alt: 'OpenCV', label: 'OpenCV' },
  { src: '/cuda.png', alt: 'CUDA', label: 'CUDA' },
  { src: '/flask.png', alt: 'Flask', label: 'Flask' },
  { src: '/python.jpeg', alt: 'Python', label: 'Python', round: true },
  { src: '/sql.png', alt: 'SQL', label: 'SQL' },
  { src: '/nextjs.png', alt: 'Next.js', label: 'Next.js' },
  { src: '/tailwind-css.png', alt: 'Tailwind', label: 'Tailwind' },
  { src: '/NLTK.png', alt: 'NLTK', label: 'NLTK' },
  { src: '/hugging face.png', alt: 'Hugging Face', label: 'Hugging Face' },
  { src: '/django.png', alt: 'Django', label: 'Django' },
  { src: '/gemini.png', alt: 'Gemini', label: 'Gemini' },
  { src: '/reactjs.png', alt: 'React', label: 'React' },
  { src: '/docker.png', alt: 'Docker', label: 'Docker' },
  { src: '/AWS.png', alt: 'AWS', label: 'AWS' },
  { src: '/chroma_db.png', alt: 'ChromaDB', label: 'ChromaDB' },
  { src: '/cloudinary.png', alt: 'Cloudinary', label: 'Cloudinary' },
  { src: '/deep_face.png', alt: 'DeepFace', label: 'DeepFace' },
  { src: '/fast_api.jpg', alt: 'FastAPI', label: 'FastAPI' },
  { src: '/google_adk.jpg', alt: 'Google ADK', label: 'Google ADK' },
  { src: '/langchain.png', alt: 'LangChain', label: 'LangChain' },
  { src: '/langgraph.png', alt: 'LangGraph', label: 'LangGraph' },
  { src: '/langsmith.png', alt: 'LangSmith', label: 'LangSmith' },
  { src: '/MCP.png', alt: 'MCP', label: 'MCP' },
  { src: '/openrouter.png', alt: 'OpenRouter', label: 'OpenRouter' },
  { src: '/optuna.jpg', alt: 'Optuna', label: 'Optuna' },
  { src: '/qdrant.png', alt: 'Qdrant', label: 'Qdrant' },
  { src: '/Selenium.png', alt: 'Selenium', label: 'Selenium' },
];

const Features = () => {
  return (
    <div className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6 sm:gap-8">
        <EducationTimeline />
        <div
          id="stack"
          className="scroll-mt-20 w-full max-w-full flex flex-col items-center justify-start py-16 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-40 rounded-lg bg-black-pattern"
        >
          <div className="w-full flex flex-col items-center justify-center mb-8 sm:mb-10">
            <div className="text-center">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-200 mb-3 tracking-tight">
                BUILDING AI. SCALING INTELLIGENCE.
              </h2>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg font-light text-gray-400 tracking-wider">
                MACHINE LEARNING • GENERATIVE AI • AGENTIC SYSTEMS
              </p>
            </div>
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

          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-4 px-2 sm:px-4">
            {tech.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={112}
                  height={112}
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain hover-lift ${item.round ? 'rounded-full' : ''}`}
                />
                <span className="mt-2 text-gray-300 text-xs sm:text-sm text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CertificatesSection />
      <Accomplishments />
    </div>
  );
};

export default Features;

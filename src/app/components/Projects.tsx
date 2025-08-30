"use client";

import React, { useMemo, useState } from 'react';
import { AiOutlineInfoCircle, AiOutlineClose } from 'react-icons/ai';

type Project = {
  title: string;
  imageSrc: string;
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  techIconSrcs: string[]; // icons from /public
  techBadges?: string[]; // optional text badges when an icon isn't available
  info?: string;
  techBullets?: string[];
};

const initialProjects: Project[] = [
  {
    title: 'CodeBlaze',
    imageSrc: '/projects/project-1.png',
    liveUrl: 'https://the-oj-project.vercel.app/',
    videoUrl: 'https://www.loom.com/share/11d561e2a78a4d25aff85c16116326fe?sid=007cf708-84c4-4109-a75c-b5ff29b32f59',
    techIconSrcs: ['/nextjs.png', '/tailwind-css.png', '/django.png', '/sql.png', '/vercel.svg', '/reactjs.png', '/docker.png', '/gemini.png','/AWS.png'],
    info:
      'Codeblaze is a next-gen online judge platform for coders and competitive programmers. It features user profiles, problem catalogs, a Monaco-based code editor, real-time feedback via WebSockets, and a secure Docker-powered judging system.',
    techBullets: [
      'Frontend: React.js, Tailwind, Monaco Editor',
      'Backend: Django + DRF, Django Channels (WebSockets)',
      'Database: SQLite (dev), scalable to PostgreSQL/MySQL',
      'Judging: Docker-sandboxed workers',
      'Infra: Vercel (frontend), AWS EC2 + Nginx + SSL (backend)'
    ],
  },
  {
    title: 'CourseCraft',
    imageSrc: '/projects/project-2.png',
    liveUrl: 'https://course-craft-front.vercel.app/',
    videoUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:XXXXXXX/',
    techIconSrcs: ['/reactjs.png', '/tailwind-css.png', '/flask.png', '/mongodb.webp', '/python.jpeg', '/vercel.svg', '/hugging face.png'],
    info:
      'CourseCraft is an AI-powered learning platform that delivers personalized tutoring, adaptive learning paths, and ML-driven course recommendations. It features an interactive dashboard, real-time AI chat tutor, and secure user management with a modern responsive UI.',
    techBullets: [
      'Frontend: React (Vite), Tailwind, Framer Motion, Chart.js',
      'Backend: Flask (Python), MongoDB Atlas, Flask-JOSE Auth',
      'AI: Hugging Face (Falcon-7B, BART-MNLI) for tutoring + recommendations',
      'Infra: Render (backend), Vercel (frontend), Cloud MongoDB',
    ],
  },
  {
    title: 'Walmart Bot',
    imageSrc: '/projects/project-3.png',
    liveUrl: 'https://walmart-bot-frontend.vercel.app/',
    videoUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:7365407259855568897/',
    techIconSrcs: ['/scikit_learn.png','/reactjs.png', '/tailwind-css.png', '/flask.png', '/python.jpeg', '/gemini.png','/vercel.svg'],
    
    info:
      'Walmart AI Grocery Assistant is a shopping copilot that lets users build and refine grocery lists via chat, extract items from images/PDFs with OCR, and get product recommendations through market-basket analysis. Powered by Google Gemini for natural-language understanding, it integrates Cloudinary for uploads and a Chrome extension to streamline actions on walmart.com, with sessions maintaining context and outputs returned as JSON.',
    techBullets: [
      'Frontend: React (Vite), Tailwind, axios, lucide-react',
      'Backend: Flask (Python), Google Gemini, OCR (PyMuPDF, Tesseract, Pillow), Cloudinary',
      'Recommender: Flask + mlxtend (FP-Growth/Apriori), pandas',
      'Extension: Chrome MV3 (service worker, content script, popup)',
      'Infra: Vercel/Netlify (frontend), Render',
    ],
  },
  {
    title: 'CourseFinder',
    imageSrc: '/projects/project-4.png',
    liveUrl: 'https://coursecom.onrender.com/',
    techIconSrcs: ['/flask.png', '/python.jpeg', '/scikit_learn.png', '/NLTK.png', '/tailwind-css.png'],
    techBadges: ['React'],
    info:
      'CourseFinder helps users discover courses based on past enrollments and interests, and includes a Python-based machine learning sentiment analyzer to evaluate course reviews for better recommendations.',
    techBullets: [
      'Frontend: React, Tailwind',
      'Backend: Flask (Python)',
      'ML: Sentiment analysis with scikit-learn and NLTK',
      'Infra: Render (hosted at coursecom.onrender.com)',
    ],
  },
];

const Projects: React.FC = () => {
  const projects = useMemo(() => initialProjects, []);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <section className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl sm:text-6xl tracking-widest font-extrabold text-white text-center mb-16">PROJECTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, i) => {
            const isFlipped = !!flipped[i];
            return (
            <article key={project.title} className="relative">
              <div className="group" style={{ perspective: 1000 }}>
                <div
                  className="relative h-72 w-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 500ms',
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    style={{ backfaceVisibility: 'hidden', pointerEvents: isFlipped ? 'none' : 'auto' }}
                  >
                    <button aria-label="Info" className="absolute top-3 right-3 z-30 text-white/90 hover:text-white" onClick={() => setFlipped(prev => ({ ...prev, [i]: true }))}>
                      <AiOutlineInfoCircle size={22} />
                    </button>
                    <div className="absolute inset-0 hidden lg:block lg:bg-black/70 lg:group-hover:bg-black/0 transition-colors duration-300 z-10" />
                    <img src={project.imageSrc} alt={project.title} className="w-full h-full object-cover opacity-100 lg:opacity-40 lg:group-hover:opacity-100 transition-opacity duration-300 filter brightness-110 saturate-125 lg:brightness-100 lg:saturate-100" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
                      <div>
                        <span className="inline-block bg-white/70 backdrop-blur px-3 py-1 rounded-md">
                          <h3 className="text-3xl font-extrabold text-black tracking-tight">{project.title}</h3>
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-wrap gap-3 max-w-[75%] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          {project.techIconSrcs.map((src) => (
                            <img key={src} src={src} alt="tech" className="w-10 h-10 object-contain rounded-sm bg-black p-1" />
                          ))}
                          {project.techBadges?.map((label) => (
                            <span key={label} className="text-xs font-medium text-white bg-black px-2.5 py-1 rounded-md">{label}</span>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors duration-200">Link</a>
                          )}
                          {project.videoUrl && (
                            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition-colors duration-200">Video</a>
                          )}
                          {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors duration-200">Github</a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-white/10 bg-black text-white p-5 overflow-y-auto"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', pointerEvents: isFlipped ? 'auto' : 'none' }}
                  >
                    <button aria-label="Close" className="absolute top-3 right-3 z-30 text-white/90 hover:text-white" onClick={() => setFlipped(prev => ({ ...prev, [i]: false }))}>
                      <AiOutlineClose size={20} />
                    </button>
                    <h4 className="text-xl font-bold mb-2">About</h4>
                    {project.info && <p className="text-sm text-gray-200 mb-4">{project.info}</p>}
                    {project.techBullets && (
                      <div>
                        <h5 className="text-sm font-semibold mb-1">Tech Stack</h5>
                        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1 pr-2">
                          {project.techBullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;



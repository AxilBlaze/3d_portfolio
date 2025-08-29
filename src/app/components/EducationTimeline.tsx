"use client";

import React, { useEffect, useRef } from 'react';

type TimelineItem = {
  title: string;
  period: string;
  status: 'Completed' | 'Currently Enrolled';
  details: string;
  institution?: string;
  percentage?: number;
  cgpa?: number;
  progressClass?: string;
  delay: number;
  isCurrent?: boolean;
};

const items: TimelineItem[] = [
  {
    title: '10th Standard',
    period: '2018 - 2019',
    status: 'Completed',
    details: 'Successfully completed secondary education with excellent performance',
    institution: 'Kendriya Vidyalaya No-5, Bhubaneswar, Odisha',
    percentage: 91.4,
    progressClass: 'percent-91',
    delay: 0.2,
  },
  {
    title: '12th Standard',
    period: '2020 - 2021',
    status: 'Completed',
    details: 'Completed higher secondary education with outstanding results',
    institution: 'Kendriya Vidyalaya No-5, Bhubaneswar, Odisha',
    percentage: 94.6,
    progressClass: 'percent-94',
    delay: 0.6,
  },
  {
    title: 'B.Tech (CSE)',
    period: '2022 - 2026',
    status: 'Currently Enrolled',
    details: 'Bachelor of Technology in Computer Science Engineering - Pursuing with excellent academic standing',
    institution: 'VIT Bhopal University, Kothri Kalan, Madhya Pradesh',
    cgpa: 8.58,
    progressClass: 'cgpa-progress',
    delay: 1.0,
    isCurrent: true,
  },
];

const EducationTimeline: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const addTimers = new WeakMap<Element, number>();

    function createParticles() {
      const container = particlesRef.current;
      if (!container) return;
      container.innerHTML = '';
      const particleCount = 15;
      for (let i = 0; i < particleCount; i += 1) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        container.appendChild(particle);
      }
    }

    function animateOnScroll() {
      const rootEl = sectionRef.current;
      if (!rootEl) return;
      const itemsEls = rootEl.querySelectorAll('.timeline-item');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
            const delayAttr = el.dataset.delay;
            const delay = delayAttr ? parseFloat(delayAttr) : 0;
            const timerId = window.setTimeout(() => {
              el.classList.add('animate');
              addTimers.delete(el);
            }, delay * 1000);
            addTimers.set(el, timerId);
          } else {
            const existing = addTimers.get(el);
            if (existing) {
              clearTimeout(existing);
              addTimers.delete(el);
            }
            el.classList.remove('animate');
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

      itemsEls.forEach((el) => observer.observe(el));
    }

    function addInteractions() {
      const rootEl = sectionRef.current;
      if (!rootEl) return;
      const contents = rootEl.querySelectorAll('.timeline-content');
      contents.forEach((content) => {
        content.addEventListener('click', function handleClick(e) {
          const ripple = document.createElement('div');
          ripple.style.position = 'absolute';
          ripple.style.borderRadius = '50%';
          ripple.style.background = 'rgba(255, 255, 255, 0.3)';
          ripple.style.transform = 'scale(0)';
          ripple.style.animation = 'ripple 0.6s linear';
          ripple.style.left = '50%';
          ripple.style.top = '50%';
          ripple.style.width = '50px';
          ripple.style.height = '50px';
          ripple.style.marginLeft = '-25px';
          ripple.style.marginTop = '-25px';
          const target = (e.currentTarget as HTMLElement) || (content as HTMLElement);
          target.style.position = 'relative';
          target.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });
    }

    function addParallaxEffect() {
      const onScroll = () => {
        const rootEl = sectionRef.current;
        if (!rootEl) return;
        const scrolled = window.pageYOffset;
        const dots = rootEl.querySelectorAll('.timeline-dot');
        dots.forEach((dot, index) => {
          const speed = 0.1 + index * 0.05;
          (dot as HTMLElement).style.transform = `translate(-50%, calc(-50% + ${scrolled * speed}px))`;
        });
      };
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }

    function addMouseParallax() {
      const onMove = (e: MouseEvent) => {
        const rootEl = sectionRef.current;
        if (!rootEl) return;
        const shapes = rootEl.querySelectorAll('.shape');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 0.5;
          const x = (mouseX - 0.5) * speed;
          const y = (mouseY - 0.5) * speed;
          (shape as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        });
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    }

    createParticles();
    animateOnScroll();
    addInteractions();
    const removeScroll = addParallaxEffect();
    const removeMouse = addMouseParallax();

    // Trigger initial animations for items already in view
    const timer = setTimeout(() => {
      const rootEl = sectionRef.current;
      if (!rootEl) return;
      const itemsEls = rootEl.querySelectorAll('.timeline-item');
      itemsEls.forEach((item) => {
        const rect = (item as HTMLElement).getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          const delayAttr = (item as HTMLElement).dataset.delay;
          const delay = delayAttr ? parseFloat(delayAttr) : 0;
          const timerId = window.setTimeout(() => {
            item.classList.add('animate');
            addTimers.delete(item);
          }, delay * 1000);
          addTimers.set(item, timerId);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (removeScroll) removeScroll();
      if (removeMouse) removeMouse();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16 overflow-hidden">
      <div ref={particlesRef} className="background-particles" />
      <div className="floating-shapes">
        <div className="shape" />
        <div className="shape" />
        <div className="shape" />
          </div>

      <div className="container">
        <div className="header">
          <h1>Education Journey</h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Academic Progress & Achievements</p>
        </div>

        <div className="timeline">
          {items.map((item) => (
            <div
              key={item.title}
              className={`timeline-item ${item.isCurrent ? 'current-education' : ''}`}
              data-delay={item.delay}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3 className="timeline-title">{item.title}</h3>
                {item.institution && (
                  <div className="timeline-institution">{item.institution}</div>
                )}
                <div className="timeline-period">{item.period}</div>
                <div className={`timeline-status ${item.status === 'Completed' ? 'status-completed' : 'status-enrolled'}`}>
                  {item.status}
                </div>
                {typeof item.percentage === 'number' && (
                  <>
                    <div className="percentage">Percentage: {item.percentage}%</div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${item.progressClass || ''}`} />
                    </div>
                  </>
                )}
                {typeof item.cgpa === 'number' && (
                  <>
                    <div className="cgpa">Current CGPA: {item.cgpa}</div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${item.progressClass || ''}`} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .background-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 20s infinite ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(100px) rotate(360deg); opacity: 0; }
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 60px;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
        }
        .header h1 {
          font-size: 3rem;
          background: linear-gradient(45deg, #4f46e5, #06b6d4, #10b981);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
          margin-bottom: 10px;
        }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }

        .timeline { position: relative; padding: 20px 0; }
        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #4f46e5, #06b6d4, #10b981);
          transform: translateX(-50%);
          border-radius: 2px;
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
        }

        .timeline-item { position: relative; margin: 80px 0; opacity: 0; transform: translateY(50px); transition: all 0.6s ease-out; }
        .timeline-item.animate { opacity: 1; transform: translateY(0); }
        .timeline-item:nth-child(odd) { text-align: right; padding-right: calc(50% + 60px); }
        .timeline-item:nth-child(even) { text-align: left; padding-left: calc(50% + 60px); }

        .timeline-content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .timeline-content:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4); border-color: rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.08); }

        .timeline-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #4f46e5, #06b6d4);
          border-radius: 50%;
          border: 4px solid #0c0c0c;
          z-index: 2;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.6);
        }
        .timeline-item:hover .timeline-dot { transform: translate(-50%, -50%) scale(1.5); box-shadow: 0 0 30px rgba(79, 70, 229, 0.8); }

        .timeline-content::before { content: ''; position: absolute; top: 50%; width: 0; height: 0; border: 15px solid transparent; }
        .timeline-item:nth-child(odd) .timeline-content::before { right: -30px; border-left-color: rgba(255, 255, 255, 0.1); transform: translateY(-50%); }
        .timeline-item:nth-child(even) .timeline-content::before { left: -30px; border-right-color: rgba(255, 255, 255, 0.1); transform: translateY(-50%); }

        .timeline-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; color: #ffffff; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); }
        .timeline-institution { font-size: 1rem; color: #cbd5e1; margin-bottom: 6px; }
        .timeline-period { font-size: 1rem; color: #94a3b8; margin-bottom: 15px; font-weight: 500; }
        .timeline-status { display: inline-block; padding: 6px 16px; border-radius: 25px; font-size: 0.9rem; font-weight: 600; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-completed { background: linear-gradient(45deg, #10b981, #059669); color: white; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
        .status-enrolled { background: linear-gradient(45deg, #3b82f6, #1d4ed8); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .percentage { font-size: 1.3rem; font-weight: 700; color: #4ade80; text-shadow: 0 0 10px rgba(74, 222, 128, 0.5); }
        .cgpa { font-size: 1.3rem; font-weight: 700; color: #60a5fa; text-shadow: 0 0 10px rgba(96, 165, 250, 0.5); }

        .progress-bar { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden; margin-top: 15px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4f46e5, #06b6d4); border-radius: 4px; width: 0; transition: width 2s ease-out; }
        .timeline-item.animate .progress-fill.percent-91 { width: 91.4%; }
        .timeline-item.animate .progress-fill.percent-94 { width: 94.6%; }
        .timeline-item.animate .progress-fill.cgpa-progress { width: 85.8%; }

        @media (max-width: 768px) {
          .timeline::before { left: 30px; }
          .timeline-item { text-align: left !important; padding-left: 70px !important; padding-right: 20px !important; }
          .timeline-dot { left: 30px !important; }
          .timeline-content::before { left: -30px !important; right: auto !important; border-right-color: rgba(255, 255, 255, 0.1) !important; border-left-color: transparent !important; }
          .header h1 { font-size: 2rem; }
          .timeline-title { font-size: 1.5rem; }
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .floating-shapes { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; }
        .shape { position: absolute; opacity: 0.1; animation: floatShape 15s infinite ease-in-out; }
        .shape:nth-child(1) { top: 10%; left: 10%; width: 80px; height: 80px; background: linear-gradient(45deg, #4f46e5, #7c3aed); border-radius: 20px; animation-delay: 0s; }
        .shape:nth-child(2) { top: 60%; right: 10%; width: 60px; height: 60px; background: linear-gradient(45deg, #06b6d4, #0891b2); border-radius: 50%; animation-delay: 5s; }
        .shape:nth-child(3) { bottom: 20%; left: 20%; width: 100px; height: 40px; background: linear-gradient(45deg, #10b981, #059669); border-radius: 50px; animation-delay: 10s; }
        @keyframes floatShape { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-30px) rotate(180deg); } }

        .current-education { position: relative; overflow: hidden; }
        .current-education::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent); animation: shimmer 3s infinite; }
        @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }

        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
      `}</style>
    </section>
  );
};

export default EducationTimeline;


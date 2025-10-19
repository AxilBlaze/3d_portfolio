'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

const CertificatesSection = () => {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const marqueeReq = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const [railShift, setRailShift] = useState(0) // pixels, loops across total width

  // Certificate images (1–12) from public/Certificates
  const certificates = [
    { id: 1, title: 'Certificate 1', subtitle: '', image: '/Certificates/1.jpeg' },
    { id: 2, title: 'Certificate 2', subtitle: '', image: '/Certificates/2.png' },
    { id: 3, title: 'Certificate 3', subtitle: '', image: '/Certificates/3.png' },
    { id: 4, title: 'Certificate 4', subtitle: '', image: '/Certificates/4.jpeg' },
    { id: 5, title: 'Certificate 5', subtitle: '', image: '/Certificates/5.png' },
    { id: 6, title: 'Certificate 6', subtitle: '', image: '/Certificates/6.jpeg' },
    { id: 7, title: 'Certificate 7', subtitle: '', image: '/Certificates/7.png' },
    { id: 8, title: 'Certificate 8', subtitle: '', image: '/Certificates/8.png' },
    { id: 9, title: 'Certificate 9', subtitle: '', image: '/Certificates/9.png' },
    { id: 10, title: 'Certificate 10', subtitle: '', image: '/Certificates/10.png' },
    { id: 11, title: 'Certificate 11', subtitle: '', image: '/Certificates/11.png' },
    { id: 12, title: 'Certificate 12', subtitle: '', image: '/Certificates/12.png' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = (containerRef.current as HTMLElement).getBoundingClientRect()
        const viewportH = window.innerHeight
        // Define a strict entry window for animation to begin only inside the section
        const startTop = viewportH * 0.1   // begin when section top reaches 90% of viewport
        const endTop = viewportH * -0.1    // finish when section top passes -10% (near top)
        let p = 0
        if (rect.top >= startTop) {
          // Not entered yet
          p = 0
        } else if (rect.top <= endTop) {
          // Fully traversed the window
          p = 1
        } else {
          // Map rect.top from [startTop → endTop] to [0 → 1]
          p = (startTop - rect.top) / (startTop - endTop)
        }
        setProgress(Math.min(Math.max(p, 0), 1))
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  // Local scroll progress tied to this section (reversible)
  const scrollProgress = progress
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2)
  const eased = easeOut(scrollProgress)
  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t
  
  // Title stays visible above the rail: gently fades then pins back to 1
  const railStart = 0.95
  const pinStart = Math.max(railStart - 0.06, 0)
  const pinMix = Math.min(Math.max((scrollProgress - pinStart) / (railStart - pinStart), 0), 1)
  const titleOpacityBase = Math.max(0.6, 1 - scrollProgress * 0.7)
  const titleOpacity = mix(titleOpacityBase, 1, pinMix)
  const titleScale = mix(1 - scrollProgress * 0.1, 1, pinMix)
  // After the rail activates, gently lift the title upwards
  const liftProgress = Math.min(Math.max((scrollProgress - railStart) / 0.08, 0), 1)
  const titleLiftPx = 160
  const titleTranslateY = -titleLiftPx * liftProgress
  
  // Marquee activation once alignment is basically done
  const isRailActive = isInView && scrollProgress >= railStart
  const bannerOffsetPx = 180
  const extraY = eased * bannerOffsetPx

  // Start/stop marquee loop
  useEffect(() => {
    const spacing = 350
    const totalWidth = certificates.length * spacing
    const speedPxPerSec = 30

    const step = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts
      const delta = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setRailShift(prev => {
        const next = (prev + speedPxPerSec * delta) % totalWidth
        return next
      })
      marqueeReq.current = requestAnimationFrame(step)
    }

    if (isRailActive) {
      marqueeReq.current = requestAnimationFrame(step)
      return () => {
        if (marqueeReq.current) cancelAnimationFrame(marqueeReq.current)
        marqueeReq.current = null
        lastTsRef.current = null
      }
    }

    // stop when inactive
    if (marqueeReq.current) cancelAnimationFrame(marqueeReq.current)
    marqueeReq.current = null
    lastTsRef.current = null
  }, [isRailActive, certificates.length])

  return (
    <div className="relative">
      {/* Hero Section */}
      <section 
        ref={containerRef}
        className="h-screen relative overflow-hidden bg-black flex items-center justify-center"
      >
        {/* Main Title */}
        <div 
          className="relative z-20 text-center transition-all duration-300 ease-out"
          style={{
            opacity: Math.max(titleOpacity, 0),
            transform: `translateY(${titleTranslateY}px) scale(${titleScale})`
          }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Certifications
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mt-4 font-light">
            Professional Achievements & Recognition
          </p>
        </div>

        {/* Unified layer: cards fan in, align to a rail, then auto-scroll */}
        <div className="absolute inset-0 perspective-1000 z-10">
          {Array.from({ length: certificates.length * 2 }).map((_, i) => {
            const index = i % certificates.length
            const cert = certificates[index]
            const spacing = 350
            const totalWidth = certificates.length * spacing

            // Phase interpolation 0..1 from fan → aligned
            const p = eased

            // Fan positions
            const fanX = 0
            const fanY = (index - 2.5) * 100
            const fanRot = -45 + (index * 15)

            // Aligned rail positions
            const alignedBaseX = (index - (certificates.length - 1) / 2) * spacing
            const groupOffset = i < certificates.length ? 0 : totalWidth
            // Smoothly blend marquee offset in/out around the activation threshold
            const hysteresis = 0.06
            const activationMix = Math.min(Math.max((scrollProgress - (railStart - hysteresis)) / hysteresis, 0), 1)
            const shift = railShift * activationMix
            const railX = alignedBaseX + groupOffset - shift
            const railY = 0
            const railRot = 0

            // Interpolated transform
            const x = fanX * (1 - p) + railX * p
            const y = fanY * (1 - p) + railY * p + extraY
            const rot = fanRot * (1 - p) + railRot * p

            const scale = 0.8 + p * 0.2
            const cardOpacity = Math.min(0.25 + p * 0.65, 0.95)
            const cardBlur = Math.max(4 - p * 4, 0)
            // Visual pop: fade overlay and boost image when in rail
            const overlayAlpha = 0.35 * (1 - p)
            const brightness = 0.8 + 0.1 * p
            const saturate = 0.85 + 0.35 * p

            // Hide the duplicate group before alignment finishes
            const visibilityOpacity = i < certificates.length ? 1 : Math.max(0, p - 0.95) / 0.05

            return (
              <div
                key={`${cert.id}-${i}`}
                className="absolute top-1/2 left-1/2 w-80 h-48 transition-all duration-200 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateZ(${rot}deg) scale(${scale})`,
                  opacity: cardOpacity * visibilityOpacity,
                  filter: `blur(${cardBlur}px)`
                }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 relative">
                  <Image 
                    src={cert.image} 
                    alt={cert.title} 
                    fill 
                    sizes="(max-width: 768px) 90vw, 320px" 
                    className="object-cover absolute inset-0" 
                    style={{ filter: `brightness(${brightness}) saturate(${saturate})` }}
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none z-10" />
      </section>

      {/* Scoped styles (empty placeholder to keep JSX style tag valid if needed) */}
      <style jsx>{``}</style>
    </div>
  )
}

export default CertificatesSection 
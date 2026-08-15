'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

const certificates = [
  { id: 1, title: 'Certificate 1', image: '/Certificates/1.jpeg' },
  { id: 2, title: 'Certificate 2', image: '/Certificates/2.png' },
  { id: 3, title: 'Certificate 3', image: '/Certificates/3.png' },
  { id: 4, title: 'Certificate 4', image: '/Certificates/4.jpeg' },
  { id: 5, title: 'Certificate 5', image: '/Certificates/5.png' },
  { id: 6, title: 'Certificate 6', image: '/Certificates/6.jpeg' },
  { id: 7, title: 'Certificate 7', image: '/Certificates/7.png' },
  { id: 8, title: 'Certificate 8', image: '/Certificates/8.png' },
  { id: 9, title: 'Certificate 9', image: '/Certificates/9.png' },
  { id: 10, title: 'Certificate 10', image: '/Certificates/10.png' },
  { id: 11, title: 'Certificate 11', image: '/Certificates/11.png' },
  { id: 12, title: 'Certificate 12', image: '/Certificates/12.png' },
]

function certSpacing(vw: number): number {
  return Math.min(280, vw * 0.8)
}

const CertificatesSection = () => {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const marqueeReq = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const [railShift, setRailShift] = useState(0)
  const [isMobile, setIsMobile] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [spacing, setSpacing] = useState(280)

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 767px)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setIsMobile(mobileMq.matches)
      setReduced(motionMq.matches)
      setSpacing(certSpacing(window.innerWidth))
    }
    update()
    mobileMq.addEventListener('change', update)
    motionMq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mobileMq.removeEventListener('change', update)
      motionMq.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  useEffect(() => {
    if (isMobile || reduced) return

    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const viewportH = window.innerHeight
        const startTop = viewportH * 0.1
        const endTop = viewportH * -0.1
        let p = 0
        if (rect.top >= startTop) {
          p = 0
        } else if (rect.top <= endTop) {
          p = 1
        } else {
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

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [isMobile, reduced])

  const scrollProgress = progress
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 2)
  const eased = easeOut(scrollProgress)
  const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t

  const railStart = 0.95
  const pinStart = Math.max(railStart - 0.06, 0)
  const pinMix = Math.min(Math.max((scrollProgress - pinStart) / (railStart - pinStart), 0), 1)
  const titleOpacityBase = Math.max(0.6, 1 - scrollProgress * 0.7)
  const titleOpacity = mix(titleOpacityBase, 1, pinMix)
  const titleScale = mix(1 - scrollProgress * 0.1, 1, pinMix)
  const liftProgress = Math.min(Math.max((scrollProgress - railStart) / 0.08, 0), 1)
  const titleTranslateY = -160 * liftProgress
  const isRailActive = !isMobile && !reduced && isInView && scrollProgress >= railStart
  const extraY = eased * 180

  useEffect(() => {
    const totalWidth = certificates.length * spacing
    const speedPxPerSec = 30

    const step = (ts: number) => {
      if (document.hidden) {
        lastTsRef.current = ts
        marqueeReq.current = requestAnimationFrame(step)
        return
      }
      if (!lastTsRef.current) lastTsRef.current = ts
      const delta = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setRailShift((prev) => (prev + speedPxPerSec * delta) % totalWidth)
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

    if (marqueeReq.current) cancelAnimationFrame(marqueeReq.current)
    marqueeReq.current = null
    lastTsRef.current = null
  }, [isRailActive, spacing])

  const openCert = (id: number) => setLightbox(id)
  const active = certificates.find((c) => c.id === lightbox)

  return (
    <div id="certificates" className="relative scroll-mt-20">
      {isMobile || reduced ? (
        <section className="relative bg-black px-4 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl text-center mb-8 sm:mb-12">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Certifications
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mt-2 sm:mt-4 font-light">
              Professional Achievements & Recognition
            </p>
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
            {certificates.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => openCert(cert.id)}
                className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 text-left"
              >
                <Image src={cert.image} alt={cert.title} fill sizes="(max-width: 475px) 100vw, 50vw" className="object-cover" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section
          ref={containerRef}
          className="h-screen relative overflow-hidden bg-black flex items-center justify-center"
        >
          <div
            className="relative z-20 text-center transition-all duration-300 ease-out px-4"
            style={{
              opacity: Math.max(titleOpacity, 0),
              transform: `translateY(${titleTranslateY}px) scale(${titleScale})`,
            }}
          >
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Certifications
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 mt-2 sm:mt-4 font-light">
              Professional Achievements & Recognition
            </p>
          </div>

          <div className="absolute inset-0 perspective-1000 z-10">
            {Array.from({ length: certificates.length * 2 }).map((_, i) => {
              const index = i % certificates.length
              const cert = certificates[index]
              const totalWidth = certificates.length * spacing
              const p = eased
              const fanY = (index - 2.5) * 100
              const fanRot = -45 + index * 15
              const alignedBaseX = (index - (certificates.length - 1) / 2) * spacing
              const groupOffset = i < certificates.length ? 0 : totalWidth
              const hysteresis = 0.06
              const activationMix = Math.min(Math.max((scrollProgress - (railStart - hysteresis)) / hysteresis, 0), 1)
              const shift = railShift * activationMix
              const railX = alignedBaseX + groupOffset - shift
              const x = railX * p
              const y = fanY * (1 - p) + extraY
              const rot = fanRot * (1 - p)
              const scale = 0.8 + p * 0.2
              const cardOpacity = Math.min(0.25 + p * 0.65, 0.95)
              const cardBlur = Math.max(4 - p * 4, 0)
              const overlayAlpha = 0.35 * (1 - p)
              const brightness = 0.8 + 0.1 * p
              const saturate = 0.85 + 0.35 * p
              const visibilityOpacity = i < certificates.length ? 1 : Math.max(0, p - 0.95) / 0.05

              return (
                <button
                  key={`${cert.id}-${i}`}
                  type="button"
                  onClick={() => openCert(cert.id)}
                  className="absolute top-1/2 left-1/2 w-64 h-40 sm:w-72 sm:h-44 md:w-80 md:h-48 transition-all duration-200 ease-out"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateZ(${rot}deg) scale(${scale})`,
                    opacity: cardOpacity * visibilityOpacity,
                    filter: `blur(${cardBlur}px)`,
                  }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 relative">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                      className="object-cover absolute inset-0"
                      style={{ filter: `brightness(${brightness}) saturate(${saturate})` }}
                    />
                    <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayAlpha})` }} />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none z-10" />
        </section>
      )}

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            type="button"
            aria-label="Close certificate"
            className="absolute top-4 right-4 inline-flex min-h-11 min-w-11 items-center justify-center text-white"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <div className="relative w-full max-w-3xl aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            <Image src={active.image} alt={active.title} fill className="object-contain" sizes="100vw" />
            <p className="absolute -bottom-8 left-0 right-0 text-center text-gray-200">{active.title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificatesSection

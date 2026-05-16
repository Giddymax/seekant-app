'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Slide = {
  id: number
  tag: string
  heading: string
  subtext: string
  btn1_label: string
  btn1_href: string
  btn2_label: string
  btn2_href: string
  image_url: string
}

const FALLBACK_SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'Design · Print · Brand',
    heading: 'First Impression\nWith Our Designs',
    subtext: 'Premium business cards, letterheads, and branded stationery that speak before you do.',
    btn1_label: 'Get a Quote', btn1_href: '/quote',
    btn2_label: 'Our Portfolio', btn2_href: '/works',
    image_url: 'https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?w=1440&h=900&fit=crop&auto=format&q=80',
  },
  {
    id: 2,
    tag: 'Your Vision, Our Expertise',
    heading: 'Let Us Help You With\nAll Of Your Printing\nNeeds',
    subtext: 'From single-page flyers to full brand identity kits — we handle it all with precision and speed.',
    btn1_label: 'Explore Services', btn1_href: '/services',
    btn2_label: 'More Information', btn2_href: '/info/printing',
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1440&h=900&fit=crop&auto=format&q=80',
  },
  {
    id: 3,
    tag: 'Professional · Fast · Reliable',
    heading: 'Quality Printing\nServices In Asuom',
    subtext: 'Walk-in or order online. Seekant Multimedia delivers top-quality prints, apparel, and branding solutions.',
    btn1_label: 'View Products', btn1_href: '/products',
    btn2_label: 'Contact Us', btn2_href: '/contacts',
    image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1440&h=900&fit=crop&auto=format&q=80',
  },
]

function safeSlide(s: Slide): Slide {
  return {
    ...s,
    tag:        s.tag        || '',
    heading:    s.heading    || '',
    subtext:    s.subtext    || '',
    btn1_label: s.btn1_label || 'Learn More',
    btn1_href:  s.btn1_href  || '/',
    btn2_label: s.btn2_label || 'Contact Us',
    btn2_href:  s.btn2_href  || '/contacts',
    image_url:  s.image_url  || FALLBACK_SLIDES[0].image_url,
  }
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  // Use DB slides if ≥2 exist, otherwise fall back to the built-in set so there's always something to cycle
  const data = useMemo(() => (slides.length >= 2 ? slides : FALLBACK_SLIDES).map(safeSlide), [slides])
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const next = useCallback(() => setCur(c => (c + 1) % data.length), [data.length])
  const prev = useCallback(() => setCur(c => (c - 1 + data.length) % data.length), [data.length])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHydrated(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (data.length < 2 || paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [data.length, paused, next])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  return (
    <section
      className={`hero-slider ${hydrated ? 'hero-slider-js' : 'hero-slider-fallback'}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: 68,
        '--slide-count': data.length,
      } as React.CSSProperties}
      onPointerEnter={event => {
        if (event.pointerType === 'mouse') setPaused(true)
      }}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse') setPaused(false)
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {data.map((slide, i) => (
        <div key={slide.id} className="hero-slide" aria-hidden={i !== cur} style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: i === cur ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: i === cur ? 'auto' : 'none',
          '--slide-index': i,
        } as React.CSSProperties}>
          <Image
            src={slide.image_url}
            alt={slide.heading}
            fill
            priority={i === 0}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="100vw"
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(105deg,rgba(21,33,44,.94) 0%,rgba(21,33,44,.82) 40%,rgba(21,33,44,.28) 68%,rgba(21,33,44,.04) 100%)',
          }} />
          {/* Text */}
          <div className="hero-text-wrap" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: 620 }}>
              <div className="section-tag" style={{ marginBottom: 26, animation: i === cur ? 'fadeUp .55s .08s both' : undefined }}>
                {slide.tag}
              </div>
              <h1 style={{
                fontSize: 'clamp(30px,4.2vw,58px)', fontWeight: 900, color: '#fff',
                lineHeight: 1.13, letterSpacing: 0, marginBottom: 18,
                whiteSpace: 'pre-line',
                animation: i === cur ? 'fadeUp .65s .22s both' : undefined,
              }}>{slide.heading}</h1>
              <p style={{
                color: 'rgba(255,255,255,.68)', fontSize: 15, lineHeight: 1.8,
                marginBottom: 34, maxWidth: 500,
                animation: i === cur ? 'fadeUp .65s .38s both' : undefined,
              }}>{slide.subtext}</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: i === cur ? 'fadeUp .65s .5s both' : undefined }}>
                <Link href={slide.btn1_href} className="btn btn-gold">{slide.btn1_label}</Link>
                <Link href={slide.btn2_href} className="btn btn-outline">{slide.btn2_label}</Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      {[
        { dir: 'prev', action: prev, left: 16, path: 'M15 18l-6-6 6-6' },
        { dir: 'next', action: next, right: 16, path: 'M9 18l6-6-6-6' },
      ].map(({ dir, action, path, ...pos }) => (
        <button type="button" key={dir} onClick={action} aria-label={dir} style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: 52, height: 52, background: 'rgba(255,255,255,.15)', border: 'none',
          cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s', touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent', ...pos,
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,32,32,.75)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.15)')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
          </svg>
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 9, zIndex: 10 }}>
        {data.map((_, i) => (
          <button type="button" key={i} onClick={() => setCur(i)} aria-label={`Slide ${i + 1}`} style={{
            width: i === cur ? 28 : 12, height: 12,
            background: i === cur ? '#d42020' : 'rgba(255,255,255,.4)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'width .3s, background .3s',
            touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
          }} />
        ))}
      </div>
    </section>
  )
}

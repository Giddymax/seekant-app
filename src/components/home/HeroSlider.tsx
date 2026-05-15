'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const data = (slides.length ? slides : FALLBACK_SLIDES).map(safeSlide)
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCur(c => (c + 1) % data.length), [data.length])
  const prev = useCallback(() => setCur(c => (c - 1 + data.length) % data.length), [data.length])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next])

  return (
    <section
      style={{ position: 'relative', height: 'calc(100vh - 68px)', minHeight: 580, overflow: 'hidden', marginTop: 68 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {data.map((slide, i) => (
        <div key={slide.id} style={{
          position: 'absolute', inset: 0,
          opacity: i === cur ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: i === cur ? 'auto' : 'none',
        }}>
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
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg,rgba(21,33,44,.94) 0%,rgba(21,33,44,.82) 40%,rgba(21,33,44,.28) 68%,rgba(21,33,44,.04) 100%)',
          }} />
          {/* Text */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 90px' }}>
            <div style={{ maxWidth: 620 }}>
              {i === cur && (
                <>
                  <div className="section-tag" style={{ marginBottom: 26, animation: 'fadeUp .55s .08s both' }}>
                    {slide.tag}
                  </div>
                  <h1 style={{
                    fontSize: 'clamp(30px,4.2vw,58px)', fontWeight: 900, color: '#fff',
                    lineHeight: 1.13, letterSpacing: '-0.025em', marginBottom: 18,
                    whiteSpace: 'pre-line',
                    animation: 'fadeUp .65s .22s both',
                  }}>{slide.heading}</h1>
                  <p style={{
                    color: 'rgba(255,255,255,.68)', fontSize: 15, lineHeight: 1.8,
                    marginBottom: 34, maxWidth: 500,
                    animation: 'fadeUp .65s .38s both',
                  }}>{slide.subtext}</p>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animation: 'fadeUp .65s .5s both' }}>
                    <Link href={slide.btn1_href} className="btn btn-gold">{slide.btn1_label}</Link>
                    <Link href={slide.btn2_href} className="btn btn-outline">{slide.btn2_label}</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      {[
        { dir: 'prev', action: prev, left: 22, path: 'M15 18l-6-6 6-6' },
        { dir: 'next', action: next, right: 22, path: 'M9 18l6-6-6-6' },
      ].map(({ dir, action, path, ...pos }) => (
        <button key={dir} onClick={action} aria-label={dir} style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
          width: 46, height: 46, background: 'rgba(255,255,255,.12)', border: 'none',
          cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s', ...pos,
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(221,184,55,.75)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.12)')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
          </svg>
        </button>
      ))}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 9, zIndex: 10 }}>
        {data.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} aria-label={`Slide ${i + 1}`} style={{
            width: i === cur ? 28 : 9, height: 9,
            background: i === cur ? '#ddb837' : 'rgba(255,255,255,.4)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'width .3s, background .3s',
          }} />
        ))}
      </div>
    </section>
  )
}

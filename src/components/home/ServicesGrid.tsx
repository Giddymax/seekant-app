'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Service = {
  id: number
  name: string
  category: string
  description: string
  image_url: string
  slug: string
}

const CATS = ['All', 'Print', 'Signage', 'Apparel', 'Design', 'Publishing']

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? services : services.filter(s => s.category === active)

  return (
    <section style={{ padding: '88px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-tag">What We Do</span>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: 'var(--brand-heading, #1a181d)', letterSpacing: '-0.025em', marginTop: 16, marginBottom: 12 }}>
            Our Services
          </h2>
          <p style={{ color: 'var(--brand-text, #737a80)', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            From a single business card to a full branding campaign — we do it all with precision.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40, justifyContent: 'center' }}>
          {CATS.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '8px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', border: '1.5px solid',
              borderColor: active === cat ? '#d42020' : '#e0e0e0',
              background: active === cat ? '#d42020' : 'none',
              color: active === cat ? '#fff' : 'var(--brand-text, #737a80)',
              cursor: 'pointer', fontFamily: 'var(--brand-font, Poppins, sans-serif)',
              transition: 'all .2s',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {filtered.map(svc => (
            <div key={svc.id} className="card-shadow" style={{ background: '#fff', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
              <Link
                href={`/services/${svc.slug}`}
                aria-label={`View ${svc.name} service details`}
                style={{ position: 'relative', height: 178, overflow: 'hidden', display: 'block' }}
              >
                <Image
                  src={svc.image_url || 'https://placehold.co/370x178'}
                  alt={svc.name}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform .4s' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.4), transparent)' }} />
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: '#d42020', color: '#fff', fontSize: 9,
                  fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '3px 10px',
                }}>{svc.category}</span>
              </Link>
              <div style={{ padding: '20px 22px 22px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-heading, #1a181d)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                  {svc.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--brand-text, #737a80)', lineHeight: 1.7, marginBottom: 16 }}>
                  {svc.description}
                </p>
                <Link href="/quote" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 11, fontWeight: 700, color: '#d42020',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'gap .2s',
                }}>
                  Get a Quote
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/services" className="btn btn-dark">View All 36 Services</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="repeat(3,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

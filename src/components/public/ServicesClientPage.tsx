'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Service = {
  id: string
  name: string
  category: string
  description: string | null
  image_url: string | null
  slug: string
}

const CATS = ['All', 'Print', 'Signage', 'Apparel', 'Design', 'Publishing', 'Embroidery', 'Gifts']

const CAT_COLOR: Record<string, string> = {
  Print:      '#d42020',
  Signage:    '#54b9fd',
  Apparel:    '#4ade80',
  Design:     '#c084fc',
  Publishing: '#fb923c',
  Embroidery: '#f472b6',
  Gifts:      '#2dd4bf',
}

export default function ServicesClientPage({ services }: { services: Service[] }) {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? services : services.filter(s => s.category === active)
  const accent = (cat: string) => CAT_COLOR[cat] ?? '#d42020'

  return (
    <>
      {/* Hero */}
      <div style={{ marginTop: 68, background: '#15212c', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span>
            <span style={{ color: '#d42020' }}>Services</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>What We Offer</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Our Services
          </h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>
            Over 36 professional printing, branding, and design services — all under one roof in Asuom.
          </p>
        </div>
      </div>

      {/* Sticky filter */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 68, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 8, height: 60, overflowX: 'auto', flexWrap: 'nowrap' }}>
          {CATS.map(cat => (
            <button key={cat} type="button" onClick={() => setActive(cat)} style={{
              padding: '7px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
              textTransform: 'uppercase', border: '1.5px solid',
              borderColor: active === cat ? '#d42020' : '#e0e0e0',
              background: active === cat ? '#d42020' : 'none',
              color: active === cat ? '#fff' : '#737a80',
              cursor: 'pointer', fontFamily: 'Poppins,sans-serif',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .2s',
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding: '56px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: '#737a80', padding: '60px 0' }}>No services found in this category.</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {filtered.map(svc => (
              <Link
                key={svc.id}
                href={`/services/${svc.slug}`}
                aria-label={`View ${svc.name}`}
                className="card-shadow"
                style={{ background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {svc.image_url ? (
                  <div style={{ position: 'relative', height: 178 }}>
                    <Image src={svc.image_url} alt={svc.name} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      background: accent(svc.category), color: '#fff',
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '3px 10px',
                    }}>{svc.category}</span>
                  </div>
                ) : (
                  <div style={{ height: 5, background: accent(svc.category) }} />
                )}
                <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {!svc.image_url && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: accent(svc.category), marginBottom: 10, display: 'block',
                    }}>{svc.category}</span>
                  )}
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a181d', marginBottom: 8 }}>{svc.name}</h3>
                  {svc.description && (
                    <p style={{ fontSize: 13, color: '#737a80', lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{svc.description}</p>
                  )}
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: '#d42020',
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 'auto',
                  }}>
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        @media (max-width:900px){div[style*="repeat(3,1fr)"]{grid-template-columns:repeat(2,1fr)!important}}
        @media (max-width:560px){div[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}}
      `}</style>
    </>
  )
}

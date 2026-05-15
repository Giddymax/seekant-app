'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Product = { id: number; name: string; category: string; image_url: string; price_label: string }
const CATS = ['All', 'Print', 'Signage', 'Apparel', 'Gifts']

export default function ProductsClientPage({ products }: { products: Product[] }) {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? products : products.filter(p => p.category === active)

  return (
    <>
      <div style={{ marginTop: 68, background: '#15212c', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#d42020' }}>Products</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>Our Catalogue</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>Products</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>Browse our full range of 31 products — from print to apparel to gifts.</p>
        </div>
      </div>

      {/* Filter */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 68, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 8, height: 60 }}>
          {CATS.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '7px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              border: '1.5px solid', borderColor: active === cat ? '#d42020' : '#e0e0e0',
              background: active === cat ? '#d42020' : 'none', color: active === cat ? '#fff' : '#737a80',
              cursor: 'pointer', fontFamily: 'Poppins,sans-serif', transition: 'all .2s',
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <section style={{ padding: '56px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {filtered.map(p => (
              <div key={p.id} className="card-shadow" style={{ background: '#fff', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 180 }}>
                  <Image src={p.image_url || 'https://placehold.co/400x200'} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="25vw" />
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#d42020', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.category}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a181d', margin: '6px 0 6px', lineHeight: 1.3 }}>{p.name}</h3>
                  {p.price_label && <p style={{ fontSize: 12, color: '#737a80', marginBottom: 14 }}>{p.price_label}</p>}
                  <Link href="/quote" className="btn btn-gold" style={{ fontSize: 10, padding: '9px 18px', display: 'inline-block' }}>Order Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        @media(max-width:900px){div[style*="repeat(4,1fr)"]{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:480px){div[style*="repeat(4,1fr)"]{grid-template-columns:1fr!important}}
      `}</style>
    </>
  )
}

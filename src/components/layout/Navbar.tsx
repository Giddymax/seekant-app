'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const SERVICE_LINKS = [
  ['Photocopying',      '/services'],
  ['Business Cards',    '/services'],
  ['Banners & Signage', '/services'],
  ['Vehicle Branding',  '/services'],
  ['Custom Jerseys',    '/services'],
  ['Screen Printing',   '/services'],
  ['Branding & Design', '/services'],
  ['Book Printing',     '/services'],
  ['Mug Printing',      '/services'],
  ['ID Card Printing',  '/services'],
  ['Embroidery',        '/services'],
  ['Souvenir Printing', '/services'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        id="nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
          background: '#15212c', height: 68,
          display: 'flex', alignItems: 'center',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,.45)' : '0 2px 20px rgba(0,0,0,.35)',
          transition: 'box-shadow 0.3s',
        }}
      >
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 28px',
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: '#ddb837',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: '#1a181d', letterSpacing: '-0.03em',
            }}>SM</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.15 }}>
              SEEKANT MULTIMEDIA
              <small style={{ display: 'block', fontSize: 10, fontWeight: 400, color: '#ddb837', letterSpacing: '0.12em' }}>
                Printing &amp; Branding
              </small>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="nav-menu" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[
              ['Home',      '/'],
              ['About',     '/about'],
              ['Products',  '/products'],
              ['Our Works', '/works'],
              ['Gallery',   '/gallery'],
              ['Blog',      '/blog'],
              ['Contacts',  '/contacts'],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{
                color: 'rgba(255,255,255,.72)', fontSize: '12.5px', fontWeight: 600,
                padding: '8px 10px', letterSpacing: '0.03em',
                transition: 'color .18s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ddb837')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.72)')}
              >{label}</Link>
            ))}

            {/* Services dropdown */}
            <div style={{ position: 'relative' }} className="group">
              <Link href="/services" style={{
                color: 'rgba(255,255,255,.72)', fontSize: '12.5px', fontWeight: 600,
                padding: '8px 10px', letterSpacing: '0.03em',
                transition: 'color .18s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                Services <span style={{ fontSize: 8, verticalAlign: '1px' }}>▾</span>
              </Link>
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
                transform: 'translateX(-50%)', background: '#29353f',
                width: 520, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2,
                borderTop: '2px solid #ddb837', boxShadow: '0 20px 50px rgba(0,0,0,.5)',
                opacity: 0, pointerEvents: 'none', transition: 'opacity .22s, transform .22s',
                zIndex: 2000,
              }}
                className="drop-menu"
              >
                {SERVICE_LINKS.map(([name]) => (
                  <Link key={name} href="/services" style={{
                    color: 'rgba(255,255,255,.68)', fontSize: 12, fontWeight: 500,
                    padding: '8px 12px', transition: 'color .15s, background .15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#ddb837'; e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.68)'; e.currentTarget.style.background = 'none' }}
                  >{name}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/quote" className="btn btn-gold" style={{ fontSize: 11, padding: '10px 20px' }}>
              Get Quote
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#fff', display: 'none', padding: 4,
              }}
              className="hamburger"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 998, background: '#15212c',
          paddingTop: 68, display: 'flex', flexDirection: 'column',
          animation: 'fadeIn 0.2s ease',
        }}>
          {[
            ['Home',      '/'],
            ['About',     '/about'],
            ['Services',  '/services'],
            ['Products',  '/products'],
            ['Our Works', '/works'],
            ['Gallery',   '/gallery'],
            ['Blog',      '/blog'],
            ['Contacts',  '/contacts'],
          ].map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} style={{
              color: 'rgba(255,255,255,.8)', fontSize: 16, fontWeight: 600,
              padding: '18px 32px', borderBottom: '1px solid rgba(255,255,255,.08)',
              letterSpacing: '0.03em',
            }}>{label}</Link>
          ))}
          <div style={{ padding: '24px 32px' }}>
            <Link href="/quote" onClick={() => setOpen(false)} className="btn btn-gold" style={{ width: '100%', textAlign: 'center' }}>
              Get a Quote
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-menu { display: none !important; }
          .hamburger { display: block !important; }
        }
        .group:hover .drop-menu {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </>
  )
}

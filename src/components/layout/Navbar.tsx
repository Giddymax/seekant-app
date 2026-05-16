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

  // Toggle CSS class on <html> — most reliable way to show/hide on iOS Safari
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    return () => document.documentElement.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <input
        id="mobile-menu-toggle"
        className="mobile-menu-toggle"
        type="checkbox"
        checked={open}
        onChange={event => setOpen(event.currentTarget.checked)}
        aria-hidden="true"
      />
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
        <div
          className="nav-inner"
          style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 28px',
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
          }}
        >
          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 11, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', background: '#fff', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Seekant Multimedia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.15 }}>
              SEEKANT MULTIMEDIA
              <small style={{ display: 'block', fontSize: 10, fontWeight: 400, color: '#d42020', letterSpacing: '0.12em' }}>
                Printing &amp; Branding
              </small>
            </div>
          </Link>

          {/* Desktop nav links */}
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
                onMouseEnter={e => (e.currentTarget.style.color = '#d42020')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.72)')}
              >{label}</Link>
            ))}

            {/* Services dropdown */}
            <div style={{ position: 'relative' }} className="group">
              <Link href="/services" style={{
                color: 'rgba(255,255,255,.72)', fontSize: '12.5px', fontWeight: 600,
                padding: '8px 10px', letterSpacing: '0.03em',
                transition: 'color .18s', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                Services <span style={{ fontSize: 8, verticalAlign: '1px' }}>▾</span>
              </Link>
              <div
                className="drop-menu"
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
                  transform: 'translateX(-50%)', background: '#29353f',
                  width: 520, padding: 16,
                  display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2,
                  borderTop: '2px solid #d42020', boxShadow: '0 20px 50px rgba(0,0,0,.5)',
                  opacity: 0, pointerEvents: 'none', transition: 'opacity .22s',
                  zIndex: 2000,
                }}
              >
                {SERVICE_LINKS.map(([name]) => (
                  <Link key={name} href="/services" style={{
                    color: 'rgba(255,255,255,.68)', fontSize: 12, fontWeight: 500,
                    padding: '8px 12px', transition: 'color .15s, background .15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#d42020'; e.currentTarget.style.background = 'rgba(255,255,255,.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.68)'; e.currentTarget.style.background = 'none' }}
                  >{name}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: CTA + hamburger */}
          <div className="nav-cta">
            <Link href="/quote" className="btn btn-gold" style={{ fontSize: 11, padding: '10px 20px' }}>
              Get Quote
            </Link>
          </div>

          {/* Hamburger */}
          <label
            htmlFor="mobile-menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            role="button"
            tabIndex={0}
            className="hamburger"
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setOpen(o => !o)
              }
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </label>
        </div>
      </nav>

      {/* Mobile menu — visibility is 100% CSS-controlled via html.menu-open class */}
      <div className="mobile-nav-overlay">
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
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            style={{
              color: 'rgba(255,255,255,.9)', fontSize: 18, fontWeight: 600,
              padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,.07)',
              letterSpacing: '0.02em', display: 'block',
            }}
          >{label}</Link>
        ))}
        <div style={{ padding: '28px' }}>
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="btn btn-gold"
            style={{ display: 'block', textAlign: 'center', width: '100%', fontSize: 13, padding: '16px' }}
          >
            Get a Quote
          </Link>
        </div>
      </div>

      <style>{`
        .group:hover .drop-menu {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </>
  )
}

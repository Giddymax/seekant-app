'use client'

import Link from 'next/link'
import NewsletterBar from '@/components/home/NewsletterBar'

const QUICK_LINKS = [
  ['Home',      '/'],
  ['About Us',  '/about'],
  ['Products',  '/products'],
  ['Our Works', '/works'],
  ['Gallery',   '/gallery'],
  ['Blog',      '/blog'],
  ['Contacts',  '/contacts'],
]

const SERVICES = [
  'Business Cards', 'Large Format Print', 'Branding Services',
  'Vehicle Branding', 'Book Printing', 'Custom Jerseys',
]

export default function Footer() {
  return (
    <footer style={{ background: '#15212c', color: 'rgba(255,255,255,.6)', fontFamily: 'Poppins, sans-serif' }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 48px 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40 }}>
        {/* Brand column */}
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddb837', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#1a181d', flexShrink: 0 }}>SM</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.15 }}>
              SEEKANT MULTIMEDIA
              <small style={{ display: 'block', fontSize: 10, fontWeight: 400, color: '#ddb837', letterSpacing: '0.12em' }}>Design. Print. Brand.</small>
            </div>
          </Link>
          <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 24, color: 'rgba(255,255,255,.5)' }}>
            Your trusted printing and branding partner — delivering quality across every medium, from a single business card to a full brand identity.
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Facebook',  href: '#', color: '#1877f2', d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'WhatsApp', href: '#', color: '#25d366', d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
              { label: 'YouTube',  href: '#', color: '#ff0000', d: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 00-1.95 1.97A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              { label: 'TikTok',   href: '#', color: '#fff',    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z' },
            ].map(({ label, href, color, d }) => (
              <a key={label} href={href} aria-label={label} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = color + '33')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Quick Links</h4>
          <div style={{ width: 32, height: 2, background: '#ddb837', marginBottom: 18 }} />
          {QUICK_LINKS.map(([label, href]) => (
            <Link key={label} href={href} style={{ display: 'block', color: 'rgba(255,255,255,.5)', fontSize: 13, marginBottom: 10, transition: 'color .18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ddb837')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}
            >{label}</Link>
          ))}
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Our Services</h4>
          <div style={{ width: 32, height: 2, background: '#ddb837', marginBottom: 18 }} />
          {SERVICES.map(s => (
            <Link key={s} href="/services" style={{ display: 'block', color: 'rgba(255,255,255,.5)', fontSize: 13, marginBottom: 10, transition: 'color .18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ddb837')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.5)')}
            >{s}</Link>
          ))}
          <Link href="/services" style={{ color: '#ddb837', fontSize: 12, fontWeight: 700 }}>All 36 Services →</Link>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>Contact Us</h4>
          <div style={{ width: 32, height: 2, background: '#ddb837', marginBottom: 18 }} />
          {[
            { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Main Street, City Centre, Accra, Ghana' },
            { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+233 XX XXX XXXX' },
            { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'info@seekantmultimedia.com' },
            { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Mon–Fri: 8am – 6pm  |  Sat: 9am – 4pm' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddb837" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                <path d={icon} />
              </svg>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter bar */}
      <NewsletterBar />

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '16px 48px', maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>© 2026 Seekant Multimedia. All rights reserved.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {['Privacy Policy', 'Terms of Use'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', transition: 'color .18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.3)')}
            >{l}</a>
          ))}
          <Link href="/quote" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', transition: 'color .18s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.3)')}
          >Get a Quote</Link>
          {/* Gear icon — staff portal */}
          <Link href="/admin/login" title="Staff Login" style={{ opacity: 0.3, color: 'rgba(255,255,255,.7)', display: 'inline-flex', alignItems: 'center', transition: 'opacity .2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.3')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.33.07-.67.07-1.08s-.03-.74-.07-1.08l2.32-1.81c.21-.16.27-.45.13-.68l-2.2-3.82c-.13-.23-.42-.3-.65-.23l-2.73 1.1c-.57-.44-1.18-.79-1.85-1.07l-.42-2.9C14.22 2.18 13.96 2 13.68 2h-3.36c-.28 0-.54.18-.58.44l-.42 2.9c-.67.28-1.27.63-1.85 1.07l-2.73-1.1c-.24-.1-.52 0-.65.23L2.39 9.36c-.14.23-.08.52.13.68l2.32 1.81C4.8 12.26 4.77 12.6 4.77 13s.03.74.07 1.08l-2.32 1.81c-.21.16-.27.45-.13.68l2.2 3.82c.13.23.42.3.65.23l2.73-1.1c.57.44 1.18.79 1.85 1.07l.42 2.9c.04.26.3.44.58.44h3.36c.28 0 .54-.18.58-.44l.42-2.9c.67-.28 1.27-.63 1.85-1.07l2.73 1.1c.24.1.52 0 .65-.23l2.2-3.82c.14-.23.08-.52-.13-.68l-2.32-1.81z"/>
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          footer > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

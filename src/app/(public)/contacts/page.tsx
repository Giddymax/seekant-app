import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Contact Us – Seekant Multimedia' }

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from('site_content').select('key,value')
  const c = Object.fromEntries((rows ?? []).map(r => [r.key, r.value]))
  const heroImage = c.page_hero_contacts_image || ''
  const heroTag = c.page_header_contacts_tag || 'Get In Touch'
  const heroTitle = c.page_header_contacts_title || 'Contact Us'
  const heroSubtitle = c.page_header_contacts_subtitle || 'We\'re here Monday to Saturday. Walk in or reach out online.'

  const phoneVal = c.contact_phone || '+233 XX XXX XXXX'
  const emailVal = c.contact_email || 'info@seekantmultimedia.com'
  const contactItems = [
    { icon: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Address', value: c.contact_address || 'Asuom, Kwaebibirim Municipal, Eastern Region, Ghana', href: '' },
    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Phone', value: phoneVal, href: `tel:${phoneVal.replace(/\s+/g, '')}` },
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: emailVal, href: `mailto:${emailVal}` },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Hours', value: c.contact_hours || 'Mon–Fri: 8am – 6pm  |  Sat: 9am – 4pm', href: '' },
  ]

  return (
    <>
      <div style={{ marginTop: 68, background: heroImage ? `url(${heroImage})` : '#15212c', backgroundSize: 'cover', backgroundPosition: 'center', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: heroImage ? 'rgba(0,0,0,.62)' : 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#d42020' }}>Contacts</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>{heroTag}</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>{heroTitle}</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>{heroSubtitle}</p>
        </div>
      </div>

      <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--brand-heading, #1a181d)', marginBottom: 32 }}>Our Contact Details</h2>
            {contactItems.map(({ icon, label, value, href }) => (
              <div key={label} style={{ display: 'flex', gap: 18, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(221,184,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d42020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#d42020', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  {href ? (
                    <a href={href} style={{ fontSize: 14, color: 'var(--brand-text, #737a80)', lineHeight: 1.6, textDecoration: 'none' }}>{value}</a>
                  ) : (
                    <div style={{ fontSize: 14, color: 'var(--brand-text, #737a80)', lineHeight: 1.6 }}>{value}</div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <Link href="/quote" className="btn btn-gold">Get a Free Quote</Link>
            </div>
          </div>

          {/* Map placeholder */}
          <div style={{ background: '#dde0e4', height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d42020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p style={{ fontSize: 13, color: 'var(--brand-text, #737a80)' }}>Asuom, Kwaebibirim Municipal<br />Eastern Region, Ghana</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

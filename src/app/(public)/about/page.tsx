import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = { title: 'About Us – Seekant Multimedia' }

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: content } = await supabase.from('site_content').select('key,value')
  const c = Object.fromEntries((content ?? []).map(r => [r.key, r.value]))

  return (
    <>
      {/* Page hero */}
      <div style={{ marginTop: 68, background: '#15212c', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.4)', transition: 'color .18s' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#ddb837' }}>About Us</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20 }}>Our Story</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            About Seekant Multimedia
          </h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>
            We are a full-service printing and branding company based in Akyem Asuom, Ghana.
          </p>
        </div>
      </div>

      {/* Story section */}
      <section style={{ padding: '88px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&h=500&fit=crop&auto=format&q=80"
              alt="Seekant Multimedia office" fill style={{ objectFit: 'cover' }} sizes="50vw"
            />
          </div>
          <div>
            <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>Who We Are</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: '#1a181d', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
              {c.about_heading || 'About Seekant Multimedia'}
            </h2>
            <p style={{ fontSize: 14, color: '#737a80', lineHeight: 1.9, marginBottom: 28 }}>
              {c.about_body || 'We are a full-service printing and branding company based in Akyem Asuom, Ghana. From a single business card to a complete brand identity, we deliver quality across every medium with speed and care.'}
            </p>
            <div style={{ display: 'flex', gap: 32, marginBottom: 36 }}>
              {[['500+', 'Projects'], ['10+', 'Years'], ['200+', 'Clients']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#ddb837' }}>{v}</div>
                  <div style={{ fontSize: 11, color: '#737a80', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                </div>
              ))}
            </div>
            <Link href="/quote" className="btn btn-gold">Get a Quote</Link>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ padding: '88px 0', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 32 }}>
          {[
            { tag: 'Our Mission', title: 'Delivering Excellence in Every Print', body: 'To provide businesses and individuals with high-quality, affordable printing and branding solutions that help them communicate effectively and stand out in their market.', color: '#ddb837' },
            { tag: 'Our Vision',  title: 'Ghana\'s Leading Creative Print House', body: 'To become West Africa\'s most innovative and reliable full-service printing and branding company, known for quality, speed, and creative excellence.', color: '#fd4682' },
          ].map(({ tag, title, body, color }) => (
            <div key={tag} style={{ background: '#fff', padding: '48px 40px', borderTop: `4px solid ${color}` }} className="card-shadow">
              <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{tag}</span>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1a181d', margin: '16px 0 16px', lineHeight: 1.3 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#737a80', lineHeight: 1.9 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

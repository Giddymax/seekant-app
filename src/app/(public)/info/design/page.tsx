import Link from 'next/link'

export const metadata = {
  title: 'Graphic Design Services – Seekant Multimedia',
  description: 'Professional branding, logo design, and visual identity services from Seekant Multimedia in Asuom, Eastern Region, Ghana.',
}

const SERVICES = [
  { title: 'Logo & Brand Identity', desc: 'Custom logo design and complete brand identity systems — colour palettes, typography, usage guidelines.' },
  { title: 'Marketing Collateral', desc: 'Brochures, flyers, posters, banners, and all print-ready promotional materials.' },
  { title: 'Social Media Graphics', desc: 'On-brand templates and campaign visuals for every major platform.' },
  { title: 'Packaging Design', desc: 'Product packaging, labels, and unboxing experiences that stand out on the shelf.' },
  { title: 'UI / Digital Design', desc: 'Website mockups, app screens, and digital ad creatives that convert.' },
  { title: 'Presentation Design', desc: 'Pitch decks and corporate presentations that communicate with authority.' },
]

const PROCESS = [
  { step: '01', label: 'Brief', desc: 'We learn your brand story, audience, and goals through a discovery session.' },
  { step: '02', label: 'Concept', desc: 'Multiple initial concepts developed and shared for your feedback.' },
  { step: '03', label: 'Refine', desc: 'Two rounds of revisions to perfect every detail.' },
  { step: '04', label: 'Deliver', desc: 'Final files in all required formats — print-ready and digital.' },
]

export default function DesignInfoPage() {
  return (
    <main style={{ background: '#0d0f18', minHeight: '100vh', fontFamily: 'Poppins,sans-serif', color: '#fff' }}>
      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ddb837', borderBottom: '1px solid #ddb837', paddingBottom: 4, marginBottom: 24 }}>
          Design Services
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 700 }}>
          Design that makes your brand<br /><span style={{ color: '#ddb837' }}>impossible to ignore.</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', lineHeight: 1.8, maxWidth: 540, marginBottom: 40 }}>
          From a single logo to a full visual identity system, Seekant Multimedia crafts design that is purposeful, distinctive, and built to last.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/quote" style={{ display: 'inline-block', padding: '14px 32px', background: '#ddb837', color: '#1a181d', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Request a Quote
          </Link>
          <Link href="/services" style={{ display: 'inline-block', padding: '14px 32px', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.15)' }}>
            All Services
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>What We Offer</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 2 }}>
          {SERVICES.map(({ title, desc }) => (
            <div key={title} style={{ background: '#111320', padding: '32px 28px', borderLeft: '2px solid #ddb837' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 48 }}>Our Process</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
          {PROCESS.map(({ step, label, desc }) => (
            <div key={step}>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'rgba(221,184,55,.15)', lineHeight: 1, marginBottom: 12 }}>{step}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ddb837', marginBottom: 8 }}>{label}</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bar */}
      <section style={{ background: '#ddb837', padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a181d', marginBottom: 12 }}>Ready to build your brand?</h2>
        <p style={{ fontSize: 14, color: 'rgba(26,24,29,.65)', marginBottom: 32 }}>Tell us what you need — we'll get back to you within 24 hours.</p>
        <Link href="/quote" style={{ display: 'inline-block', padding: '14px 40px', background: '#1a181d', color: '#ddb837', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Start Your Project
        </Link>
      </section>
    </main>
  )
}

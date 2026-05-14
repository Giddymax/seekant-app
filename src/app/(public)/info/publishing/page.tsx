import Link from 'next/link'

export const metadata = {
  title: 'Publishing Services – Seekant Multimedia',
  description: 'Book design, layout, and publishing services — from manuscripts to print-ready files — by Seekant Multimedia in Accra, Ghana.',
}

const SERVICES = [
  { title: 'Book Design & Layout', desc: 'Interior typesetting, chapter design, and print-ready PDF output for self-published and commercial titles.' },
  { title: 'Cover Design', desc: 'Front, back, and spine cover design with full-bleed artwork, ISBN barcode, and barcode placement.' },
  { title: 'eBook Formatting', desc: 'EPUB and MOBI formatting optimised for Kindle, Apple Books, and other major platforms.' },
  { title: 'Magazine & Newsletter Layout', desc: 'Multi-page publication design using Adobe InDesign with master pages and style sheets.' },
  { title: 'Annual Reports', desc: 'Corporate annual reports and institutional publications that project credibility.' },
  { title: 'Academic & Thesis Formatting', desc: 'Strict style-guide formatting for academic theses, dissertations, and research papers.' },
]

const FORMATS = [
  { label: 'Output Formats', value: 'Print-ready PDF, EPUB 3, MOBI, InDesign IDML' },
  { label: 'Trim Sizes', value: 'A4, A5, 6×9 in, 5.5×8.5 in, custom sizes available' },
  { label: 'Colour Profiles', value: 'CMYK (print) / sRGB (digital/screen)' },
  { label: 'Fonts', value: 'Licensed professional typefaces included' },
  { label: 'Revisions', value: 'Three rounds of revisions included as standard' },
  { label: 'Turnaround', value: '3 – 7 working days depending on manuscript length' },
]

const STEPS = [
  { step: '01', label: 'Manuscript', desc: 'Submit your Word doc or raw text — we handle the rest.' },
  { step: '02', label: 'Design', desc: 'We propose a design direction tailored to your genre and audience.' },
  { step: '03', label: 'Layout', desc: 'Full typesetting with consistent styles, spacing, and page flow.' },
  { step: '04', label: 'Proof', desc: 'Digital proof for your review, followed by revisions.' },
  { step: '05', label: 'Export', desc: 'Final files delivered in all required formats for print and digital.' },
]

export default function PublishingInfoPage() {
  return (
    <main style={{ background: '#0d0f18', minHeight: '100vh', fontFamily: 'Poppins,sans-serif', color: '#fff' }}>
      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ddb837', borderBottom: '1px solid #ddb837', paddingBottom: 4, marginBottom: 24 }}>
          Publishing Services
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 700 }}>
          Your words deserve<br /><span style={{ color: '#ddb837' }}>a professional stage.</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', lineHeight: 1.8, maxWidth: 540, marginBottom: 40 }}>
          We turn manuscripts, reports, and ideas into beautifully typeset publications ready for print, digital distribution, or both.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/quote" style={{ display: 'inline-block', padding: '14px 32px', background: '#ddb837', color: '#1a181d', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Get a Publishing Quote
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
            <div key={title} style={{ background: '#111320', padding: '32px 28px', borderRight: '2px solid #ddb837' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 48 }}>Our Publishing Workflow</h2>
        <div style={{ display: 'flex', gap: 0 }}>
          {STEPS.map(({ step, label, desc }, i) => (
            <div key={step} style={{ flex: 1, paddingRight: i < STEPS.length - 1 ? 24 : 0, borderRight: i < STEPS.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'rgba(221,184,55,.15)', lineHeight: 1, marginBottom: 10 }}>{step}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ddb837', marginBottom: 8 }}>{label}</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical specs */}
      <section style={{ padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>Technical Details</h2>
        <div style={{ background: '#111320', padding: '0 28px' }}>
          {FORMATS.map(({ label, value }, i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < FORMATS.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 12, color: '#fff', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bar */}
      <section style={{ background: '#ddb837', padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a181d', marginBottom: 12 }}>Ready to publish?</h2>
        <p style={{ fontSize: 14, color: 'rgba(26,24,29,.65)', marginBottom: 32 }}>Share your manuscript or brief and we'll give you a timeline and quote today.</p>
        <Link href="/quote" style={{ display: 'inline-block', padding: '14px 40px', background: '#1a181d', color: '#ddb837', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Start Your Publication
        </Link>
      </section>
    </main>
  )
}

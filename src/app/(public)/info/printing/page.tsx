import Link from 'next/link'

export const metadata = {
  title: 'Printing Services – Seekant Multimedia',
  description: 'High-quality commercial printing — banners, flyers, business cards, signage, and more — from Seekant Multimedia in Asuom, Eastern Region, Ghana.',
}

const PRODUCTS = [
  { title: 'Business Cards', desc: 'Standard, square, and rounded corner cards on premium stocks with optional spot UV or foil.' },
  { title: 'Flyers & Leaflets', desc: 'Single and double-sided A4/A5 flyers, digital or litho-printed for any run size.' },
  { title: 'Banners & Roll-Ups', desc: 'Indoor and outdoor PVC banners, pull-up stands, and mesh banners for events.' },
  { title: 'Posters', desc: 'Large-format poster printing on gloss, satin, or matte paper in any standard size.' },
  { title: 'Branded Stationery', desc: 'Letterheads, envelopes, notepads, and branded office stationery.' },
  { title: 'Packaging & Labels', desc: 'Product labels, stickers, hang tags, and custom packaging solutions.' },
  { title: 'Branded Apparel', desc: 'T-shirts, polo shirts, caps, and uniforms with screen print or embroidery.' },
  { title: 'Promotional Items', desc: 'Branded pens, mugs, bags, keyrings, and corporate giveaways.' },
]

const SPECS = [
  { label: 'File Format', value: 'PDF (print-ready), AI, CDR, PSD' },
  { label: 'Colour Mode', value: 'CMYK — RGB files converted at no extra charge' },
  { label: 'Resolution', value: 'Minimum 300 dpi for all raster artwork' },
  { label: 'Bleed', value: '3 mm bleed on all sides, crop marks included' },
  { label: 'Turnaround', value: '24 – 72 hours depending on quantity and finishing' },
  { label: 'Delivery', value: 'Pick-up from Asuom or nationwide courier' },
]

export default function PrintingInfoPage() {
  return (
    <main style={{ background: '#0d0f18', minHeight: '100vh', fontFamily: 'Poppins,sans-serif', color: '#fff' }}>
      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ddb837', borderBottom: '1px solid #ddb837', paddingBottom: 4, marginBottom: 24 }}>
          Printing Services
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 700 }}>
          Print that commands<br /><span style={{ color: '#ddb837' }}>attention in the real world.</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', lineHeight: 1.8, maxWidth: 540, marginBottom: 40 }}>
          From a single business card to a full event fit-out, we deliver sharp, colour-accurate print on premium materials — on time, every time.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/quote" style={{ display: 'inline-block', padding: '14px 32px', background: '#ddb837', color: '#1a181d', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Get a Print Quote
          </Link>
          <Link href="/services" style={{ display: 'inline-block', padding: '14px 32px', background: 'transparent', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.15)' }}>
            All Services
          </Link>
        </div>
      </section>

      {/* Products grid */}
      <section style={{ padding: '0 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>Print Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 2 }}>
          {PRODUCTS.map(({ title, desc }) => (
            <div key={title} style={{ background: '#111320', padding: '28px 24px', borderTop: '2px solid #ddb837' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* File specs */}
      <section style={{ padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>Artwork Specifications</h2>
        <div style={{ background: '#111320', padding: '0 28px' }}>
          {SPECS.map(({ label, value }, i) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < SPECS.length - 1 ? '1px solid rgba(255,255,255,.05)' : 'none' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{label}</span>
              <span style={{ fontSize: 12, color: '#fff', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bar */}
      <section style={{ background: '#ddb837', padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a181d', marginBottom: 12 }}>Send us your artwork today</h2>
        <p style={{ fontSize: 14, color: 'rgba(26,24,29,.65)', marginBottom: 32 }}>We'll review your files and send a quote within 2 hours.</p>
        <Link href="/quote" style={{ display: 'inline-block', padding: '14px 40px', background: '#1a181d', color: '#ddb837', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
          Upload & Quote
        </Link>
      </section>
    </main>
  )
}

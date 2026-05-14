import Link from 'next/link'
import Image from 'next/image'

const IMAGES = [
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&h=400&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=400&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&h=400&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format&q=80',
]

export default function PortfolioStrip() {
  return (
    <section style={{ padding: '88px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="section-tag">Portfolio</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: '#1a181d', letterSpacing: '-0.025em', marginTop: 16 }}>
              Our Works
            </h2>
          </div>
          <Link href="/works" className="btn btn-outline">View All Projects</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {IMAGES.map((src, i) => (
            <Link key={i} href="/works" style={{ position: 'relative', display: 'block', overflow: 'hidden', aspectRatio: '4/3' }}>
              <Image
                src={src} alt={`Portfolio ${i + 1}`} fill
                style={{ objectFit: 'cover', transition: 'transform .4s' }}
                sizes="25vw"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(21,33,44,.7), transparent)',
                opacity: 0, transition: 'opacity .3s',
              }}
                className="port-overlay"
              />
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; } }
        a:hover .port-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  )
}

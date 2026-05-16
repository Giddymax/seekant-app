import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

const FALLBACK = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&h=400&fit=crop&auto=format&q=80', label: null },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=400&fit=crop&auto=format&q=80', label: null },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&h=400&fit=crop&auto=format&q=80', label: null },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format&q=80', label: null },
]

export default async function PortfolioStrip() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gallery_items')
    .select('id, image_url, label')
    .eq('active', true)
    .order('sort_order')
    .limit(4)

  const items = data?.length ? data : FALLBACK

  return (
    <section style={{ padding: '88px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="section-tag">Portfolio</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: 'var(--brand-heading, #1a181d)', letterSpacing: '-0.025em', marginTop: 16 }}>
              Our Works
            </h2>
          </div>
          <Link href="/works" className="btn btn-outline">View All Projects</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {items.map((item) => (
            <Link key={item.id} href="/works" style={{ position: 'relative', display: 'block', overflow: 'hidden', aspectRatio: '4/3' }}>
              <Image
                src={item.image_url} alt={item.label ?? `Portfolio ${item.id}`} fill
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

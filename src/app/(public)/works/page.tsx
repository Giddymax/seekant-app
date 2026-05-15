import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Our Works – Seekant Multimedia' }

const FALLBACK = [
  { id: '1', title: 'Full Brand Identity — Asante Group',  cat: 'Branding',   img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&h=460&fit=crop&auto=format&q=80' },
  { id: '2', title: 'Custom Jerseys — FC Accra Stars',     cat: 'Apparel',    img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=700&h=460&fit=crop&auto=format&q=80' },
  { id: '3', title: 'Vehicle Branding — GreenTech Fleet',  cat: 'Signage',    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&h=460&fit=crop&auto=format&q=80' },
  { id: '4', title: 'Wedding Stationery Suite',            cat: 'Print',      img: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=700&h=460&fit=crop&auto=format&q=80' },
  { id: '5', title: 'Annual Report — MidCorp Ltd.',        cat: 'Publishing', img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=700&h=460&fit=crop&auto=format&q=80' },
  { id: '6', title: 'Trade Fair Banners — Accra Expo',     cat: 'Signage',    img: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=700&h=460&fit=crop&auto=format&q=80' },
]

export default async function WorksPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('gallery_items')
    .select('id, image_url, label, category')
    .eq('active', true)
    .order('sort_order')

  const works = data?.length
    ? data.map(item => ({ id: item.id, title: item.label ?? '', cat: item.category ?? '', img: item.image_url }))
    : FALLBACK

  return (
    <>
      <div style={{ marginTop: 68, background: '#15212c', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#d42020' }}>Our Works</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>Portfolio</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>Our Works</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>A selection of projects we&apos;re proud of — from logos to large format.</p>
        </div>
      </div>

      <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {works.map(w => (
              <div key={w.id} className="card-shadow" style={{ background: '#fff', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                  <Image src={w.img} alt={w.title} fill style={{ objectFit: 'cover', transition: 'transform .4s' }} sizes="33vw" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(21,33,44,.6), transparent)' }} />
                  {w.cat && <span style={{ position: 'absolute', top: 14, left: 14, background: '#d42020', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px' }}>{w.cat}</span>}
                </div>
                {w.title && (
                  <div style={{ padding: '20px 22px 24px' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a181d', lineHeight: 1.4 }}>{w.title}</h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media(max-width:900px){div[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}}`}</style>
    </>
  )
}

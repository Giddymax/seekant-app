import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'Gallery – Seekant Multimedia' }

export default async function GalleryPage() {
  const supabase = await createClient()
  const [{ data: items }, { data: heroRow }] = await Promise.all([
    supabase.from('gallery_items').select('*').eq('active', true).order('sort_order'),
    supabase.from('site_content').select('value').eq('key', 'page_hero_gallery_image').single(),
  ])
  const heroImage = heroRow?.value || ''

  const photos = items?.length ? items : [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&h=400&fit=crop', label: 'Business Cards' },
    { id: 2, image_url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&h=400&fit=crop', label: 'Roll-Up Banner' },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=400&fit=crop', label: 'Custom Jersey' },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop', label: 'Vehicle Branding' },
    { id: 5, image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=800&fit=crop', label: 'Branding Design' },
    { id: 6, image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=400&fit=crop', label: 'Screen Printing' },
    { id: 7, image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop', label: 'Book Printing' },
    { id: 8, image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop', label: 'Mug Printing' },
  ]

  return (
    <>
      <div style={{ marginTop: 68, background: heroImage ? `url(${heroImage})` : '#15212c', backgroundSize: 'cover', backgroundPosition: 'center', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: heroImage ? 'rgba(0,0,0,.62)' : 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#d42020' }}>Gallery</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>Our Work</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>Gallery</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>A showcase of our finest printing and branding work.</p>
        </div>
      </div>

      <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ columns: '3 300px', gap: 16 }}>
            {photos.map(item => (
              <div key={item.id} style={{ breakInside: 'avoid', marginBottom: 16, position: 'relative', overflow: 'hidden' }} className="card-shadow">
                <Image
                  src={item.image_url || 'https://placehold.co/600x400'}
                  alt={item.label || 'Gallery item'}
                  width={600} height={400}
                  style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform .4s' }}
                />
                {item.label && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(21,33,44,.8))', padding: '20px 16px 14px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

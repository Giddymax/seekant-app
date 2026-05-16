import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getServiceContent } from '@/lib/service-content'

type Service = {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
  image_url: string | null
  sort_order: number
}

const CAT_COLOR: Record<string, string> = {
  Print: '#d42020',
  Signage: '#54b9fd',
  Apparel: '#4ade80',
  Design: '#c084fc',
  Publishing: '#fb923c',
  Embroidery: '#f472b6',
  Gifts: '#2dd4bf',
}

const FALLBACK_IMAGE = 'https://placehold.co/1440x560/15212c/ffffff?text=Seekant+Multimedia'

function accent(category: string) {
  return CAT_COLOR[category] ?? '#d42020'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('services')
    .select('name,description')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  return {
    title: data ? `${data.name} - Seekant Multimedia` : 'Service - Seekant Multimedia',
    description: data?.description ?? 'Professional printing, branding, and design services from Seekant Multimedia.',
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('id,name,slug,category,description,image_url,sort_order')
    .eq('slug', slug)
    .eq('active', true)
    .single<Service>()

  if (!service) notFound()

  const { data: related } = await supabase
    .from('services')
    .select('id,name,slug,category,image_url')
    .eq('active', true)
    .eq('category', service.category)
    .neq('slug', service.slug)
    .order('sort_order')
    .limit(3)

  const heroImage = service.image_url || FALLBACK_IMAGE
  const color = accent(service.category)
  const content = getServiceContent(service)

  return (
    <>
      <div className="service-detail-hero" style={{ marginTop: 68, position: 'relative', minHeight: 520, overflow: 'hidden' }}>
        <Image
          src={heroImage}
          alt={service.name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,rgba(21,33,44,.94) 0%,rgba(21,33,44,.78) 48%,rgba(21,33,44,.24) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', minHeight: 520, padding: '0 48px', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ maxWidth: 720, padding: '0 0 64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, fontSize: 12, color: 'rgba(255,255,255,.58)' }}>
              <Link href="/">Home</Link><span>/</span>
              <Link href="/services">Services</Link><span>/</span>
              <span style={{ color: '#fff' }}>{service.name}</span>
            </div>
            <span className="section-tag" style={{ display: 'inline-block', marginBottom: 18, background: color }}>{service.category}</span>
            <h1 style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 900, color: '#fff', letterSpacing: 0, lineHeight: 1.08, marginBottom: 18 }}>
              {service.name}
            </h1>
            {service.description && (
              <p style={{ color: 'rgba(255,255,255,.74)', fontSize: 16, lineHeight: 1.8, maxWidth: 620 }}>
                {service.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <section style={{ padding: '72px 0 88px', background: '#fff' }}>
        <div className="service-detail-grid" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: 48, alignItems: 'start' }}>
          <article>
            <span className="section-tag" style={{ marginBottom: 18, display: 'inline-block' }}>Service Details</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 900, color: '#1a181d', letterSpacing: 0, lineHeight: 1.16, marginBottom: 18 }}>
              {content.headline}
            </h2>
            {content.paragraphs.map((paragraph, index) => (
              <p key={paragraph} style={{ color: '#737a80', fontSize: 15, lineHeight: 1.9, marginBottom: index === content.paragraphs.length - 1 ? 0 : 22 }}>
                {paragraph}
              </p>
            ))}

            <div className="service-copy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 22, marginTop: 40 }}>
              <div style={{ background: '#f7f8fa', padding: '24px 24px 26px', borderTop: `3px solid ${color}` }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1a181d', marginBottom: 14 }}>What We Can Do</h3>
                <ul style={{ display: 'grid', gap: 10 }}>
                  {content.includes.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, color: '#737a80', fontSize: 13, lineHeight: 1.7 }}>
                      <span style={{ color, fontWeight: 900 }}>-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#f7f8fa', padding: '24px 24px 26px', borderTop: `3px solid ${color}` }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1a181d', marginBottom: 14 }}>Best For</h3>
                <ul style={{ display: 'grid', gap: 10 }}>
                  {content.idealFor.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 10, color: '#737a80', fontSize: 13, lineHeight: 1.7 }}>
                      <span style={{ color, fontWeight: 900 }}>-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href={`/quote?service=${encodeURIComponent(service.name)}`} className="btn btn-gold">Get a Quote</Link>
              <Link href="/services" className="btn btn-outline">Back to Services</Link>
            </div>
          </article>

          <aside style={{ background: '#f7f8fa', borderTop: `3px solid ${color}`, padding: '28px 28px 32px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a181d', marginBottom: 14 }}>At a glance</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Category</p>
                <p style={{ fontSize: 14, color: '#1a181d', fontWeight: 700 }}>{service.category}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Availability</p>
                <p style={{ fontSize: 14, color: '#1a181d', fontWeight: 700 }}>Available for quote</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: 4 }}>Turnaround</p>
                <p style={{ fontSize: 14, color: '#1a181d', fontWeight: 700, lineHeight: 1.6 }}>{content.turnaround}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: 8 }}>What to Bring</p>
                <ul style={{ display: 'grid', gap: 8 }}>
                  {content.prepare.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 9, color: '#737a80', fontSize: 13, lineHeight: 1.55 }}>
                      <span style={{ color, fontWeight: 900 }}>-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related && related.length > 0 && (
        <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a181d', marginBottom: 32 }}>Related Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {related.map(item => (
                <Link key={item.id} href={`/services/${item.slug}`} className="card-shadow" style={{ background: '#fff', overflow: 'hidden', display: 'block' }}>
                  <div style={{ position: 'relative', height: 180 }}>
                    <Image src={item.image_url || FALLBACK_IMAGE} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <p style={{ fontSize: 10, color: accent(item.category), fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{item.category}</p>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a181d', lineHeight: 1.4 }}>{item.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .service-detail-hero,
          .service-detail-hero > div {
            min-height: 460px !important;
          }
          .service-detail-hero > div {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .service-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
        @media (max-width: 560px) {
          .service-detail-hero,
          .service-detail-hero > div {
            min-height: 420px !important;
          }
          .service-detail-hero > div {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .service-detail-grid {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .service-copy-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}

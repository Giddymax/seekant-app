import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Blog – Seekant Multimedia' }

export default async function BlogPage() {
  const supabase = await createClient()
  const [{ data: posts }, { data: contentRows }] = await Promise.all([
    supabase.from('blog_posts').select('*').eq('status', 'Published').order('published_at', { ascending: false }),
    supabase.from('site_content').select('key,value').in('key', ['page_hero_blog_image', 'page_header_blog_tag', 'page_header_blog_title', 'page_header_blog_subtitle']),
  ])
  const c = Object.fromEntries((contentRows ?? []).map(r => [r.key, r.value]))
  const heroImage = c.page_hero_blog_image || ''
  const heroTag = c.page_header_blog_tag || 'Tips & Insights'
  const heroTitle = c.page_header_blog_title || 'Our Blog'
  const heroSubtitle = c.page_header_blog_subtitle || 'Design tips, printing guides, and branding advice from our team.'

  return (
    <>
      <div style={{ marginTop: 68, background: heroImage ? `url(${heroImage})` : '#15212c', backgroundSize: 'cover', backgroundPosition: 'center', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: heroImage ? 'rgba(0,0,0,.62)' : 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#d42020' }}>Blog</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>{heroTag}</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>{heroTitle}</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>{heroSubtitle}</p>
        </div>
      </div>

      <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          {!posts?.length && (
            <p style={{ textAlign: 'center', color: 'var(--brand-text, #737a80)', padding: '60px 0' }}>No articles published yet. Check back soon!</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {posts?.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ display: 'block', background: '#fff', overflow: 'hidden', textDecoration: 'none' }} className="card-shadow">
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <Image src={post.cover_url || 'https://placehold.co/800x400'} alt={post.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                  {post.category && (
                    <span style={{ position: 'absolute', top: 14, left: 14, background: '#d42020', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px' }}>{post.category}</span>
                  )}
                </div>
                <div style={{ padding: '24px 26px 28px' }}>
                  <p style={{ fontSize: 11, color: '#aaa', marginBottom: 10, letterSpacing: '0.04em' }}>{post.published_at ? formatDate(post.published_at) : ''}</p>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-heading, #1a181d)', lineHeight: 1.4, marginBottom: 10 }}>{post.title}</h2>
                  {post.excerpt && <p style={{ fontSize: 13, color: 'var(--brand-text, #737a80)', lineHeight: 1.7, marginBottom: 18 }}>{post.excerpt.slice(0, 120)}…</p>}
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#d42020', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <style>{`@media(max-width:900px){div[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}}`}</style>
    </>
  )
}

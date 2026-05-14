import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('title,excerpt').eq('slug', slug).single()
  return { title: data ? `${data.title} – Seekant Multimedia` : 'Article' }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: related }] = await Promise.all([
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'Published').single(),
    supabase.from('blog_posts').select('id,title,slug,cover_url,published_at,category').eq('status', 'Published').neq('slug', slug).limit(3),
  ])

  if (!post) notFound()

  return (
    <>
      {/* Hero */}
      <div style={{ marginTop: 68, position: 'relative', height: 420, overflow: 'hidden' }}>
        <Image src={post.cover_url || 'https://placehold.co/1440x420'} alt={post.title} fill style={{ objectFit: 'cover' }} priority sizes="100vw" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(21,33,44,.7)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '0 0 48px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', width: '100%', padding: '0 48px' }}>
            {post.category && <span className="section-tag" style={{ marginBottom: 16, display: 'inline-block' }}>{post.category}</span>}
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 12 }}>{post.title}</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', letterSpacing: '0.04em' }}>{post.published_at ? formatDate(post.published_at) : ''}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <section style={{ padding: '64px 0 88px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontSize: 12, color: '#aaa' }}>
            <Link href="/">Home</Link><span>/</span>
            <Link href="/blog">Blog</Link><span>/</span>
            <span style={{ color: '#ddb837' }}>{post.title}</span>
          </div>

          <div style={{ fontSize: 15, color: '#737a80', lineHeight: 1.9 }}>
            {post.content
              ? post.content.split('\n').map((p: string, i: number) => <p key={i} style={{ marginBottom: 18 }}>{p}</p>)
              : <p style={{ color: '#aaa' }}>Content coming soon.</p>
            }
          </div>

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 16 }}>
            <Link href="/blog" className="btn btn-outline">← Back to Blog</Link>
            <Link href="/quote" className="btn btn-gold">Get a Quote</Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related && related.length > 0 && (
        <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a181d', marginBottom: 32 }}>More Articles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} style={{ display: 'block', background: '#fff', overflow: 'hidden' }} className="card-shadow">
                  <div style={{ position: 'relative', height: 180 }}>
                    <Image src={r.cover_url || 'https://placehold.co/600x300'} alt={r.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                  </div>
                  <div style={{ padding: '18px 20px 22px' }}>
                    <p style={{ fontSize: 10, color: '#aaa', marginBottom: 8 }}>{r.published_at ? formatDate(r.published_at) : ''}</p>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a181d', lineHeight: 1.4 }}>{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

type Post = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  cover_url: string
  published_at: string
}

export default function BlogPreview({ posts }: { posts: Post[] }) {
  if (!posts.length) return null

  return (
    <section style={{ padding: '88px 0', background: '#f7f8fa' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="section-tag">Our Blog</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: '#1a181d', letterSpacing: '-0.025em', marginTop: 16 }}>
              Tips &amp; Insights
            </h2>
          </div>
          <Link href="/blog" className="btn btn-outline">All Articles</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ display: 'block', background: '#fff', overflow: 'hidden', textDecoration: 'none' }} className="card-shadow">
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <Image
                  src={post.cover_url || 'https://placehold.co/800x400'}
                  alt={post.title} fill
                  style={{ objectFit: 'cover', transition: 'transform .4s' }}
                  sizes="33vw"
                />
                {post.category && (
                  <span style={{
                    position: 'absolute', top: 14, left: 14,
                    background: '#d42020', color: '#fff',
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '3px 10px',
                  }}>{post.category}</span>
                )}
              </div>
              <div style={{ padding: '22px 24px 26px' }}>
                <p style={{ fontSize: 11, color: '#aaa', marginBottom: 10, letterSpacing: '0.04em' }}>
                  {post.published_at ? formatDate(post.published_at) : ''}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a181d', lineHeight: 1.4, marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p style={{ fontSize: 13, color: '#737a80', lineHeight: 1.7, marginBottom: 18 }}>
                    {post.excerpt.slice(0, 110)}…
                  </p>
                )}
                <span style={{ fontSize: 11, fontWeight: 700, color: '#d42020', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

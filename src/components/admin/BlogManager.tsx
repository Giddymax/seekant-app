'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertBlog, deleteBlog } from '@/lib/actions/admin'
import { slugify } from '@/lib/utils'
import ImageUploader from './ImageUploader'

type Post = {
  id: string
  title: string
  slug: string
  category: string | null
  status: string
  published_at: string | null
}

type EditPost = Post & { excerpt?: string; content?: string; cover_url?: string }

const BLANK: Omit<EditPost, 'id'> = { title: '', slug: '', category: '', status: 'Draft', published_at: null, excerpt: '', content: '', cover_url: '' }
const CATEGORIES = ['Design Tips', 'Printing Guides', 'Branding Advice', 'News', 'Other']
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

const statusColor: Record<string, string> = { Published: '#22c55e', Draft: '#d42020', Archived: '#aaa' }

export default function BlogManager({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [editing, setEditing] = useState<Partial<EditPost> | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!editing?.title) { toast.error('Title required'); return }
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(editing).forEach(([k, v]) => fd.append(k, String(v ?? '')))
      const result = await upsertBlog(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Article saved!')
      setEditing(null)
      window.location.reload()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this article?')) return
    startTransition(async () => {
      const result = await deleteBlog(id)
      if (result?.error) toast.error(result.error)
      else { toast.success('Deleted'); setPosts(p => p.filter(x => x.id !== id)) }
    })
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Blog Articles</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Create and manage blog posts shown on your website.</p>
        </div>
        <button type="button" onClick={() => setEditing({ ...BLANK })} className="btn btn-gold" style={{ fontSize: 11 }}>+ New Article</button>
      </div>

      <div className="admin-table-wrap" style={{ background: '#181b2e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              {['Title', 'Category', 'Status', 'Published', ''].map(h => (
                <th key={h} className={h === 'Category' || h === 'Published' ? 'admin-col-secondary' : undefined} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 20px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{p.title}</td>
                <td className="admin-col-secondary" style={{ padding: '14px 20px', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{p.category || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: `${statusColor[p.status] ?? '#aaa'}18`, color: statusColor[p.status] ?? '#aaa' }}>{p.status}</span>
                </td>
                <td className="admin-col-secondary" style={{ padding: '14px 20px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => setEditing({ ...p })} className="admin-action-btn" style={{ fontSize: 10, padding: '4px 12px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(p.id)} className="admin-action-btn" style={{ fontSize: 10, padding: '4px 12px', background: 'rgba(253,70,130,.12)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr><td colSpan={5} style={{ padding: '32px 20px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No articles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div className="admin-modal-inner" style={{ background: '#181b2e', width: '100%', maxWidth: 640, padding: '36px 36px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>{editing.id ? 'Edit Article' : 'New Article'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Title *</label>
                <input
                  title="Title"
                  value={editing.title ?? ''}
                  onChange={e => {
                    const t = e.target.value
                    setEditing(p => ({ ...p, title: t, slug: p?.id ? p.slug : slugify(t) }))
                  }}
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Slug</label>
                <input title="Slug" value={editing.slug ?? ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Category</label>
                  <select title="Category" value={editing.category ?? ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={{ ...inp, appearance: 'none' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                    <option value="">None</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Status</label>
                  <select title="Status" value={editing.status ?? 'Draft'} onChange={e => setEditing(p => ({ ...p, status: e.target.value }))} style={{ ...inp, appearance: 'none' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                    {['Draft', 'Published', 'Archived'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <ImageUploader
                bucket="blog-covers"
                value={editing.cover_url}
                onUpload={url => setEditing(p => ({ ...p, cover_url: url }))}
                label="Cover Image"
              />
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Excerpt</label>
                <textarea title="Excerpt" rows={2} value={editing.excerpt ?? ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))} style={{ ...inp, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Content</label>
                <textarea title="Content" rows={8} value={editing.content ?? ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))} style={{ ...inp, resize: 'vertical' }} placeholder="Write article content here. Separate paragraphs with blank lines." onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              {editing.status === 'Published' && (
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Publish Date</label>
                  <input title="Publish date" type="date" value={editing.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)} onChange={e => setEditing(p => ({ ...p, published_at: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save Article'}</button>
              <button type="button" onClick={() => setEditing(null)} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

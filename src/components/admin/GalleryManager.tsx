'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertGalleryItem, deleteGalleryItem } from '@/lib/actions/admin'
import ImageUploader from './ImageUploader'

type GalleryItem = {
  id: string
  image_url: string
  label: string | null
  category: string | null
  sort_order: number
  active: boolean
}

const BLANK: Omit<GalleryItem, 'id'> = {
  image_url: '', label: '', category: '', sort_order: 0, active: true,
}

const CATEGORIES = ['Business Cards', 'Banners & Signage', 'Vehicle Branding', 'Apparel', 'Branding & Design', 'Book Printing', 'Screen Printing', 'Other']

const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }
const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>{text}</label>
)

export default function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!editing) return
    if (!editing.image_url) { toast.error('Image is required'); return }
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(editing).forEach(([k, v]) => fd.append(k, String(v ?? '')))
      const result = await upsertGalleryItem(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Item saved!')
      setEditing(null)
      window.location.reload()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this gallery item?')) return
    startTransition(async () => {
      const result = await deleteGalleryItem(id)
      if (result?.error) toast.error(result.error)
      else { toast.success('Deleted'); setItems(s => s.filter(x => x.id !== id)) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Works &amp; Gallery</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Photos uploaded here appear on both the Our Works and Gallery pages.</p>
        </div>
        <button type="button" onClick={() => setEditing({ ...BLANK })} className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Photo</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 32 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: '#181b2e', overflow: 'hidden', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.label ?? ''} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label || '—'}</div>
              {item.category && <div style={{ fontSize: 10, color: '#d42020', marginBottom: 8 }}>{item.category}</div>}
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', background: item.active ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.08)', color: item.active ? '#22c55e' : '#aaa' }}>{item.active ? 'Active' : 'Hidden'}</span>
            </div>
            <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,.06)' }}>
              <button type="button" onClick={() => setEditing({ ...item })} style={{ flex: 1, fontSize: 11, padding: '8px', background: 'transparent', color: 'rgba(255,255,255,.5)', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Edit</button>
              <button type="button" onClick={() => handleDelete(item.id)} style={{ flex: 1, fontSize: 11, padding: '8px', background: 'transparent', color: '#fd4682', border: 'none', borderLeft: '1px solid rgba(255,255,255,.06)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Delete</button>
            </div>
          </div>
        ))}
        {!items.length && <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13, gridColumn: '1/-1' }}>No gallery items yet. Add one above.</p>}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div style={{ background: '#181b2e', width: '100%', maxWidth: 500, padding: '36px 36px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>{editing.id ? 'Edit Photo' : 'Add Photo'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ImageUploader
                bucket="gallery-images"
                value={editing.image_url}
                onUpload={url => setEditing(p => ({ ...p, image_url: url }))}
                label="Photo"
              />
              <div>{lbl('Label / Caption')}<input value={editing.label ?? ''} onChange={e => setEditing(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Business Cards for Asante Co." style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
              <div>
                {lbl('Category')}
                <select title="Category" value={editing.category ?? ''} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                  <option value="">— None —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>{lbl('Sort Order')}<input title="Sort Order" type="number" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#fff' }}>
                    <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} />
                    Active / Visible
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save Photo'}</button>
              <button type="button" onClick={() => setEditing(null)} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

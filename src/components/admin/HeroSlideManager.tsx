'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertHeroSlide, deleteHeroSlide } from '@/lib/actions/admin'
import ImageUploader from './ImageUploader'

type Slide = {
  id: string
  heading: string
  subtext: string | null
  tag: string | null
  btn1_label: string | null
  btn1_href: string | null
  btn2_label: string | null
  btn2_href: string | null
  image_url: string | null
  sort_order: number
  active: boolean
}

const BLANK: Omit<Slide, 'id'> = {
  heading: '', subtext: '', tag: '',
  btn1_label: 'Get a Quote', btn1_href: '/quote',
  btn2_label: '', btn2_href: '',
  image_url: '', sort_order: 0, active: true,
}

const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }
const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>{text}</label>
)

export default function HeroSlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [editing, setEditing] = useState<Partial<Slide> | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!editing) return
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(editing).forEach(([k, v]) => fd.append(k, String(v ?? '')))
      const result = await upsertHeroSlide(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Slide saved!')
      setEditing(null)
      window.location.reload()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this slide?')) return
    startTransition(async () => {
      const result = await deleteHeroSlide(id)
      if (result?.error) toast.error(result.error)
      else { toast.success('Deleted'); setSlides(s => s.filter(x => x.id !== id)) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Hero Slides</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Manage homepage hero carousel slides.</p>
        </div>
        <button type="button" onClick={() => setEditing({ ...BLANK })} className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Slide</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {slides.map(s => (
          <div key={s.id} style={{ background: '#181b2e', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            {s.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image_url} alt="" style={{ width: 80, height: 52, objectFit: 'cover', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              {s.tag && <div style={{ fontSize: 9, fontWeight: 700, color: '#ddb837', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{s.tag}</div>}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{s.heading}</div>
              {s.subtext && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{s.subtext.slice(0, 80)}…</div>}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: s.active ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.08)', color: s.active ? '#22c55e' : '#aaa' }}>{s.active ? 'Active' : 'Hidden'}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setEditing({ ...s })} style={{ fontSize: 11, padding: '6px 14px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Edit</button>
              <button type="button" onClick={() => handleDelete(s.id)} style={{ fontSize: 11, padding: '6px 14px', background: 'rgba(253,70,130,.12)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Delete</button>
            </div>
          </div>
        ))}
        {!slides.length && <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>No slides yet. Add one above.</p>}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div style={{ background: '#181b2e', width: '100%', maxWidth: 560, padding: '36px 36px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>{editing.id ? 'Edit Slide' : 'New Slide'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>{lbl('Tag / Label')}<input value={editing.tag ?? ''} onChange={e => setEditing(p => ({ ...p, tag: e.target.value }))} placeholder="e.g. New Arrivals" style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
              <div>{lbl('Heading')}<input title="Heading" value={editing.heading ?? ''} onChange={e => setEditing(p => ({ ...p, heading: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
              <div>{lbl('Subtext')}<textarea title="Subtext" rows={2} value={editing.subtext ?? ''} onChange={e => setEditing(p => ({ ...p, subtext: e.target.value }))} style={{ ...inp, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>{lbl('Button 1 Label')}<input title="Button 1 Label" value={editing.btn1_label ?? ''} onChange={e => setEditing(p => ({ ...p, btn1_label: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
                <div>{lbl('Button 1 Link')}<input title="Button 1 Link" value={editing.btn1_href ?? ''} onChange={e => setEditing(p => ({ ...p, btn1_href: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>{lbl('Button 2 Label')}<input title="Button 2 Label" value={editing.btn2_label ?? ''} onChange={e => setEditing(p => ({ ...p, btn2_label: e.target.value }))} placeholder="Optional" style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
                <div>{lbl('Button 2 Link')}<input title="Button 2 Link" value={editing.btn2_href ?? ''} onChange={e => setEditing(p => ({ ...p, btn2_href: e.target.value }))} placeholder="Optional" style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
              </div>
              <ImageUploader
                bucket="hero-images"
                value={editing.image_url}
                onUpload={url => setEditing(p => ({ ...p, image_url: url }))}
                label="Slide Image"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>{lbl('Sort Order')}<input title="Sort Order" type="number" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#fff' }}>
                    <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save Slide'}</button>
              <button type="button" onClick={() => setEditing(null)} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

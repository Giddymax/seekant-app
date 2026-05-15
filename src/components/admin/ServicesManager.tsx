'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertService, deleteService } from '@/lib/actions/admin'
import ImageUploader from './ImageUploader'

type Service = {
  id: string
  name: string
  category: string
  description: string | null
  image_url: string | null
  sort_order: number
  active: boolean
}

const BLANK: Omit<Service, 'id'> = { name: '', category: 'Print', description: '', image_url: '', sort_order: 0, active: true }
const CATEGORIES = ['Print', 'Signage', 'Apparel', 'Design', 'Publishing', 'Embroidery', 'Gifts', 'Other']
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<Partial<Service> | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!editing || !editing.name) { toast.error('Name required'); return }
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(editing).forEach(([k, v]) => fd.append(k, String(v ?? '')))
      const result = await upsertService(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Service saved!')
      setEditing(null)
      window.location.reload()
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this service?')) return
    startTransition(async () => {
      const result = await deleteService(id)
      if (result?.error) toast.error(result.error)
      else { toast.success('Deleted'); setServices(s => s.filter(x => x.id !== id)) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Services</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Manage services shown on your website.</p>
        </div>
        <button type="button" onClick={() => setEditing({ ...BLANK })} className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Service</button>
      </div>

      <div style={{ background: '#181b2e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              {['', 'Name', 'Category', 'Status', 'Order', ''].map((h, i) => (
                <th key={i} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 16px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <td style={{ padding: '10px 16px', width: 52 }}>
                  {s.image_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={s.image_url} alt="" style={{ width: 44, height: 32, objectFit: 'cover' }} />
                    : <div style={{ width: 44, height: 32, background: 'rgba(255,255,255,.06)' }} />
                  }
                </td>
                <td style={{ padding: '10px 16px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '10px 16px', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{s.category}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: s.active ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.08)', color: s.active ? '#22c55e' : '#aaa' }}>
                    {s.active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{s.sort_order}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => setEditing({ ...s })} style={{ fontSize: 10, padding: '4px 12px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(s.id)} style={{ fontSize: 10, padding: '4px 12px', background: 'rgba(253,70,130,.12)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!services.length && (
              <tr><td colSpan={6} style={{ padding: '32px 20px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No services yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div style={{ background: '#181b2e', width: '100%', maxWidth: 520, padding: '36px 36px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>{editing.id ? 'Edit Service' : 'New Service'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Name *</label>
                <input title="Service name" value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Category</label>
                <select title="Category" value={editing.category ?? 'Print'} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Description</label>
                <textarea title="Description" rows={3} value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} style={{ ...inp, resize: 'vertical' }} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <ImageUploader
                bucket="service-images"
                value={editing.image_url}
                onUpload={url => setEditing(p => ({ ...p, image_url: url }))}
                label="Service Image"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Sort Order</label>
                  <input title="Sort order" type="number" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#fff' }}>
                    <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p, active: e.target.checked }))} />
                    Active (show on site)
                  </label>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save'}</button>
              <button type="button" onClick={() => setEditing(null)} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

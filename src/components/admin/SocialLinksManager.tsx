'use client'

import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertSocialLink, deleteSocialLink, reorderSocialLinks } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

type SocialLink = {
  id: string
  platform: string
  label: string | null
  url: string
}

type IconMeta = { label: string; color: string; d: string; viewBox?: string }

const SOCIAL_META: Record<string, IconMeta> = {
  facebook: {
    label: 'Facebook', color: '#1877f2',
    d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  instagram: {
    label: 'Instagram', color: '#e1306c',
    d: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.2A4.8 4.8 0 1016.8 12 4.8 4.8 0 0012 7.2zm0 7.9A3.1 3.1 0 1115.1 12 3.1 3.1 0 0112 15.1zM17.2 6.6a1.1 1.1 0 101.1 1.1 1.1 1.1 0 00-1.1-1.1z',
  },
  twitter: {
    label: 'Twitter / X', color: '#fff',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  whatsapp: {
    label: 'WhatsApp', color: '#25d366',
    d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  },
  youtube: {
    label: 'YouTube', color: '#ff0000',
    d: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 00-1.95 1.97A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
  tiktok: {
    label: 'TikTok', color: '#fff',
    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z',
  },
  linkedin: {
    label: 'LinkedIn', color: '#0a66c2',
    d: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56z',
  },
}

const GENERIC_LINK_ICON = 'M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3zM8.603 16.5a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 10-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3z'

function iconFor(platform: string): IconMeta {
  return SOCIAL_META[platform] ?? { label: 'Link', color: '#fff', d: GENERIC_LINK_ICON, viewBox: '0 0 20 20' }
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#111320',
  border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
  fontSize: 12, fontFamily: 'inherit', outline: 'none',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6,
}
const modalBox: React.CSSProperties = {
  background: '#181b2e', width: '100%', maxWidth: 480, padding: '36px',
}

type Modal =
  | { type: 'add' }
  | { type: 'edit'; link: SocialLink }
  | { type: 'delete'; link: SocialLink }
  | null

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)
  const [addForm, setAddForm] = useState({ platform: 'facebook', label: '', url: '' })
  const [editForm, setEditForm] = useState({ label: '', url: '' })
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('social_links')
      .select('id,platform,label,url')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) toast.error(`Could not load social links: ${error.message}`)
        if (data) setLinks(data as SocialLink[])
        setLoading(false)
      })
  }, [])

  const closeModal = () => setModal(null)
  const usedPlatforms = new Set(links.map(l => l.platform))
  const availablePresets = Object.keys(SOCIAL_META).filter(p => !usedPlatforms.has(p))

  const openAdd = () => {
    setAddForm({ platform: availablePresets[0] ?? 'custom', label: '', url: '' })
    setModal({ type: 'add' })
  }

  const handleAdd = () => {
    if (!addForm.url.trim()) { toast.error('Enter a URL.'); return }
    if (addForm.platform === 'custom' && !addForm.label.trim()) { toast.error('Enter a label for the custom platform.'); return }
    startTransition(async () => {
      const fd = new FormData()
      if (addForm.platform !== 'custom') fd.append('platform', addForm.platform)
      fd.append('label', addForm.platform === 'custom' ? addForm.label : '')
      fd.append('url', addForm.url)
      const result = await upsertSocialLink(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Social link added!')
      closeModal()
      const supabase = createClient()
      const { data } = await supabase.from('social_links').select('id,platform,label,url').order('sort_order')
      if (data) setLinks(data as SocialLink[])
    })
  }

  const openEdit = (link: SocialLink) => {
    setEditForm({ label: link.label ?? '', url: link.url })
    setModal({ type: 'edit', link })
  }

  const handleEdit = (link: SocialLink) => {
    if (!editForm.url.trim()) { toast.error('Enter a URL.'); return }
    startTransition(async () => {
      const fd = new FormData()
      fd.append('id', link.id)
      fd.append('platform', link.platform)
      fd.append('label', SOCIAL_META[link.platform] ? '' : editForm.label)
      fd.append('url', editForm.url)
      const result = await upsertSocialLink(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Social link updated!')
      setLinks(ls => ls.map(l => l.id === link.id ? { ...l, url: editForm.url, label: SOCIAL_META[link.platform] ? l.label : editForm.label } : l))
      closeModal()
    })
  }

  const handleDelete = (link: SocialLink) => {
    startTransition(async () => {
      const result = await deleteSocialLink(link.id)
      if (result?.error) { toast.error(result.error); return }
      setLinks(ls => ls.filter(l => l.id !== link.id))
      closeModal()
      toast.success('Social link deleted.', {
        duration: 6000,
        action: { label: 'Undo', onClick: () => restoreLink(link) },
      })
    })
  }

  const restoreLink = (link: SocialLink) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.append('platform', link.platform)
      fd.append('label', link.label ?? '')
      fd.append('url', link.url)
      const result = await upsertSocialLink(fd)
      if (result?.error) { toast.error(result.error); return }
      const supabase = createClient()
      const { data } = await supabase.from('social_links').select('id,platform,label,url').order('sort_order')
      if (data) setLinks(data as SocialLink[])
      toast.success('Social link restored.')
    })
  }

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= links.length) return
    const reordered = [...links]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    setLinks(reordered)
    startTransition(async () => {
      const result = await reorderSocialLinks(reordered.map(l => l.id))
      if (result?.error) { toast.error(result.error); setLinks(links); return }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>Footer Social Icons</h2>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
        <button type="button" onClick={openAdd} className="btn btn-gold" style={{ fontSize: 11, flexShrink: 0 }}>+ Add Social Link</button>
      </div>

      <div style={{ background: '#181b2e', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', lineHeight: 1.7, marginBottom: 4 }}>
          These icons appear in the footer and open the URL in a new tab when clicked. Add, edit, or delete any platform below.
        </p>

        {loading && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Loading…</p>}
        {!loading && !links.length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>No social links yet — click &ldquo;+ Add Social Link&rdquo; to add one.</p>}

        {links.map((link, index) => {
          const meta = iconFor(link.platform)
          const displayLabel = SOCIAL_META[link.platform]?.label ?? link.label ?? 'Link'
          return (
            <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0 || isPending}
                  title="Move up"
                  style={{ width: 20, height: 16, background: 'rgba(255,255,255,.06)', border: 'none', color: index === 0 ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.6)', cursor: index === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}
                >▲</button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === links.length - 1 || isPending}
                  title="Move down"
                  style={{ width: 20, height: 16, background: 'rgba(255,255,255,.06)', border: 'none', color: index === links.length - 1 ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.6)', cursor: index === links.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}
                >▼</button>
              </div>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.07)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox={meta.viewBox ?? '0 0 24 24'} fill={meta.color}>
                  <path d={meta.d} />
                </svg>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{displayLabel}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', textDecoration: 'none', overflowWrap: 'anywhere' }}>{link.url}</a>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button type="button" onClick={() => openEdit(link)} className="admin-action-btn" style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(84,185,253,.1)', color: '#54b9fd', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                <button type="button" onClick={() => setModal({ type: 'delete', link })} className="admin-action-btn" style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24, cursor: 'pointer' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          {modal.type === 'add' && (
            <div style={modalBox}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Add Social Link</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Platform</label>
                  <select
                    value={addForm.platform}
                    onChange={e => setAddForm(f => ({ ...f, platform: e.target.value }))}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                  >
                    {availablePresets.map(p => <option key={p} value={p}>{SOCIAL_META[p].label}</option>)}
                    <option value="custom">Custom…</option>
                  </select>
                </div>
                {addForm.platform === 'custom' && (
                  <div>
                    <label style={lbl}>Label</label>
                    <input value={addForm.label} onChange={e => setAddForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Pinterest" style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                  </div>
                )}
                <div>
                  <label style={lbl}>URL</label>
                  <input type="url" value={addForm.url} onChange={e => setAddForm(f => ({ ...f, url: e.target.value }))} placeholder="https://…" style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={handleAdd} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Adding…' : 'Add Link'}</button>
                <button onClick={closeModal} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}

          {modal.type === 'edit' && (
            <div style={modalBox}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Edit Social Link</h2>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>{SOCIAL_META[modal.link.platform]?.label ?? modal.link.label}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {!SOCIAL_META[modal.link.platform] && (
                  <div>
                    <label style={lbl}>Label</label>
                    <input value={editForm.label} onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                  </div>
                )}
                <div>
                  <label style={lbl}>URL</label>
                  <input type="url" value={editForm.url} onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={() => handleEdit(modal.link)} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save Changes'}</button>
                <button onClick={closeModal} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}

          {modal.type === 'delete' && (
            <div style={modalBox}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>Delete Social Link?</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: 8 }}>
                This will remove the icon from the footer for:
              </p>
              <div style={{ background: '#111320', padding: '12px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{SOCIAL_META[modal.link.platform]?.label ?? modal.link.label}</p>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,100,100,.7)', marginBottom: 24 }}>You can undo this from the confirmation toast right after deleting.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => handleDelete(modal.link)}
                  disabled={isPending}
                  style={{ fontSize: 11, padding: '11px 22px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: isPending ? 0.7 : 1 }}
                >
                  {isPending ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button onClick={closeModal} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

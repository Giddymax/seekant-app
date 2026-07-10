'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSocialLinks } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const PLATFORMS = [
  { key: 'facebook',  label: 'Facebook',   placeholder: 'https://facebook.com/seekantmultimedia' },
  { key: 'instagram', label: 'Instagram',  placeholder: 'https://instagram.com/seekantmultimedia' },
  { key: 'twitter',   label: 'Twitter / X', placeholder: 'https://twitter.com/seekantmultimedia' },
  { key: 'whatsapp',  label: 'WhatsApp',   placeholder: 'https://wa.me/233XXXXXXXXX' },
  { key: 'youtube',   label: 'YouTube',    placeholder: 'https://youtube.com/@seekantmultimedia' },
  { key: 'tiktok',    label: 'TikTok',     placeholder: 'https://tiktok.com/@seekantmultimedia' },
  { key: 'linkedin',  label: 'LinkedIn',   placeholder: 'https://linkedin.com/company/seekantmultimedia' },
]

export default function SocialPage() {
  const [links, setLinks] = useState<Record<string, string>>({})
  const [backup, setBackup] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('social_links').select('platform,url').then(({ data }) => {
      if (data) setLinks(Object.fromEntries(data.map(r => [r.platform, r.url])))
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSocialLinks(links)
      if (result?.error) toast.error(result.error)
      else toast.success('Social links saved!')
    })
  }

  const handleDelete = (key: string) => {
    const previous = links[key] ?? ''
    startTransition(async () => {
      const result = await saveSocialLinks({ [key]: '' })
      if (result?.error) { toast.error(result.error); return }
      setLinks(l => ({ ...l, [key]: '' }))
      if (previous) setBackup(b => ({ ...b, [key]: previous }))
      toast.success(`${PLATFORMS.find(p => p.key === key)?.label} link deleted.`)
    })
  }

  const handleRestore = (key: string) => {
    const previous = backup[key]
    if (!previous) return
    startTransition(async () => {
      const result = await saveSocialLinks({ [key]: previous })
      if (result?.error) { toast.error(result.error); return }
      setLinks(l => ({ ...l, [key]: previous }))
      setBackup(b => { const next = { ...b }; delete next[key]; return next })
      toast.success(`${PLATFORMS.find(p => p.key === key)?.label} link restored.`)
    })
  }

  const inp: React.CSSProperties = {
    flex: 1, padding: '10px 14px', background: '#111320',
    border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
    fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none',
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Social Links</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>These power the footer social icons. Clear a link to hide that icon.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Links'}
        </button>
      </div>

      <div className="admin-card-padded" style={{ background: '#181b2e', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {PLATFORMS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>{label}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="url"
                value={links[key] ?? ''}
                placeholder={placeholder}
                onChange={e => setLinks(l => ({ ...l, [key]: e.target.value }))}
                style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              {links[key] && (
                <a
                  href={links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${label}`}
                  style={{ fontSize: 10, color: '#54b9fd', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none' }}
                >
                  Open ↗
                </a>
              )}
              {links[key] || !backup[key] ? (
                <button
                  type="button"
                  onClick={() => handleDelete(key)}
                  title={`Delete ${label} link`}
                  disabled={!links[key] || isPending}
                  className="admin-action-btn"
                  style={{
                    flexShrink: 0, padding: '9px 14px', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.04em', fontFamily: 'inherit',
                    background: links[key] ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.04)',
                    border: 'none',
                    color: links[key] ? '#ef4444' : 'rgba(255,255,255,.2)',
                    cursor: links[key] && !isPending ? 'pointer' : 'default',
                    opacity: isPending ? 0.6 : 1,
                  }}
                >
                  Delete
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRestore(key)}
                  title={`Restore ${label} link`}
                  disabled={isPending}
                  className="admin-action-btn"
                  style={{
                    flexShrink: 0, padding: '9px 14px', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.04em', fontFamily: 'inherit',
                    background: 'rgba(34,197,94,.1)',
                    border: 'none',
                    color: '#22c55e',
                    cursor: isPending ? 'default' : 'pointer',
                    opacity: isPending ? 0.6 : 1,
                  }}
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', marginTop: 12 }}>
        Click Delete to remove a link and hide its footer icon immediately. A Restore button appears until you leave this page, letting you undo the delete. Typing a new URL still requires Save Links.
      </p>
    </div>
  )
}

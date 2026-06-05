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
    setLinks(l => ({ ...l, [key]: '' }))
    toast.info(`${PLATFORMS.find(p => p.key === key)?.label} link cleared — save to apply.`)
  }

  const inp: React.CSSProperties = {
    flex: 1, padding: '10px 14px', background: '#111320',
    border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
    fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none',
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Social Links</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>These power the footer social icons. Clear a link to hide that icon.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Links'}
        </button>
      </div>

      <div style={{ background: '#181b2e', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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
              <button
                type="button"
                onClick={() => handleDelete(key)}
                title={`Remove ${label} link`}
                disabled={!links[key]}
                style={{
                  width: 34, height: 34, flexShrink: 0,
                  background: links[key] ? 'rgba(255,60,60,.1)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${links[key] ? 'rgba(255,60,60,.25)' : 'rgba(255,255,255,.08)'}`,
                  color: links[key] ? 'rgba(255,100,100,.8)' : 'rgba(255,255,255,.2)',
                  cursor: links[key] ? 'pointer' : 'default',
                  fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', marginTop: 12 }}>
        Click × to clear a link, then Save to remove it from the footer. Icons with no URL are hidden automatically.
      </p>
    </div>
  )
}

'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSocialLinks } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const PLATFORMS = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/seekantmultimedia' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/seekantmultimedia' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/seekantmultimedia' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/233XXXXXXXXX' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@seekantmultimedia' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@seekantmultimedia' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/seekantmultimedia' },
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

  const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Social Links</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>These appear in the footer and contact page.</p>
        </div>
        <button onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Links'}
        </button>
      </div>

      <div style={{ background: '#181b2e', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {PLATFORMS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>{label}</label>
            <input
              type="url"
              value={links[key] ?? ''}
              placeholder={placeholder}
              onChange={e => setLinks(l => ({ ...l, [key]: e.target.value }))}
              style={inp}
              onFocus={e => (e.target.style.borderColor = '#ddb837')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

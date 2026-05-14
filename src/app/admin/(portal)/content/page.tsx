'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const FIELDS = [
  { key: 'about_heading', label: 'About Heading', multiline: false },
  { key: 'about_body', label: 'About Body', multiline: true },
  { key: 'contact_address', label: 'Contact Address', multiline: false },
  { key: 'contact_phone', label: 'Contact Phone', multiline: false },
  { key: 'contact_email', label: 'Contact Email', multiline: false },
  { key: 'contact_hours', label: 'Business Hours', multiline: false },
  { key: 'footer_tagline', label: 'Footer Tagline', multiline: false },
  { key: 'seo_title', label: 'SEO Title', multiline: false },
  { key: 'seo_description', label: 'SEO Meta Description', multiline: true },
]

export default function ContentPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_content').select('key,value').then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(r => [r.key, r.value])))
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContent(values)
      if (result?.error) toast.error(result.error)
      else toast.success('Content saved!')
    })
  }

  const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Site Content</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Edit text content shown on your public website.</p>
        </div>
        <button onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save All'}
        </button>
      </div>

      <div style={{ background: '#181b2e', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {FIELDS.map(({ key, label, multiline }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>{label}</label>
            {multiline ? (
              <textarea
                rows={4}
                value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                style={{ ...inp, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = '#ddb837')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
            ) : (
              <input
                value={values[key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                style={inp}
                onFocus={e => (e.target.style.borderColor = '#ddb837')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

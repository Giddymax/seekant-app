'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const SECTIONS = [
  {
    title: 'General',
    fields: [
      { key: 'about_heading', label: 'About Page Heading', multiline: false },
      { key: 'about_body',    label: 'About Page Body',    multiline: true  },
      { key: 'footer_tagline', label: 'Footer Tagline',    multiline: false },
    ],
  },
  {
    title: 'Contact Details',
    fields: [
      { key: 'contact_address', label: 'Address',        multiline: false },
      { key: 'contact_phone',   label: 'Phone',          multiline: false },
      { key: 'contact_email',   label: 'Email',          multiline: false },
      { key: 'contact_hours',   label: 'Business Hours', multiline: false },
    ],
  },
  {
    title: 'SEO',
    fields: [
      { key: 'seo_title',       label: 'SEO Title',            multiline: false },
      { key: 'seo_description', label: 'SEO Meta Description', multiline: true  },
    ],
  },
  {
    title: 'Why Choose Us',
    fields: [
      { key: 'why_1_title', label: 'Feature 1 — Title',       multiline: false },
      { key: 'why_1_body',  label: 'Feature 1 — Description', multiline: true  },
      { key: 'why_2_title', label: 'Feature 2 — Title',       multiline: false },
      { key: 'why_2_body',  label: 'Feature 2 — Description', multiline: true  },
      { key: 'why_3_title', label: 'Feature 3 — Title',       multiline: false },
      { key: 'why_3_body',  label: 'Feature 3 — Description', multiline: true  },
    ],
  },
  {
    title: 'FAQ',
    fields: Array.from({ length: 5 }, (_, i) => [
      { key: `faq_${i + 1}_q`, label: `FAQ ${i + 1} — Question`, multiline: false },
      { key: `faq_${i + 1}_a`, label: `FAQ ${i + 1} — Answer`,   multiline: true  },
    ]).flat(),
  },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Site Content</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Edit all text shown on your public website.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save All'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {SECTIONS.map(section => (
          <div key={section.title}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontSize: 11, fontWeight: 800, color: '#ddb837', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{section.title}</h2>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
            </div>
            <div style={{ background: '#181b2e', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {section.fields.map(({ key, label, multiline }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>{label}</label>
                  {multiline ? (
                    <textarea
                      title={label}
                      rows={3}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                      style={{ ...inp, resize: 'vertical' }}
                      onFocus={e => (e.target.style.borderColor = '#ddb837')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                    />
                  ) : (
                    <input
                      title={label}
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
        ))}
      </div>
    </div>
  )
}

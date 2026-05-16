'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const NAV_COUNT = 8

const PAGE_HEROES = [
  { key: 'page_hero_about_image',    label: 'About Page' },
  { key: 'page_hero_services_image', label: 'Services Page' },
  { key: 'page_hero_gallery_image',  label: 'Gallery Page' },
  { key: 'page_hero_works_image',    label: 'Our Works Page' },
  { key: 'page_hero_blog_image',     label: 'Blog Page' },
  { key: 'page_hero_contacts_image', label: 'Contacts Page' },
  { key: 'page_hero_quote_image',    label: 'Quote Page' },
]

const ALL_KEYS = [
  ...Array.from({ length: NAV_COUNT }, (_, i) => [`nav_${i + 1}_label`, `nav_${i + 1}_url`]).flat(),
  ...PAGE_HEROES.map(h => h.key),
]

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#111320',
  border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
  fontSize: 12, fontFamily: 'inherit', outline: 'none',
}

const sectionHeader = (title: string) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
    <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{title}</h2>
    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
  </div>
)

export default function PagesPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_content').select('key,value').in('key', ALL_KEYS).then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(r => [r.key, r.value])))
    })
  }, [])

  const set = (key: string, val: string) => setValues(v => ({ ...v, [key]: val }))

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContent(values)
      if (result?.error) toast.error(result.error)
      else toast.success('Saved! Changes are live on the site.')
    })
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Pages &amp; Navigation</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Edit navbar links and page header background images.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

        {/* ── Navigation Items ── */}
        <div>
          {sectionHeader('Navigation Items')}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>
            Edit the label and URL for each navbar link. Clear the label to hide the item.
          </p>
          <div style={{ background: '#181b2e', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array.from({ length: NAV_COUNT }, (_, i) => {
              const n = i + 1
              const labelKey = `nav_${n}_label`
              const urlKey   = `nav_${n}_url`
              return (
                <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignItems: 'center' }}>
                  <div>
                    {i === 0 && <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Label</div>}
                    <input
                      value={values[labelKey] ?? ''}
                      onChange={e => set(labelKey, e.target.value)}
                      placeholder={`Nav item ${n} label`}
                      style={inp}
                      onFocus={e => (e.target.style.borderColor = '#d42020')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                    />
                  </div>
                  <div>
                    {i === 0 && <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>URL / Path</div>}
                    <input
                      value={values[urlKey] ?? ''}
                      onChange={e => set(urlKey, e.target.value)}
                      placeholder="/path or https://..."
                      style={inp}
                      onFocus={e => (e.target.style.borderColor = '#d42020')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginTop: 10 }}>
            The &quot;Services&quot; dropdown in the desktop navbar is always shown. Other items follow this list order.
          </p>
        </div>

        {/* ── Page Hero Images ── */}
        <div>
          {sectionHeader('Page Hero Images')}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>
            Paste an image URL to show it as the background of the page header banner. Leave empty to use the default dark colour.
          </p>
          <div style={{ background: '#181b2e', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {PAGE_HEROES.map(({ key, label }) => {
              const url = values[key] ?? ''
              return (
                <div key={key}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{label}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      value={url}
                      onChange={e => set(key, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      style={{ ...inp, flex: 1 }}
                      onFocus={e => (e.target.style.borderColor = '#d42020')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                    />
                    {url && (
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 10, fontWeight: 700, color: '#d42020', whiteSpace: 'nowrap', textDecoration: 'none' }}>
                        Preview ↗
                      </a>
                    )}
                  </div>
                  {url && (
                    <div style={{ marginTop: 8, height: 72, overflow: 'hidden', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

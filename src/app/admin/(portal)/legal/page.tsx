'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const KEYS = [
  'terms_title', 'terms_last_updated', 'terms_content',
  'privacy_title', 'privacy_last_updated', 'privacy_content',
]

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#111320',
  border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
  fontSize: 12, fontFamily: 'inherit', outline: 'none',
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6,
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>{title}</h2>
        <div style={{ height: 1, width: 120, background: 'rgba(255,255,255,.06)' }} />
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer"
        style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', textDecoration: 'none', letterSpacing: '0.06em' }}>
        Preview →
      </a>
    </div>
  )
}

export default function LegalPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_content').select('key,value').in('key', KEYS).then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(r => [r.key, r.value])))
      setLoaded(true)
    })
  }, [])

  const set = (key: string, value: string) => setValues(v => ({ ...v, [key]: value }))

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContent(values)
      if (result?.error) toast.error(result.error)
      else toast.success('Legal pages saved!')
    })
  }

  if (!loaded) return <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Loading…</p>

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Legal Pages</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Edit the Terms of Use and Privacy Policy pages. Use blank lines to separate paragraphs.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* Terms of Use */}
        <div style={{ background: '#181b2e', padding: '28px 32px' }}>
          <SectionHeader title="Terms of Use" href="/terms" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>Page Title</label>
                <input
                  value={values.terms_title ?? ''}
                  onChange={e => set('terms_title', e.target.value)}
                  placeholder="Terms of Use"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
              </div>
              <div>
                <label style={lbl}>Last Updated</label>
                <input
                  value={values.terms_last_updated ?? ''}
                  onChange={e => set('terms_last_updated', e.target.value)}
                  placeholder="e.g. May 2026"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
              </div>
            </div>
            <div>
              <label style={lbl}>Content</label>
              <textarea
                value={values.terms_content ?? ''}
                onChange={e => set('terms_content', e.target.value)}
                placeholder="Enter the full Terms of Use text here…"
                rows={18}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', marginTop: 6 }}>Plain text. Use blank lines between sections. Numbered headings (1. HEADING) work well.</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div style={{ background: '#181b2e', padding: '28px 32px' }}>
          <SectionHeader title="Privacy Policy" href="/privacy" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>Page Title</label>
                <input
                  value={values.privacy_title ?? ''}
                  onChange={e => set('privacy_title', e.target.value)}
                  placeholder="Privacy Policy"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
              </div>
              <div>
                <label style={lbl}>Last Updated</label>
                <input
                  value={values.privacy_last_updated ?? ''}
                  onChange={e => set('privacy_last_updated', e.target.value)}
                  placeholder="e.g. May 2026"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
              </div>
            </div>
            <div>
              <label style={lbl}>Content</label>
              <textarea
                value={values.privacy_content ?? ''}
                onChange={e => set('privacy_content', e.target.value)}
                placeholder="Enter the full Privacy Policy text here…"
                rows={18}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', marginTop: 6 }}>Plain text. Use blank lines between sections. Numbered headings (1. HEADING) work well.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

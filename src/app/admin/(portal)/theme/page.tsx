'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const COLORS = [
  { key: 'theme_dark', label: 'Dark Background', defaultVal: '#15212c', description: 'Main dark background used in hero sections and navbar.' },
  { key: 'theme_gold', label: 'Gold / Primary', defaultVal: '#ddb837', description: 'Primary brand accent — buttons, highlights, icons.' },
  { key: 'theme_pink', label: 'Pink / Accent', defaultVal: '#fd4682', description: 'Secondary accent — required fields, badges.' },
  { key: 'theme_blue', label: 'Blue / Accent', defaultVal: '#54b9fd', description: 'Used in gradient overlays and info elements.' },
  { key: 'theme_teal', label: 'Teal / Accent', defaultVal: '#315c5a', description: 'Supporting accent for stat cards and miscellaneous.' },
]

export default function ThemePage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_content').select('key,value').in('key', COLORS.map(c => c.key)).then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(r => [r.key, r.value])))
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContent(values)
      if (result?.error) toast.error(result.error)
      else toast.success('Theme saved! Colours will update on next deployment.')
    })
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Brand Theme</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Adjust brand colours. Changes take effect on next deploy.</p>
        </div>
        <button onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Theme'}
        </button>
      </div>

      <div style={{ background: '#181b2e', padding: '32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {COLORS.map(({ key, label, defaultVal, description }) => {
          const val = values[key] || defaultVal
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <input
                type="color"
                value={val}
                onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                style={{ width: 52, height: 52, border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>{description}</div>
                <input
                  value={val}
                  onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                  style={{ width: 120, padding: '6px 10px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 11, fontFamily: 'Poppins,sans-serif', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#ddb837')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
              </div>
              <div style={{ width: 80, height: 52, background: val, flexShrink: 0 }} />
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 20, padding: '16px 20px', background: '#181b2e', borderLeft: '2px solid rgba(221,184,55,.3)', fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
        Note: These values are stored in the database. To apply them to CSS, update the <code style={{ color: '#ddb837', fontSize: 11 }}>globals.css</code> @theme block with these values and redeploy.
      </div>
    </div>
  )
}

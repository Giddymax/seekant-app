'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

const COLORS = [
  { key: 'theme_dark', label: 'Dark Background', defaultVal: '#15212c', description: 'Navbar, footer, and dark hero backgrounds.' },
  { key: 'theme_gold', label: 'Primary Accent',  defaultVal: '#d42020', description: 'Buttons, highlights, active states, icons.' },
  { key: 'theme_pink', label: 'Pink / Accent',   defaultVal: '#fd4682', description: 'Secondary accent — badges, required fields.' },
  { key: 'theme_blue', label: 'Blue / Accent',   defaultVal: '#54b9fd', description: 'Gradient overlays and info elements.' },
  { key: 'theme_teal', label: 'Teal / Accent',   defaultVal: '#315c5a', description: 'Stat cards and supporting accents.' },
]

const TEXT_COLORS = [
  { key: 'theme_text_color',    label: 'Body Text',    defaultVal: '#737a80', description: 'Paragraph and general body text colour.' },
  { key: 'theme_heading_color', label: 'Heading Text', defaultVal: '#1a181d', description: 'Headings, titles, and bold labels.' },
]

const FONTS = [
  { value: 'Poppins',          label: 'Poppins',          weights: '300;400;500;600;700;800;900' },
  { value: 'Inter',            label: 'Inter',            weights: '300;400;500;600;700;800;900' },
  { value: 'Montserrat',       label: 'Montserrat',       weights: '300;400;500;600;700;800;900' },
  { value: 'Raleway',          label: 'Raleway',          weights: '300;400;500;600;700;800;900' },
  { value: 'Open Sans',        label: 'Open Sans',        weights: '300;400;500;600;700;800' },
  { value: 'Nunito',           label: 'Nunito',           weights: '300;400;500;600;700;800;900' },
  { value: 'Lato',             label: 'Lato',             weights: '300;400;700;900' },
  { value: 'Playfair Display', label: 'Playfair Display', weights: '400;500;600;700;800;900' },
  { value: 'DM Sans',          label: 'DM Sans',          weights: '300;400;500;600;700' },
]

const ALL_KEYS = [...COLORS, ...TEXT_COLORS].map(c => c.key).concat(['theme_font_family'])

export default function ThemePage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_content').select('key,value').in('key', ALL_KEYS).then(({ data }) => {
      if (data) setValues(Object.fromEntries(data.map(r => [r.key, r.value])))
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContent(values)
      if (result?.error) toast.error(result.error)
      else toast.success('Theme saved! Changes are now live on the site.')
    })
  }

  const selectedFont = values.theme_font_family || 'Poppins'

  // Google Fonts URL for all preview fonts (single request, multiple families)
  const previewFontUrl = `https://fonts.googleapis.com/css2?${
    FONTS.map(f => `family=${f.value.replace(/\s+/g, '+')}:wght@${f.weights}`).join('&')
  }&display=swap`

  const inp = { width: 120, padding: '6px 10px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 11, fontFamily: 'inherit', outline: 'none' }

  const sectionHeader = (title: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
    </div>
  )

  return (
    <>
      {/* Load all fonts for preview in this admin page only */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={previewFontUrl} />

      <div style={{ maxWidth: 680 }}>
        <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Brand Theme</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Colours, font, and text colour reflect live on the site after saving.</p>
          </div>
          <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
            {isPending ? 'Saving…' : 'Save Theme'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          {/* ── Brand Colours ── */}
          <div>
            {sectionHeader('Brand Colours')}
            <div className="admin-card-padded" style={{ background: '#181b2e', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {COLORS.map(({ key, label, defaultVal, description }) => {
                const val = values[key] || defaultVal
                return (
                  <div key={key} className="theme-color-row" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                        style={inp}
                        onFocus={e => (e.target.style.borderColor = '#d42020')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                      />
                    </div>
                    <div className="theme-color-swatch" style={{ width: 64, height: 52, background: val, flexShrink: 0 }} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Text Colours ── */}
          <div>
            {sectionHeader('Text Colours')}
            <div className="admin-card-padded" style={{ background: '#181b2e', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {TEXT_COLORS.map(({ key, label, defaultVal, description }) => {
                const val = values[key] || defaultVal
                return (
                  <div key={key} className="theme-color-row" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                        style={inp}
                        onFocus={e => (e.target.style.borderColor = '#d42020')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                      />
                    </div>
                    <div className="theme-color-swatch" style={{ width: 64, flexShrink: 0, textAlign: 'center' }}>
                      <span style={{ fontSize: 22, fontWeight: 700, color: val, lineHeight: 1 }}>Aa</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Font Family ── */}
          <div>
            {sectionHeader('Font Family')}
            <div style={{ background: '#181b2e', padding: '28px 32px' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 20, lineHeight: 1.7 }}>
                Select the typeface used across the entire public site. Each card shows the font in its own style. Click to select.
              </p>
              <div className="theme-font-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {FONTS.map(({ value, label }) => {
                  const active = selectedFont === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValues(v => ({ ...v, theme_font_family: value }))}
                      style={{
                        background: active ? 'rgba(212,32,32,.1)' : '#111320',
                        border: `1.5px solid ${active ? '#d42020' : 'rgba(255,255,255,.08)'}`,
                        padding: '18px 16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'border-color .15s, background .15s',
                        fontFamily: `'${value}', sans-serif`,
                        outline: 'none',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.22)' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.08)' }}
                    >
                      <div style={{ fontSize: 30, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,.8)', lineHeight: 1, marginBottom: 10, fontFamily: `'${value}', sans-serif` }}>
                        Aa
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? '#d42020' : 'rgba(255,255,255,.4)', fontFamily: 'inherit' }}>
                        {label}
                      </div>
                      {active && (
                        <div style={{ marginTop: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d42020' }}>
                          ✓ Selected
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Live preview sentence */}
              <div style={{ marginTop: 20, padding: '18px 20px', background: '#111320', border: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 10 }}>Preview</div>
                <div style={{ fontFamily: `'${selectedFont}', sans-serif` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6, lineHeight: 1.2 }}>
                    Design. Print. Brand.
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>
                    Professional printing and branding services — business cards, banners, jerseys, and more.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 18px', background: '#181b2e', borderLeft: '2px solid rgba(255,255,255,.08)', fontSize: 11, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
            All changes are applied via CSS custom properties on every page load. Visitors see the new style on their next page visit.
          </div>

        </div>
      </div>
    </>
  )
}

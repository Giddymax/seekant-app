'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { saveSiteContent, saveSocialLinks } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

type ContentField = {
  key: string
  label: string
  multiline: boolean
  inputType?: string
}

function linkFields(prefix: string, count: number, title: string): ContentField[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    return [
      { key: `${prefix}_${n}_label`, label: `${title} ${n} — Label`, multiline: false },
      { key: `${prefix}_${n}_url`, label: `${title} ${n} — URL`, multiline: false },
    ]
  }).flat()
}

const SECTIONS = [
  {
    title: 'General',
    fields: [
      { key: 'about_heading', label: 'About Page Heading', multiline: false },
      { key: 'about_body',    label: 'About Page Body',    multiline: true  },
    ],
  },
  {
    title: 'Footer Brand',
    fields: [
      { key: 'footer_brand_name',     label: 'Footer Brand Name', multiline: false },
      { key: 'footer_brand_subtitle', label: 'Footer Brand Subtitle', multiline: false },
      { key: 'footer_tagline',        label: 'Footer Description', multiline: true },
      { key: 'footer_copyright',      label: 'Copyright Text', multiline: false },
    ],
  },
  {
    title: 'Footer Headings & Bottom Links',
    fields: [
      { key: 'footer_quick_links_title', label: 'Quick Links Heading', multiline: false },
      { key: 'footer_services_title',    label: 'Services Heading', multiline: false },
      { key: 'footer_contact_title',     label: 'Contact Heading', multiline: false },
      { key: 'footer_all_services_label', label: 'All Services Link Label', multiline: false },
      { key: 'footer_all_services_url',   label: 'All Services Link URL', multiline: false },
      { key: 'footer_privacy_label', label: 'Privacy Link Label', multiline: false },
      { key: 'footer_privacy_url',   label: 'Privacy Link URL', multiline: false },
      { key: 'footer_terms_label',   label: 'Terms Link Label', multiline: false },
      { key: 'footer_terms_url',     label: 'Terms Link URL', multiline: false },
      { key: 'footer_quote_label',   label: 'Quote Link Label', multiline: false },
      { key: 'footer_quote_url',     label: 'Quote Link URL', multiline: false },
    ],
  },
  {
    title: 'Footer Quick Links',
    fields: linkFields('footer_quick', 7, 'Quick Link'),
  },
  {
    title: 'Footer Service Links',
    fields: linkFields('footer_service', 6, 'Service Link'),
  },
  {
    title: 'Contact Details',
    fields: [
      { key: 'contact_address',   label: 'Address',          multiline: false },
      { key: 'contact_phone',    label: 'Phone',            multiline: false },
      { key: 'contact_whatsapp', label: 'WhatsApp Number',  multiline: false },
      { key: 'contact_email',    label: 'Email',            multiline: false },
      { key: 'contact_hours',    label: 'Business Hours',   multiline: false },
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

const SOCIAL_PLATFORMS = [
  {
    key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/seekantmultimedia',
    color: '#1877f2',
    d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/seekantmultimedia',
    color: '#e1306c',
    d: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.2A4.8 4.8 0 1016.8 12 4.8 4.8 0 0012 7.2zm0 7.9A3.1 3.1 0 1115.1 12 3.1 3.1 0 0112 15.1zM17.2 6.6a1.1 1.1 0 101.1 1.1 1.1 1.1 0 00-1.1-1.1z',
  },
  {
    key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/seekantmultimedia',
    color: '#fff',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/233XXXXXXXXX',
    color: '#25d366',
    d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  },
  {
    key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@seekantmultimedia',
    color: '#ff0000',
    d: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 00-1.95 1.97A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
  {
    key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@seekantmultimedia',
    color: '#fff',
    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z',
  },
  {
    key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/seekantmultimedia',
    color: '#0a66c2',
    d: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56z',
  },
]

export default function ContentPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [links, setLinks] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('site_content').select('key,value'),
      supabase.from('social_links').select('platform,url'),
    ]).then(([{ data: contentData }, { data: socialData }]) => {
      if (contentData) setValues(Object.fromEntries(contentData.map(r => [r.key, r.value])))
      if (socialData) setLinks(Object.fromEntries(socialData.map(r => [r.platform, r.url])))
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const [contentResult, socialResult] = await Promise.all([
        saveSiteContent(values),
        saveSocialLinks(links),
      ])
      const err = contentResult?.error ?? socialResult?.error
      if (err) toast.error(err)
      else toast.success('Content saved!')
    })
  }

  const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
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
              <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{section.title}</h2>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
            </div>
            <div className="admin-card-padded" style={{ background: '#181b2e', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {section.fields.map(({ key, label, multiline, inputType }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>{label}</label>
                  {multiline ? (
                    <textarea
                      title={label}
                      rows={3}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                      style={{ ...inp, resize: 'vertical' }}
                      onFocus={e => (e.target.style.borderColor = '#d42020')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                    />
                  ) : (
                    <input
                      title={label}
                      type={inputType ?? 'text'}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                      style={inp}
                      onFocus={e => (e.target.style.borderColor = '#d42020')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Social Icons */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>Footer Social Icons</h2>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
          </div>
          <div style={{ background: '#181b2e', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', lineHeight: 1.7, marginBottom: 4 }}>
              Enter the full URL for each platform. Icons appear in the footer and open the URL in a new tab when clicked. Leave a field blank to hide that icon.
            </p>
            {SOCIAL_PLATFORMS.map(({ key, label, placeholder, color, d }) => (
              <div key={key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,.07)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
                      <path d={d} />
                    </svg>
                  </span>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    title={label}
                    type="url"
                    value={links[key] ?? ''}
                    placeholder={placeholder}
                    onChange={e => setLinks(l => ({ ...l, [key]: e.target.value }))}
                    style={{ ...inp, paddingRight: links[key] ? 80 : 14 }}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                  />
                  {links[key] && (
                    <a
                      href={links[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#d42020', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                    >
                      Open ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

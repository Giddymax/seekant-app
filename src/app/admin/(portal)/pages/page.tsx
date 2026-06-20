'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { saveSiteContent } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { createBrowserClient } from '@supabase/ssr'

const MAX_NAV = 12

const PAGE_HEROES = [
  { key: 'page_hero_about_image',    label: 'About Page' },
  { key: 'page_hero_services_image', label: 'Services Page' },
  { key: 'page_hero_gallery_image',  label: 'Gallery Page' },
  { key: 'page_hero_works_image',    label: 'Our Works Page' },
  { key: 'page_hero_blog_image',     label: 'Blog Page' },
  { key: 'page_hero_contacts_image', label: 'Contacts Page' },
  { key: 'page_hero_quote_image',    label: 'Quote Page' },
]

const PAGE_HEADER_TEXT = [
  {
    page: 'about',
    label: 'About Page',
    defaults: { tag: 'Our Story', title: 'About Seekant Multimedia', subtitle: 'We are a full-service printing and branding company based in Akyem Asuom, Ghana.' },
  },
  {
    page: 'services',
    label: 'Services Page',
    defaults: { tag: 'What We Offer', title: 'Our Services', subtitle: 'Over 36 professional printing, branding, and design services — all under one roof in Asuom.' },
  },
  {
    page: 'gallery',
    label: 'Gallery Page',
    defaults: { tag: 'Our Work', title: 'Gallery', subtitle: 'A showcase of our finest printing and branding work.' },
  },
  {
    page: 'works',
    label: 'Our Works Page',
    defaults: { tag: 'Portfolio', title: 'Our Works', subtitle: 'A selection of projects we\'re proud of — from logos to large format.' },
  },
  {
    page: 'blog',
    label: 'Blog Page',
    defaults: { tag: 'Tips & Insights', title: 'Our Blog', subtitle: 'Design tips, printing guides, and branding advice from our team.' },
  },
  {
    page: 'contacts',
    label: 'Contacts Page',
    defaults: { tag: 'Get In Touch', title: 'Contact Us', subtitle: 'We\'re here Monday to Saturday. Walk in or reach out online.' },
  },
  {
    page: 'quote',
    label: 'Quote Page',
    defaults: { tag: 'Free Estimate', title: 'Get a Quote', subtitle: 'Tell us about your project and we\'ll get back to you within 24 hours.' },
  },
]

const HEADER_KEYS = PAGE_HEADER_TEXT.flatMap(p => [
  `page_header_${p.page}_tag`,
  `page_header_${p.page}_title`,
  `page_header_${p.page}_subtitle`,
])

const NAV_KEYS = Array.from({ length: MAX_NAV }, (_, i) => [`nav_${i + 1}_label`, `nav_${i + 1}_url`]).flat()
const ALL_KEYS = [...NAV_KEYS, ...PAGE_HEROES.map(h => h.key), ...HEADER_KEYS]

const inp: React.CSSProperties = {
  padding: '9px 12px', background: '#111320',
  border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
  fontSize: 12, fontFamily: 'inherit', outline: 'none', width: '100%',
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
    </div>
  )
}

function HeroUploader({ heroKey, label, url, onUrl }: {
  heroKey: string; label: string; url: string; onUrl: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }

    setUploading(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const ext = file.name.split('.').pop()
    const path = `${heroKey}-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('hero-images').upload(path, file, { upsert: true })
    setUploading(false)
    if (error || !data) { toast.error('Upload failed — ' + (error?.message ?? 'unknown')); return }
    const { data: { publicUrl } } = supabase.storage.from('hero-images').getPublicUrl(data.path)
    onUrl(publicUrl)
    toast.success('Image uploaded')
  }

  return (
    <div style={{ background: '#111320', padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{label}</span>
        {url && (
          <button
            type="button"
            onClick={() => onUrl('')}
            style={{ fontSize: 10, color: 'rgba(255,100,100,.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
          >
            Remove
          </button>
        )}
      </div>

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={label} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block', marginBottom: 10, opacity: 0.85 }} />
      )}

      <div
        onClick={() => !uploading && ref.current?.click()}
        style={{
          border: '1.5px dashed rgba(255,255,255,.12)', padding: '12px',
          textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
          marginBottom: 8, transition: 'border-color .15s',
        }}
        onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLDivElement).style.borderColor = '#d42020' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.12)' }}
      >
        <p style={{ fontSize: 11, color: uploading ? '#d42020' : 'rgba(255,255,255,.35)', margin: 0 }}>
          {uploading ? 'Uploading…' : url ? '↑ Click to replace image' : '↑ Click to upload image (JPG, PNG, WebP — max 5 MB)'}
        </p>
      </div>
      <input ref={ref} type="file" title={`Upload ${label}`} accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

      <input
        title={`${label} URL`}
        value={url}
        onChange={e => onUrl(e.target.value)}
        placeholder="or paste image URL directly"
        style={inp}
        onFocus={e => (e.target.style.borderColor = '#d42020')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
      />
    </div>
  )
}

type NavItem = { label: string; href: string }

export default function PagesPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [heroUrls, setHeroUrls] = useState<Record<string, string>>({})
  const [headerText, setHeaderText] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()
  const [loaded, setLoaded] = useState(false)
  const [openPage, setOpenPage] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('site_content').select('key,value').in('key', ALL_KEYS).then(({ data }) => {
      if (!data) { setLoaded(true); return }
      const map = Object.fromEntries(data.map(r => [r.key, r.value]))

      const items: NavItem[] = []
      for (let i = 1; i <= MAX_NAV; i++) {
        const label = map[`nav_${i}_label`]
        const href  = map[`nav_${i}_url`]
        if (label) items.push({ label, href: href || '' })
      }
      setNavItems(items.length ? items : [
        { label: 'Home',      href: '/' },
        { label: 'About',     href: '/about' },
        { label: 'Services',  href: '/services' },
        { label: 'Products',  href: '/products' },
        { label: 'Our Works', href: '/works' },
        { label: 'Gallery',   href: '/gallery' },
        { label: 'Blog',      href: '/blog' },
        { label: 'Contacts',  href: '/contacts' },
      ])

      const heroes: Record<string, string> = {}
      PAGE_HEROES.forEach(({ key }) => { heroes[key] = map[key] ?? '' })
      setHeroUrls(heroes)

      const text: Record<string, string> = {}
      HEADER_KEYS.forEach(key => { text[key] = map[key] ?? '' })
      setHeaderText(text)

      setLoaded(true)
    })
  }, [])

  const setNav = (idx: number, field: 'label' | 'href', val: string) =>
    setNavItems(items => items.map((item, i) => i === idx ? { ...item, [field]: val } : item))

  const addNav = () => {
    if (navItems.length >= MAX_NAV) { toast.error(`Maximum ${MAX_NAV} nav items`); return }
    setNavItems(items => [...items, { label: '', href: '' }])
  }

  const removeNav = (idx: number) =>
    setNavItems(items => items.filter((_, i) => i !== idx))

  const setHero = (key: string, url: string) =>
    setHeroUrls(v => ({ ...v, [key]: url }))

  const setHeader = (key: string, val: string) =>
    setHeaderText(v => ({ ...v, [key]: val }))

  const handleSave = () => {
    startTransition(async () => {
      const values: Record<string, string> = {}
      for (let i = 0; i < MAX_NAV; i++) {
        values[`nav_${i + 1}_label`] = navItems[i]?.label ?? ''
        values[`nav_${i + 1}_url`]   = navItems[i]?.href  ?? ''
      }
      PAGE_HEROES.forEach(({ key }) => { values[key] = heroUrls[key] ?? '' })
      HEADER_KEYS.forEach(key => { values[key] = headerText[key] ?? '' })

      const result = await saveSiteContent(values)
      if (result?.error) toast.error(result.error)
      else toast.success('Saved! Changes are live on the site.')
    })
  }

  if (!loaded) return <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Loading…</p>

  return (
    <div style={{ maxWidth: 780 }}>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Pages &amp; Navigation</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Manage navbar links, page header text, and hero background images.</p>
        </div>
        <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* ── Navigation Items ── */}
        <div>
          <SectionHeader title="Navigation Items" />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>
            Reorder by editing rows. Delete a row to remove it from the navbar. Up to {MAX_NAV} items.
          </p>

          <div style={{ background: '#181b2e', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="pages-nav-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Label</div>
              <div className="pages-nav-url-header" style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>URL / Path</div>
              <div />
            </div>

            {navItems.map((item, i) => (
              <div key={i} className="pages-nav-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input
                  value={item.label}
                  onChange={e => setNav(i, 'label', e.target.value)}
                  placeholder="Label"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
                <input
                  value={item.href}
                  onChange={e => setNav(i, 'href', e.target.value)}
                  placeholder="/path"
                  style={inp}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                />
                <button
                  type="button"
                  onClick={() => removeNav(i)}
                  title="Remove item"
                  style={{ width: 32, height: 32, background: 'rgba(255,60,60,.08)', border: '1px solid rgba(255,60,60,.15)', color: 'rgba(255,100,100,.7)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  ×
                </button>
              </div>
            ))}

            {navItems.length < MAX_NAV && (
              <button
                type="button"
                onClick={addNav}
                style={{ marginTop: 4, padding: '8px 16px', background: 'rgba(255,255,255,.04)', border: '1.5px dashed rgba(255,255,255,.12)', color: 'rgba(255,255,255,.45)', fontSize: 11, fontWeight: 700, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                + Add Nav Item
              </button>
            )}
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', marginTop: 10 }}>
            The &ldquo;Services&rdquo; desktop dropdown is always shown. Items here appear as links in both desktop and mobile nav.
          </p>
        </div>

        {/* ── Page Header Text ── */}
        <div>
          <SectionHeader title="Page Header Text" />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>
            Edit the tag label, title, and subtitle shown in each page&apos;s header banner. Leave blank to use the default text.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {PAGE_HEADER_TEXT.map(({ page, label, defaults }) => {
              const isOpen = openPage === page
              return (
                <div key={page} style={{ background: '#111320' }}>
                  <button
                    type="button"
                    onClick={() => setOpenPage(isOpen ? null : page)}
                    style={{
                      width: '100%', padding: '14px 20px', background: 'none', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', color: '#fff', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{label}</span>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,.3)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(['tag', 'title', 'subtitle'] as const).map(field => {
                        const key = `page_header_${page}_${field}`
                        return (
                          <div key={field}>
                            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>
                              {field === 'tag' ? 'Tag / Label' : field === 'title' ? 'Page Title (H1)' : 'Subtitle / Description'}
                            </label>
                            <input
                              value={headerText[key] ?? ''}
                              onChange={e => setHeader(key, e.target.value)}
                              placeholder={defaults[field]}
                              style={inp}
                              onFocus={e => (e.target.style.borderColor = '#d42020')}
                              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Page Hero Images ── */}
        <div>
          <SectionHeader title="Page Hero Images" />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 16 }}>
            Upload or paste a URL for the background image shown in each page&apos;s header banner. Leave empty for the default dark colour.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {PAGE_HEROES.map(({ key, label }) => (
              <HeroUploader
                key={key}
                heroKey={key}
                label={label}
                url={heroUrls[key] ?? ''}
                onUrl={url => setHero(key, url)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

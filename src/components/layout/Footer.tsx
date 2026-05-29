import type { ReactNode } from 'react'
import Link from 'next/link'
import NewsletterBar from '@/components/home/NewsletterBar'
import { createClient } from '@/lib/supabase/server'

type SiteContentRow = {
  key: string
  value: string
}

type SocialLinkRow = {
  platform: string
  url: string
}

type EditableLink = {
  labelKey: string
  hrefKey: string
  defaultLabel: string
  defaultHref: string
}

const CONTENT_DEFAULTS: Record<string, string> = {
  footer_brand_name: 'SEEKANT MULTIMEDIA',
  footer_brand_subtitle: 'Design. Print. Brand.',
  footer_tagline: 'Your trusted printing and branding partner — delivering quality across every medium, from a single business card to a full brand identity.',
  footer_quick_links_title: 'Quick Links',
  footer_services_title: 'Our Services',
  footer_contact_title: 'Contact Us',
  footer_all_services_label: 'All 36 Services →',
  footer_all_services_url: '/services',
  footer_copyright: '© 2026 Seekant Multimedia. All rights reserved.',
  footer_privacy_label: 'Privacy Policy',
  footer_privacy_url: '/privacy',
  footer_terms_label: 'Terms of Use',
  footer_terms_url: '/terms',
  footer_quote_label: 'Get a Quote',
  footer_quote_url: '/quote',
  contact_address: 'Asuom, Kwaebibirim Municipal, Eastern Region, Ghana',
  contact_phone: '+233 XX XXX XXXX',
  contact_email: 'info@seekantmultimedia.com',
  contact_hours: 'Mon–Fri: 8am – 6pm  |  Sat: 9am – 4pm',
}

const QUICK_LINKS: EditableLink[] = [
  { labelKey: 'footer_quick_1_label', hrefKey: 'footer_quick_1_url', defaultLabel: 'Home', defaultHref: '/' },
  { labelKey: 'footer_quick_2_label', hrefKey: 'footer_quick_2_url', defaultLabel: 'About Us', defaultHref: '/about' },
  { labelKey: 'footer_quick_3_label', hrefKey: 'footer_quick_3_url', defaultLabel: 'Products', defaultHref: '/products' },
  { labelKey: 'footer_quick_4_label', hrefKey: 'footer_quick_4_url', defaultLabel: 'Our Works', defaultHref: '/works' },
  { labelKey: 'footer_quick_5_label', hrefKey: 'footer_quick_5_url', defaultLabel: 'Gallery', defaultHref: '/gallery' },
  { labelKey: 'footer_quick_6_label', hrefKey: 'footer_quick_6_url', defaultLabel: 'Blog', defaultHref: '/blog' },
  { labelKey: 'footer_quick_7_label', hrefKey: 'footer_quick_7_url', defaultLabel: 'Contacts', defaultHref: '/contacts' },
]

const SERVICE_LINKS: EditableLink[] = [
  { labelKey: 'footer_service_1_label', hrefKey: 'footer_service_1_url', defaultLabel: 'Business Cards', defaultHref: '/services/business-cards' },
  { labelKey: 'footer_service_2_label', hrefKey: 'footer_service_2_url', defaultLabel: 'Large Format Printing', defaultHref: '/services/large-format-printing' },
  { labelKey: 'footer_service_3_label', hrefKey: 'footer_service_3_url', defaultLabel: 'Branding Services', defaultHref: '/services/branding-services' },
  { labelKey: 'footer_service_4_label', hrefKey: 'footer_service_4_url', defaultLabel: 'Vehicle Branding', defaultHref: '/services/vehicle-branding' },
  { labelKey: 'footer_service_5_label', hrefKey: 'footer_service_5_url', defaultLabel: 'Book Printing', defaultHref: '/services/book-printing' },
  { labelKey: 'footer_service_6_label', hrefKey: 'footer_service_6_url', defaultLabel: 'Customized Jerseys', defaultHref: '/services/customized-jerseys' },
]

const SOCIAL_META: Record<string, { label: string; color: string; d: string }> = {
  facebook: {
    label: 'Facebook',
    color: '#1877f2',
    d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  instagram: {
    label: 'Instagram',
    color: '#e1306c',
    d: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.2A4.8 4.8 0 1016.8 12 4.8 4.8 0 0012 7.2zm0 7.9A3.1 3.1 0 1115.1 12 3.1 3.1 0 0112 15.1zM17.2 6.6a1.1 1.1 0 101.1 1.1 1.1 1.1 0 00-1.1-1.1z',
  },
  twitter: {
    label: 'Twitter / X',
    color: '#fff',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  whatsapp: {
    label: 'WhatsApp',
    color: '#25d366',
    d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  },
  youtube: {
    label: 'YouTube',
    color: '#ff0000',
    d: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45a2.78 2.78 0 00-1.95 1.97A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
  tiktok: {
    label: 'TikTok',
    color: '#fff',
    d: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z',
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0a66c2',
    d: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.38 4.27 5.47zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56z',
  },
}

function getContentValue(content: Record<string, string>, key: string) {
  return content[key]?.trim() || CONTENT_DEFAULTS[key] || ''
}

function normalizeHref(input: string | null | undefined) {
  const value = input?.trim() ?? ''
  if (!value) return ''
  if (value.startsWith('/') || value.startsWith('#')) return value
  if (/^(mailto:|tel:|sms:)/i.test(value)) return value

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:|sms:)/i.test(href)
}

function editableLinks(content: Record<string, string>, links: EditableLink[]) {
  return links
    .map(link => ({
      label: content[link.labelKey]?.trim() || link.defaultLabel,
      href: normalizeHref(content[link.hrefKey] || link.defaultHref),
    }))
    .filter(link => link.label && link.href)
}

function FooterTextLink({ href, children, className = 'footer-link', newTab = false }: { href: string; children: ReactNode; className?: string; newTab?: boolean }) {
  const normalizedHref = normalizeHref(href)
  if (!normalizedHref) return null

  if (isExternalHref(normalizedHref) || newTab) {
    return (
      <a href={normalizedHref} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={normalizedHref} className={className}>
      {children}
    </Link>
  )
}

export default async function Footer() {
  const supabase = await createClient()

  const [{ data: contentRows }, { data: socialRows }] = await Promise.all([
    supabase.from('site_content').select('key,value'),
    supabase.from('social_links').select('platform,url'),
  ])

  const content = {
    ...CONTENT_DEFAULTS,
    ...Object.fromEntries(((contentRows ?? []) as SiteContentRow[]).map(row => [row.key, row.value])),
  }
  const socialMap = Object.fromEntries(((socialRows ?? []) as SocialLinkRow[]).map(row => [row.platform, row.url]))
  const quickLinks = editableLinks(content, QUICK_LINKS)
  const serviceLinks = editableLinks(content, SERVICE_LINKS)
  const socialLinks = Object.entries(SOCIAL_META)
    .map(([platform, meta]) => ({ ...meta, href: normalizeHref(socialMap[platform]) }))
    .filter(link => link.href)

  const contactItems = [
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: getContentValue(content, 'contact_address') },
    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: getContentValue(content, 'contact_phone') },
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: getContentValue(content, 'contact_email') },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: getContentValue(content, 'contact_hours') },
  ]

  return (
    <footer style={{ background: 'var(--brand-dark, #15212c)', color: 'rgba(255,255,255,.6)', fontFamily: 'Poppins, sans-serif' }}>
      <div className="footer-grid" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18, textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Seekant Multimedia" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: '#fff', flexShrink: 0 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.15 }}>
              {getContentValue(content, 'footer_brand_name')}
              <small style={{ display: 'block', fontSize: 10, fontWeight: 400, color: 'var(--brand-gold, #d42020)', letterSpacing: '0.12em' }}>{getContentValue(content, 'footer_brand_subtitle')}</small>
            </div>
          </Link>
          <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 24, color: 'rgba(255,255,255,.5)' }}>
            {getContentValue(content, 'footer_tagline')}
          </p>
          {socialLinks.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {socialLinks.map(({ label, href, color, d }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="footer-social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>{getContentValue(content, 'footer_quick_links_title')}</h4>
          <div style={{ width: 32, height: 2, background: 'var(--brand-gold, #d42020)', marginBottom: 18 }} />
          {quickLinks.map(link => (
            <FooterTextLink key={`${link.label}-${link.href}`} href={link.href}>{link.label}</FooterTextLink>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>{getContentValue(content, 'footer_services_title')}</h4>
          <div style={{ width: 32, height: 2, background: 'var(--brand-gold, #d42020)', marginBottom: 18 }} />
          {serviceLinks.map(link => (
            <FooterTextLink key={`${link.label}-${link.href}`} href={link.href}>{link.label}</FooterTextLink>
          ))}
          <FooterTextLink href={getContentValue(content, 'footer_all_services_url')} className="footer-accent-link">
            {getContentValue(content, 'footer_all_services_label')}
          </FooterTextLink>
        </div>

        <div>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>{getContentValue(content, 'footer_contact_title')}</h4>
          <div style={{ width: 32, height: 2, background: 'var(--brand-gold, #d42020)', marginBottom: 18 }} />
          {contactItems.map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-gold, #d42020)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                <path d={icon} />
              </svg>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <NewsletterBar />

      <div className="footer-btm">
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>{getContentValue(content, 'footer_copyright')}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <FooterTextLink href={getContentValue(content, 'footer_privacy_url')} className="footer-bottom-link" newTab>
            {getContentValue(content, 'footer_privacy_label')}
          </FooterTextLink>
          <FooterTextLink href={getContentValue(content, 'footer_terms_url')} className="footer-bottom-link" newTab>
            {getContentValue(content, 'footer_terms_label')}
          </FooterTextLink>
          <FooterTextLink href={getContentValue(content, 'footer_quote_url')} className="footer-bottom-link">
            {getContentValue(content, 'footer_quote_label')}
          </FooterTextLink>
          <Link href="/admin/login" title="Staff Login" className="footer-admin-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.33.07-.67.07-1.08s-.03-.74-.07-1.08l2.32-1.81c.21-.16.27-.45.13-.68l-2.2-3.82c-.13-.23-.42-.3-.65-.23l-2.73 1.1c-.57-.44-1.18-.79-1.85-1.07l-.42-2.9C14.22 2.18 13.96 2 13.68 2h-3.36c-.28 0-.54.18-.58.44l-.42 2.9c-.67.28-1.27.63-1.85 1.07l-2.73-1.1c-.24-.1-.52 0-.65.23L2.39 9.36c-.14.23-.08.52.13.68l2.32 1.81C4.8 12.26 4.77 12.6 4.77 13s.03.74.07 1.08l-2.32 1.81c-.21.16-.27.45-.13.68l2.2 3.82c.13.23.42.3.65.23l2.73-1.1c.57.44 1.18.79 1.85 1.07l.42 2.9c.04.26.3.44.58.44h3.36c.28 0 .54-.18.58-.44l.42-2.9c.67-.28 1.27-.63 1.85-1.07l2.73 1.1c.24.1.52 0 .65-.23l2.2-3.82c.14-.23.08-.52-.13-.68l-2.32-1.81z"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}

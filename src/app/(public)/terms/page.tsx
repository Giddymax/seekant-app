import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms of Use – Seekant Multimedia' }

const DEFAULT_CONTENT = `Welcome to Seekant Multimedia. By accessing or using our services, you agree to be bound by these Terms of Use.

1. SERVICES
Seekant Multimedia provides printing, branding, and design services. All orders are subject to acceptance and availability.

2. ORDERS & PAYMENT
All prices are quoted in Ghana Cedis (GH₵). Payment is required before production begins unless a prior credit arrangement has been agreed in writing.

3. ARTWORK & FILES
You are responsible for ensuring all artwork supplied is print-ready and that you have the rights to use all content. Seekant Multimedia accepts no liability for copyright infringement arising from client-supplied files.

4. TURNAROUND & DELIVERY
Turnaround times quoted are estimates and begin only after artwork approval and payment confirmation. We are not liable for delays caused by circumstances beyond our control.

5. RETURNS & REPRINTS
Due to the custom nature of our products, we do not accept returns unless there is a verified production error on our part. Claims must be made within 48 hours of delivery with supporting evidence.

6. LIMITATION OF LIABILITY
Our liability is limited to the value of the order placed. We are not liable for indirect, consequential, or incidental losses.

7. GOVERNING LAW
These terms are governed by the laws of the Republic of Ghana.

8. CONTACT
For any queries regarding these Terms, please contact us at info@seekantmultimedia.com.`

export default async function TermsPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', ['terms_title', 'terms_content', 'terms_last_updated'])

  const map = Object.fromEntries((rows ?? []).map((r: { key: string; value: string }) => [r.key, r.value]))
  const title = map.terms_title?.trim() || 'Terms of Use'
  const content = map.terms_content?.trim() || DEFAULT_CONTENT
  const lastUpdated = map.terms_last_updated?.trim() || ''

  return (
    <>
      <div style={{ marginTop: 68, background: '#15212c', padding: '72px 0 56px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(212,32,32,.12),rgba(21,33,44,0))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#d42020' }}>{title}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 12 }}>{title}</h1>
          {lastUpdated && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      <section style={{ padding: '56px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ background: '#fff', padding: '48px', boxShadow: '0 4px 24px rgba(0,0,0,.06)', borderTop: '3px solid #d42020' }}>
            <div style={{
              fontFamily: 'var(--brand-font, Poppins, sans-serif)',
              fontSize: 14,
              lineHeight: 1.9,
              color: 'var(--brand-text, #4b5563)',
              whiteSpace: 'pre-wrap',
            }}>
              {content}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

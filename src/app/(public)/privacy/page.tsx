import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy – Seekant Multimedia' }

const DEFAULT_CONTENT = `Seekant Multimedia ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.

1. INFORMATION WE COLLECT
We collect information you provide directly, including your name, email address, phone number, and project details when you request a quote or contact us. We may also collect payment information when processing transactions.

2. HOW WE USE YOUR INFORMATION
We use your information to:
- Process and fulfil your orders
- Communicate with you about your projects
- Send order confirmations and invoices
- Improve our services
- Comply with legal obligations

3. DATA SHARING
We do not sell or rent your personal information to third parties. We may share data with trusted service providers (e.g. payment processors, email services) solely to deliver our services. All third parties are required to protect your data.

4. DATA RETENTION
We retain your information for as long as necessary to fulfil the purposes described in this policy, or as required by law.

5. COOKIES
Our website may use cookies to improve your browsing experience. You can disable cookies in your browser settings; however, some features may not function correctly.

6. YOUR RIGHTS
You have the right to access, correct, or request deletion of your personal data. To exercise these rights, please contact us at info@seekantmultimedia.com.

7. SECURITY
We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse.

8. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. The most recent version will always be available on our website.

9. CONTACT
If you have any questions about this policy, please contact us at:
Seekant Multimedia, Asuom, Eastern Region, Ghana
Email: info@seekantmultimedia.com`

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', ['privacy_title', 'privacy_content', 'privacy_last_updated'])

  const map = Object.fromEntries((rows ?? []).map((r: { key: string; value: string }) => [r.key, r.value]))
  const title = map.privacy_title?.trim() || 'Privacy Policy'
  const content = map.privacy_content?.trim() || DEFAULT_CONTENT
  const lastUpdated = map.privacy_last_updated?.trim() || ''

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

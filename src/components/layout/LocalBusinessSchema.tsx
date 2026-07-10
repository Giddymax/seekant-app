import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'

const DEFAULTS = {
  footer_brand_name: 'SEEKANT MULTIMEDIA',
  contact_address: 'Asuom, Kwaebibirim Municipal, Eastern Region, Ghana',
  contact_phone: '+233 XX XXX XXXX',
  contact_email: 'info@seekantmultimedia.com',
}

export default async function LocalBusinessSchema() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key,value')
    .in('key', Object.keys(DEFAULTS))

  const content = { ...DEFAULTS, ...Object.fromEntries((data ?? []).map(row => [row.key, row.value])) }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: content.footer_brand_name,
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: content.contact_phone,
    email: content.contact_email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: content.contact_address,
      addressRegion: 'Eastern Region',
      addressCountry: 'GH',
    },
    description: 'Professional printing, branding, and design services in Asuom, Eastern Region, Ghana.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

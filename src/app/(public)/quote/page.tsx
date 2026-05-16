import { createClient } from '@/lib/supabase/server'
import QuoteForm from '@/components/public/QuoteForm'

export const metadata = { title: 'Get a Quote – Seekant Multimedia' }

export default async function QuotePage() {
  const supabase = await createClient()
  const { data: rows } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', ['contact_whatsapp', 'contact_phone'])

  const map = Object.fromEntries(
    (rows ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  )
  const whatsappNumber = (map.contact_whatsapp || map.contact_phone || '') as string

  return <QuoteForm whatsappNumber={whatsappNumber} />
}

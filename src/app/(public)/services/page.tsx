import { createClient } from '@/lib/supabase/server'
import ServicesClientPage from '@/components/public/ServicesClientPage'

export const metadata = { title: 'Our Services – Seekant Multimedia' }

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order')

  return <ServicesClientPage services={services ?? []} />
}

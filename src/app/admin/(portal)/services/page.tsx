import { createClient } from '@/lib/supabase/server'
import ServicesManager from '@/components/admin/ServicesManager'

export const metadata = { title: 'Services – Seekant Admin' }

export default async function ServicesAdminPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  return <ServicesManager initialServices={services ?? []} />
}

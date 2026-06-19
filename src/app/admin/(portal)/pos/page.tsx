import { createClient } from '@/lib/supabase/server'
import PosClient from '@/components/admin/PosClient'

export const metadata = { title: 'Point of Sale – Seekant Admin' }

export default async function PosPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: { user } }, { data: phoneRow }] = await Promise.all([
    supabase.from('inventory')
      .select('id, name, category, image_url, price, cost_price, stock, is_service')
      .or('stock.gt.0,is_service.eq.true')
      .order('name', { ascending: true }),
    supabase.auth.getUser(),
    supabase.from('site_content').select('value').eq('key', 'contact_phone').single(),
  ])

  const contactPhone = (phoneRow as { value: string } | null)?.value || ''

  let staffName = user?.email ?? 'Staff'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()
    staffName = profile?.full_name || profile?.email || staffName
  }

  return <PosClient products={products ?? []} staffName={staffName} contactPhone={contactPhone} />
}

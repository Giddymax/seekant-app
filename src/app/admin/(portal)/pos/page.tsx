import { createClient } from '@/lib/supabase/server'
import PosClient from '@/components/admin/PosClient'

export const metadata = { title: 'Point of Sale – Seekant Admin' }

export default async function PosPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: { user } }] = await Promise.all([
    supabase.from('inventory')
      .select('id, name, category, image_url, price, stock, is_service')
      .or('stock.gt.0,is_service.eq.true')
      .order('name', { ascending: true }),
    supabase.auth.getUser(),
  ])

  let staffName = user?.email ?? 'Staff'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()
    staffName = profile?.full_name || profile?.email || staffName
  }

  return <PosClient products={products ?? []} staffName={staffName} />
}

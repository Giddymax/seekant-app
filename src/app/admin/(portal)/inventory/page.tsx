import { createClient } from '@/lib/supabase/server'
import InventoryManager from '@/components/admin/InventoryManager'

export const metadata = { title: 'Inventory – Seekant Admin' }

export default async function InventoryPage() {
  const supabase = await createClient()
  const [{ data: items }, { data: { user } }] = await Promise.all([
    supabase
      .from('inventory')
      .select('id, name, category, image_url, price, cost_price, stock, threshold, is_service')
      .order('is_service', { ascending: true })
      .order('name', { ascending: true }),
    supabase.auth.getUser(),
  ])

  let role = 'staff'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? 'staff'
  }

  return <InventoryManager initialItems={items ?? []} role={role} />
}

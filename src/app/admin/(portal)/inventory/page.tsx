import { createClient } from '@/lib/supabase/server'
import InventoryManager from '@/components/admin/InventoryManager'

export const metadata = { title: 'Inventory – Seekant Admin' }

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('inventory')
    .select('id, name, category, image_url, price, stock, threshold, is_service')
    .order('is_service', { ascending: true })
    .order('name', { ascending: true })

  return <InventoryManager initialItems={items ?? []} />
}

import { createClient } from '@/lib/supabase/server'
import InventoryManager from '@/components/admin/InventoryManager'

export const metadata = { title: 'Inventory – Seekant Admin' }

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('inventory')
    .select('*')
    .order('name', { ascending: true })

  return <InventoryManager initialItems={items ?? []} />
}

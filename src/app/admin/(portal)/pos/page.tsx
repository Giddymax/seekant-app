import { createClient } from '@/lib/supabase/server'
import PosClient from '@/components/admin/PosClient'

export const metadata = { title: 'Point of Sale – Seekant Admin' }

export default async function PosPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('inventory')
    .select('id, name, category, image_url, price, stock, is_service')
    .or('stock.gt.0,is_service.eq.true')
    .order('name', { ascending: true })

  return <PosClient products={products ?? []} />
}

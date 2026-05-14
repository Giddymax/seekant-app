import { createClient } from '@/lib/supabase/server'
import SalesClient from '@/components/admin/SalesClient'

export const metadata = { title: 'Sales – Seekant Admin' }

export default async function SalesPage() {
  const supabase = await createClient()
  const { data: sales } = await supabase
    .from('sales')
    .select('id, sale_ref, customer_name, total, payment_method, status, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  return <SalesClient initialSales={sales ?? []} />
}

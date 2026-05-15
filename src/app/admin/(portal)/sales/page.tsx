import { createClient } from '@/lib/supabase/server'
import SalesClient from '@/components/admin/SalesClient'

export const metadata = { title: 'Sales – Seekant Admin' }

export default async function SalesPage() {
  const supabase = await createClient()

  const [{ data: { user } }, { data: sales }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('sales')
      .select('id, sale_ref, customer_name, customer_phone, total, discount, amount_paid, payment_method, status, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
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

  return <SalesClient initialSales={sales ?? []} role={role} />
}

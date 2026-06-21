import { createClient } from '@/lib/supabase/server'
import SalesClient from '@/components/admin/SalesClient'

export const metadata = { title: 'Sales – Seekant Admin' }

export default async function SalesPage() {
  const supabase = await createClient()

  const [{ data: { user } }, { data: sales }, { data: phoneRow }, { data: profiles }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('sales')
      .select('id, sale_ref, customer_name, customer_phone, total, discount, amount_paid, payment_method, status, notes, staff_id, created_at')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('site_content').select('value').eq('key', 'contact_phone').single(),
    supabase.from('profiles').select('id, full_name'),
  ])

  const contactPhone = (phoneRow as { value: string } | null)?.value || ''

  const staffNames: Record<string, string> = {}
  for (const p of profiles ?? []) {
    if (p.full_name) staffNames[p.id] = p.full_name
  }

  let role = 'staff'
  if (user) {
    role = staffNames[user.id] ? 'admin' : 'staff'
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? 'staff'
  }

  return <SalesClient initialSales={sales ?? []} role={role} contactPhone={contactPhone} staffNames={staffNames} />
}

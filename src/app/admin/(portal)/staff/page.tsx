import { createClient } from '@/lib/supabase/server'
import StaffManager from '@/components/admin/StaffManager'

export const metadata = { title: 'Staff – Seekant Admin' }

export default async function StaffPage() {
  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id,email,role,full_name,active,created_at')
    .order('created_at', { ascending: false })

  return <StaffManager initialStaff={profiles ?? []} />
}

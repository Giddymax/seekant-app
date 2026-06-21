import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    redirect('/admin/login')
  }

  if (!user) redirect('/admin/login')

  let role = 'staff'
  let displayName = user.email ?? ''
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? 'staff'
    displayName = profile?.full_name || profile?.email || user.email || ''
  } catch {
    // profile fetch failed — continue with defaults
  }

  return (
    <AdminShell role={role} email={displayName}>
      {children}
    </AdminShell>
  )
}

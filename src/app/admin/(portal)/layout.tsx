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
  let email = user.email ?? ''
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()
    role = profile?.role ?? 'staff'
    email = profile?.email ?? user.email ?? ''
  } catch {
    // profile fetch failed — continue with defaults
  }

  return (
    <AdminShell role={role} email={email}>
      {children}
    </AdminShell>
  )
}

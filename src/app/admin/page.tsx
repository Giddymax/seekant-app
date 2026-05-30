import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminRootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  redirect(profile?.role === 'admin' ? '/admin/dashboard' : '/admin/pos')
}

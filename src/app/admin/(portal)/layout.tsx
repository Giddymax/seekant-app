import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/pos': 'Point of Sale',
  '/admin/sales': 'Sales',
  '/admin/inventory': 'Inventory',
  '/admin/analytics': 'Analytics',
  '/admin/content': 'Site Content',
  '/admin/hero': 'Hero Slides',
  '/admin/services': 'Services',
  '/admin/blog': 'Blog',
  '/admin/social': 'Social Links',
  '/admin/theme': 'Theme',
  '/admin/staff': 'Staff Accounts',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'staff'
  const email = profile?.email ?? user.email ?? ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0f18', fontFamily: 'Poppins,sans-serif' }}>
      <AdminSidebar role={role} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
        <AdminTopbar title="Admin" role={role} email={email} />
        <main style={{ flex: 1, padding: '28px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

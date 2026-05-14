import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Dashboard – Seekant Admin' }

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalSales },
    { data: revenueData },
    { count: pendingQuotes },
    { count: lowStock },
    { data: recentSales },
    { data: monthlySales },
  ] = await Promise.all([
    supabase.from('sales').select('*', { count: 'exact', head: true }),
    supabase.from('sales').select('total').eq('status', 'Completed'),
    supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('inventory').select('*', { count: 'exact', head: true }).lt('stock', 10),
    supabase.from('sales').select('id, sale_ref, total, status, created_at').order('created_at', { ascending: false }).limit(8),
    supabase.from('sales').select('created_at, total').eq('status', 'Completed').gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  const totalRevenue = (revenueData ?? []).reduce((sum, s) => sum + (s.total ?? 0), 0)

  // Build 6-month bar chart data
  const months: string[] = []
  const monthTotals: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('default', { month: 'short' })
    months.push(label)
    monthTotals[key] = 0
  }
  ;(monthlySales ?? []).forEach(s => {
    const key = s.created_at.slice(0, 7)
    if (key in monthTotals) monthTotals[key] += s.total ?? 0
  })
  const barValues = Object.values(monthTotals)
  const maxBar = Math.max(...barValues, 1)

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#ddb837', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 13v-1m0 0c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Sales', value: String(totalSales ?? 0), color: '#54b9fd', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Pending Quotes', value: String(pendingQuotes ?? 0), color: '#fd4682', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Low Stock Items', value: String(lowStock ?? 0), color: '#315c5a', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ]

  const statusColor: Record<string, string> = {
    Completed: '#22c55e',
    Pending: '#ddb837',
    Cancelled: '#fd4682',
  }

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
        {statCards.map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: '#181b2e', padding: '24px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{value}</p>
              </div>
              <div style={{ width: 38, height: 38, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>
        {/* Revenue bar chart */}
        <div style={{ background: '#181b2e', padding: '28px 28px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Revenue — Last 6 Months</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 160 }}>
            {months.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', letterSpacing: '0.04em' }}>{formatCurrency(barValues[i]).replace('GH₵', '')}</div>
                <div style={{ width: '100%', background: `rgba(221,184,55,${0.15 + 0.85 * barValues[i] / maxBar})`, height: `${Math.max(4, (barValues[i] / maxBar) * 120)}px`, transition: 'height .3s' }} />
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ background: '#181b2e', padding: '28px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Quick Actions</h2>
          {[
            { href: '/admin/pos', label: 'New Sale', color: '#ddb837' },
            { href: '/admin/blog', label: 'Write Article', color: '#54b9fd' },
            { href: '/admin/services', label: 'Manage Services', color: '#fd4682' },
            { href: '/admin/inventory', label: 'Update Stock', color: '#315c5a' },
            { href: '/admin/content', label: 'Edit Site Content', color: '#ddb837' },
          ].map(({ href, label, color }) => (
            <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: 12, fontWeight: 500, transition: 'color .15s' }}>
              <span>{label}</span>
              <span style={{ color }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent sales */}
      <div style={{ background: '#181b2e', padding: '28px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Recent Sales</h2>
          <Link href="/admin/sales" style={{ fontSize: 11, color: '#ddb837', textDecoration: 'none' }}>View All →</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Ref', 'Amount', 'Status', 'Date'].map(h => (
                <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '0 12px 12px 0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(recentSales ?? []).map(s => (
              <tr key={s.id} style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#ddb837', fontWeight: 600 }}>{s.sale_ref}</td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#fff' }}>{formatCurrency(s.total)}</td>
                <td style={{ padding: '12px 12px 12px 0' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', letterSpacing: '0.06em', textTransform: 'uppercase', color: statusColor[s.status] ?? '#aaa', background: `${statusColor[s.status] ?? '#aaa'}18` }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '12px 12px 12px 0', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!recentSales?.length && (
              <tr><td colSpan={4} style={{ padding: '24px 0', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No sales yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

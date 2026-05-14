import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

export const metadata = { title: 'Analytics – Seekant Admin' }

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    { data: salesData },
    { data: quoteData },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from('sales').select('total, status, payment_method, created_at').order('created_at', { ascending: false }),
    supabase.from('quote_requests').select('status, service_type, created_at').order('created_at', { ascending: false }),
    supabase.from('sale_items').select('product_name, quantity, unit_price'),
  ])

  const completed = (salesData ?? []).filter(s => s.status === 'Completed')
  const totalRevenue = completed.reduce((sum, s) => sum + (s.total ?? 0), 0)
  const avgOrderValue = completed.length ? totalRevenue / completed.length : 0

  // Payment breakdown
  const paymentMap: Record<string, number> = {}
  completed.forEach(s => {
    paymentMap[s.payment_method] = (paymentMap[s.payment_method] ?? 0) + 1
  })

  // Quote status breakdown
  const quoteStatusMap: Record<string, number> = {}
  ;(quoteData ?? []).forEach(q => {
    quoteStatusMap[q.status] = (quoteStatusMap[q.status] ?? 0) + 1
  })

  // Top services from quotes
  const serviceMap: Record<string, number> = {}
  ;(quoteData ?? []).forEach(q => {
    if (q.service_type) serviceMap[q.service_type] = (serviceMap[q.service_type] ?? 0) + 1
  })
  const topServices = Object.entries(serviceMap).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxServiceCount = Math.max(...topServices.map(s => s[1]), 1)

  // Top products from sales
  const productMap: Record<string, { qty: number; revenue: number }> = {}
  ;(topProducts ?? []).forEach(item => {
    if (!productMap[item.product_name]) productMap[item.product_name] = { qty: 0, revenue: 0 }
    productMap[item.product_name].qty += item.quantity ?? 0
    productMap[item.product_name].revenue += (item.unit_price ?? 0) * (item.quantity ?? 0)
  })
  const topProductsList = Object.entries(productMap).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5)

  // Monthly revenue (last 12 months)
  const monthLabels: string[] = []
  const monthRevenue: Record<string, number> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthLabels.push(d.toLocaleString('default', { month: 'short' }))
    monthRevenue[key] = 0
  }
  completed.forEach(s => {
    const key = s.created_at.slice(0, 7)
    if (key in monthRevenue) monthRevenue[key] += s.total ?? 0
  })
  const monthValues = Object.values(monthRevenue)
  const maxMonth = Math.max(...monthValues, 1)

  const card = { background: '#181b2e', padding: '24px 24px', position: 'relative' as const, overflow: 'hidden' as const }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Sales performance and quote insights.</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#ddb837' },
          { label: 'Completed Sales', value: String(completed.length), color: '#22c55e' },
          { label: 'Avg. Order Value', value: formatCurrency(avgOrderValue), color: '#54b9fd' },
          { label: 'Total Quotes', value: String(quoteData?.length ?? 0), color: '#fd4682' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...card }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Monthly Revenue (12 months)</h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
          {monthLabels.map((m, i) => (
            <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,.3)' }}>{formatCurrency(monthValues[i]).replace('GH₵', '₵')}</div>
              <div style={{ width: '100%', background: `rgba(221,184,55,${0.15 + 0.85 * monthValues[i] / maxMonth})`, height: `${Math.max(3, (monthValues[i] / maxMonth) * 100)}px` }} />
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>{m}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Payment methods */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Payment Methods</h2>
          {Object.entries(paymentMap).map(([method, count]) => (
            <div key={method} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{method}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{count}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,.06)', height: 4 }}>
                <div style={{ background: '#ddb837', height: '100%', width: `${(count / completed.length) * 100}%` }} />
              </div>
            </div>
          ))}
          {!Object.keys(paymentMap).length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>No data yet.</p>}
        </div>

        {/* Quote status */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Quote Requests</h2>
          {Object.entries(quoteStatusMap).map(([status, count]) => {
            const colors: Record<string, string> = { new: '#ddb837', contacted: '#54b9fd', converted: '#22c55e', closed: '#aaa' }
            const total = quoteData?.length ?? 1
            return (
              <div key={status} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: colors[status] ?? 'rgba(255,255,255,.6)', fontWeight: 600 }}>{status}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{count}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,.06)', height: 4 }}>
                  <div style={{ background: colors[status] ?? '#aaa', height: '100%', width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            )
          })}
          {!Object.keys(quoteStatusMap).length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>No quotes yet.</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Top quoted services */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Most Quoted Services</h2>
          {topServices.map(([service, count]) => (
            <div key={service} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{service}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{count}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,.06)', height: 4 }}>
                <div style={{ background: '#54b9fd', height: '100%', width: `${(count / maxServiceCount) * 100}%` }} />
              </div>
            </div>
          ))}
          {!topServices.length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>No quote data yet.</p>}
        </div>

        {/* Top products by revenue */}
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Top Products by Revenue</h2>
          {topProductsList.map(([name, { qty, revenue }]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
              <div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>Qty sold: {qty}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ddb837' }}>{formatCurrency(revenue)}</span>
            </div>
          ))}
          {!topProductsList.length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>No sales data yet.</p>}
        </div>
      </div>
    </div>
  )
}

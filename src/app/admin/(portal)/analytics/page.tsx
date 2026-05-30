import type { CSSProperties } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, toNumber } from '@/lib/utils'

export const metadata = { title: 'Analytics - Seekant Admin' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

type SaleRow = {
  id: string
  total: number | string | null
  status: string | null
  payment_method: string | null
  created_at: string | null
}

type SaleItemRow = {
  product_name: string | null
  quantity: number | string | null
  unit_price: number | string | null
  line_total: number | string | null
}

type QuoteRow = {
  status: string | null
  service_type: string | null
  created_at: string | null
}

type ChartPoint = {
  label: string
  value: number
}

const SALES_STATUSES = ['Completed', 'Pending', 'Part-Payment', 'Cancelled']
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card']
const QUOTE_STATUSES = ['new', 'reviewed', 'quoted', 'completed', 'cancelled']

const card: CSSProperties = { background: '#181b2e', padding: 24, position: 'relative', overflow: 'hidden' }
const input: CSSProperties = {
  width: '100%',
  minHeight: 40,
  background: '#111320',
  border: '1px solid rgba(255,255,255,.1)',
  color: '#fff',
  padding: '9px 10px',
  fontSize: 12,
  fontFamily: 'Poppins,sans-serif',
}

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 29)
  return { start: dateInputValue(start), end: dateInputValue(end) }
}

function getRange(params: Record<string, string | string[] | undefined>) {
  const defaults = getDefaultRange()
  const start = getParam(params, 'start') || defaults.start
  const end = getParam(params, 'end') || defaults.end
  return start <= end ? { start, end } : { start: end, end: start }
}

function startIso(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toISOString()
}

function endIso(date: string) {
  return new Date(`${date}T23:59:59.999Z`).toISOString()
}

function percent(value: number, total: number) {
  if (!total) return 0
  return Math.max(0, Math.min(100, (value / total) * 100))
}

function groupRevenueByPeriod(sales: SaleRow[], start: string, end: string): ChartPoint[] {
  const startDate = new Date(`${start}T00:00:00.000Z`)
  const endDate = new Date(`${end}T00:00:00.000Z`)
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1)
  const useMonths = days > 62
  const buckets: Record<string, ChartPoint> = {}

  if (useMonths) {
    const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1))
    const last = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1))
    while (cursor <= last) {
      const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`
      buckets[key] = { label: cursor.toLocaleString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' }), value: 0 }
      cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    }
  } else {
    const cursor = new Date(startDate)
    while (cursor <= endDate) {
      const key = dateInputValue(cursor)
      buckets[key] = { label: cursor.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' }), value: 0 }
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
  }

  sales.forEach(sale => {
    const rawDate = String(sale.created_at ?? '')
    const key = useMonths ? rawDate.slice(0, 7) : rawDate.slice(0, 10)
    if (key in buckets) buckets[key].value += toNumber(sale.total)
  })

  return Object.values(buckets)
}

function buildCountMap(values: Array<string | null>) {
  return values.reduce<Record<string, number>>((map, value) => {
    const key = value || 'Unknown'
    map[key] = (map[key] ?? 0) + 1
    return map
  }, {})
}

function buildProductMap(items: SaleItemRow[]) {
  const map: Record<string, { qty: number; revenue: number }> = {}
  items.forEach(item => {
    const name = item.product_name || 'Unnamed item'
    const quantity = toNumber(item.quantity)
    const revenue = toNumber(item.line_total) || toNumber(item.unit_price) * quantity
    if (!map[name]) map[name] = { qty: 0, revenue: 0 }
    map[name].qty += quantity
    map[name].revenue += revenue
  })
  return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 8)
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{children}</label>
}

function RevenueAreaChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.map(point => point.value), 1)
  const width = 760
  const height = 240
  const chartTop = 24
  const chartHeight = 154
  const chartLeft = 36
  const chartWidth = width - 72
  const points = data.map((point, index) => {
    const x = chartLeft + (data.length <= 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth)
    const y = chartTop + chartHeight - (point.value / max) * chartHeight
    return { ...point, x, y }
  })
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ')
  const areaPath = points.length
    ? `${linePath} L${points[points.length - 1].x},${chartTop + chartHeight} L${points[0].x},${chartTop + chartHeight} Z`
    : ''

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue trend chart" style={{ width: '100%', height: 260, display: 'block' }}>
      {[0, 1, 2, 3].map(i => {
        const y = chartTop + (i / 3) * chartHeight
        return <line key={i} x1={chartLeft} x2={width - chartLeft} y1={y} y2={y} stroke="rgba(255,255,255,.07)" />
      })}
      {areaPath && <path d={areaPath} fill="rgba(212,32,32,.18)" />}
      {linePath && <path d={linePath} fill="none" stroke="#d42020" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {points.map((point, index) => (
        <circle key={`${point.label}-${index}`} cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#d42020" strokeWidth="2" />
      ))}
      {points.map((point, index) => {
        if (index !== 0 && index !== points.length - 1 && index % Math.ceil(points.length / 6) !== 0) return null
        return (
          <text key={`${point.label}-label`} x={point.x} y={height - 24} textAnchor="middle" fill="rgba(255,255,255,.45)" fontSize="11">
            {point.label}
          </text>
        )
      })}
    </svg>
  )
}

function HorizontalBars({ data, color = '#54b9fd', valueType = 'count' }: { data: Array<[string, number]>; color?: string; valueType?: 'count' | 'money' }) {
  const max = Math.max(...data.map(([, value]) => value), 1)
  if (!data.length) return <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>No data for this filter.</p>

  return (
    <div>
      {data.map(([label, value]) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{valueType === 'money' ? formatCurrency(value) : value}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,.07)', overflow: 'hidden' }}>
            <div style={{ width: `${percent(value, max)}%`, height: '100%', background: color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data }: { data: Array<[string, number]> }) {
  const total = data.reduce((sum, [, value]) => sum + value, 0)
  const colors = ['#d42020', '#54b9fd', '#22c55e', '#fd4682', '#f97316', '#ddb837']
  let cursor = 0
  const stops = total
    ? data.map(([, value], index) => {
        const start = cursor
        const end = cursor + (value / total) * 100
        cursor = end
        return `${colors[index % colors.length]} ${start}% ${end}%`
      }).join(', ')
    : 'rgba(255,255,255,.08) 0% 100%'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px minmax(0,1fr)', gap: 20, alignItems: 'center' }}>
      <div style={{ width: 150, height: 150, borderRadius: '50%', background: `conic-gradient(${stops})`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 34, borderRadius: '50%', background: '#181b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 800 }}>{total}</div>
      </div>
      <div>
        {data.map(([label, value], index) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, color: '#fff', fontSize: 12 }}>
              <span style={{ width: 9, height: 9, background: colors[index % colors.length], flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            </span>
            <strong style={{ color: '#fff', fontSize: 12 }}>{value}</strong>
          </div>
        ))}
        {!data.length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>No data for this filter.</p>}
      </div>
    </div>
  )
}

export default async function AnalyticsPage({ searchParams }: { searchParams?: SearchParams }) {
  const supabase = await createClient()
  const params = await (searchParams ?? Promise.resolve({}))
  const { start, end } = getRange(params)
  const salesStatus = getParam(params, 'sales_status') || 'all'
  const paymentMethod = getParam(params, 'payment_method') || 'all'
  const quoteStatus = getParam(params, 'quote_status') || 'all'
  const serviceType = getParam(params, 'service_type') || 'all'

  let salesQuery = supabase
    .from('sales')
    .select('id,total,status,payment_method,created_at')
    .gte('created_at', startIso(start))
    .lte('created_at', endIso(end))
    .order('created_at', { ascending: true })
  if (salesStatus !== 'all') salesQuery = salesQuery.eq('status', salesStatus)
  if (paymentMethod !== 'all') salesQuery = salesQuery.eq('payment_method', paymentMethod)

  let quotesQuery = supabase
    .from('quote_requests')
    .select('status,service_type,created_at')
    .gte('created_at', startIso(start))
    .lte('created_at', endIso(end))
    .order('created_at', { ascending: true })
  if (quoteStatus !== 'all') quotesQuery = quotesQuery.eq('status', quoteStatus)
  if (serviceType !== 'all') quotesQuery = quotesQuery.eq('service_type', serviceType)

  const [{ data: salesRows }, { data: quoteRows }, { data: serviceRows }] = await Promise.all([
    salesQuery,
    quotesQuery,
    supabase.from('quote_requests').select('service_type').not('service_type', 'is', null).order('service_type'),
  ])

  const salesData = (salesRows ?? []) as SaleRow[]
  const quoteData = (quoteRows ?? []) as QuoteRow[]
  const saleIds = salesData.map(sale => sale.id).filter(Boolean)
  const { data: itemRows } = saleIds.length
    ? await supabase.from('sale_items').select('product_name,quantity,unit_price,line_total').in('sale_id', saleIds)
    : { data: [] as SaleItemRow[] }
  const topProductsList = buildProductMap((itemRows ?? []) as SaleItemRow[])

  const completed = salesData.filter(s => s.status === 'Completed')
  const totalRevenue = completed.reduce((sum, s) => sum + toNumber(s.total), 0)
  const avgOrderValue = completed.length ? totalRevenue / completed.length : 0
  const paymentMap = buildCountMap(completed.map(s => s.payment_method))
  const salesStatusMap = buildCountMap(salesData.map(s => s.status))
  const quoteStatusMap = buildCountMap(quoteData.map(q => q.status))
  const serviceMap = buildCountMap(quoteData.map(q => q.service_type))
  const serviceOptions = Array.from(new Set(((serviceRows ?? []) as Array<{ service_type: string | null }>).map(row => row.service_type).filter(Boolean) as string[]))
  const trendData = groupRevenueByPeriod(completed, start, end)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>Filter sales and quote activity, then review revenue, demand, and payment trends.</p>
      </div>

      <form action="/admin/analytics" style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, alignItems: 'end' }}>
          <div>
            <FilterLabel>Start date</FilterLabel>
            <input type="date" name="start" required defaultValue={start} style={input} />
          </div>
          <div>
            <FilterLabel>End date</FilterLabel>
            <input type="date" name="end" required defaultValue={end} style={input} />
          </div>
          <div>
            <FilterLabel>Sale status</FilterLabel>
            <select name="sales_status" defaultValue={salesStatus} style={input}>
              <option value="all">All statuses</option>
              {SALES_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <FilterLabel>Payment</FilterLabel>
            <select name="payment_method" defaultValue={paymentMethod} style={input}>
              <option value="all">All methods</option>
              {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
            </select>
          </div>
          <div>
            <FilterLabel>Quote status</FilterLabel>
            <select name="quote_status" defaultValue={quoteStatus} style={input}>
              <option value="all">All quote statuses</option>
              {QUOTE_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div>
            <FilterLabel>Service quoted</FilterLabel>
            <select name="service_type" defaultValue={serviceType} style={input}>
              <option value="all">All services</option>
              {serviceOptions.map(service => <option key={service} value={service}>{service}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-gold" style={{ minHeight: 40, fontSize: 11, padding: '12px 18px' }}>Apply Filters</button>
          <Link href="/admin/analytics" style={{ minHeight: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.07)', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reset</Link>
        </div>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#d42020' },
          { label: 'Completed Sales', value: String(completed.length), color: '#22c55e' },
          { label: 'Avg. Order Value', value: formatCurrency(avgOrderValue), color: '#54b9fd' },
          { label: 'Quote Requests', value: String(quoteData.length), color: '#fd4682' },
        ].map(({ label, value, color }) => (
          <div key={label} style={card}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
            <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 18 }}>Revenue Trend</h2>
        <RevenueAreaChart data={trendData} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 24 }}>
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Payment Methods</h2>
          <DonutChart data={Object.entries(paymentMap)} />
        </div>
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Sales by Status</h2>
          <HorizontalBars data={Object.entries(salesStatusMap)} color="#d42020" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Quote Status</h2>
          <HorizontalBars data={Object.entries(quoteStatusMap)} color="#fd4682" />
        </div>
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Most Quoted Services</h2>
          <HorizontalBars data={Object.entries(serviceMap).sort((a, b) => b[1] - a[1]).slice(0, 8)} color="#54b9fd" />
        </div>
        <div style={card}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Top Products by Revenue</h2>
          <HorizontalBars data={topProductsList.map(([name, stats]) => [name, stats.revenue])} color="#22c55e" valueType="money" />
        </div>
      </div>
    </div>
  )
}

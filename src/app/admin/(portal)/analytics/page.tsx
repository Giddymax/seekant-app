import type { CSSProperties } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, toNumber } from '@/lib/utils'

export const metadata = { title: 'Analytics - Seekant Admin' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

type SaleRow = {
  id: string
  total: number | string | null
  discount: number | string | null
  amount_paid: number | string | null
  status: string | null
  payment_method: string | null
  customer_name: string | null
  staff_id: string | null
  created_at: string | null
}

type SaleItemRow = {
  product_name: string | null
  quantity: number | string | null
  unit_price: number | string | null
  cost_price: number | string | null
  line_total: number | string | null
}

type QuoteRow = {
  status: string | null
  service_type: string | null
  created_at: string | null
}

type InventoryRow = {
  name: string
  category: string
  stock: number
  price: number | string | null
  cost_price: number | string | null
  threshold: number
  is_service: boolean
}

type StaffRow = {
  id: string
  full_name: string | null
  email: string
}

type ComplaintRow = {
  status: string
  created_at: string | null
}

type ChartPoint = { label: string; value: number }

const SALES_STATUSES = ['Completed', 'Pending', 'Part-Payment', 'Cancelled']
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card']
const QUOTE_STATUSES = ['new', 'reviewed', 'quoted', 'completed', 'cancelled']

const card: CSSProperties = { background: '#181b2e', padding: 24, position: 'relative', overflow: 'hidden' }
const input: CSSProperties = {
  width: '100%', minHeight: 40, background: '#111320',
  border: '1px solid rgba(255,255,255,.1)', color: '#fff',
  padding: '9px 10px', fontSize: 12, fontFamily: 'Poppins,sans-serif',
}

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function dateInputValue(date: Date) { return date.toISOString().slice(0, 10) }

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

function startIso(date: string) { return new Date(`${date}T00:00:00.000Z`).toISOString() }
function endIso(date: string) { return new Date(`${date}T23:59:59.999Z`).toISOString() }

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
  const map: Record<string, { qty: number; revenue: number; cost: number }> = {}
  items.forEach(item => {
    const name = item.product_name || 'Unnamed item'
    const quantity = toNumber(item.quantity)
    const revenue = toNumber(item.line_total) || toNumber(item.unit_price) * quantity
    const cost = toNumber(item.cost_price) * quantity
    if (!map[name]) map[name] = { qty: 0, revenue: 0, cost: 0 }
    map[name].qty += quantity
    map[name].revenue += revenue
    map[name].cost += cost
  })
  return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue)
}

function buildDayOfWeekMap(sales: SaleRow[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = Array(7).fill(0) as number[]
  sales.forEach(s => {
    if (s.created_at) counts[new Date(s.created_at).getUTCDay()]++
  })
  return days.map((d, i) => [d, counts[i]] as [string, number])
}

function buildHourMap(sales: SaleRow[]) {
  const counts = Array(24).fill(0) as number[]
  sales.forEach(s => {
    if (s.created_at) counts[new Date(s.created_at).getUTCHours()]++
  })
  const peaks: [string, number][] = []
  for (let i = 0; i < 24; i += 3) {
    const sum = counts[i] + counts[i + 1] + (counts[i + 2] ?? 0)
    const label = `${String(i).padStart(2, '0')}:00–${String(i + 3).padStart(2, '0')}:00`
    peaks.push([label, sum])
  }
  return peaks
}

function buildCustomerMap(sales: SaleRow[]) {
  const map: Record<string, { count: number; revenue: number }> = {}
  sales.forEach(s => {
    const name = s.customer_name || 'Walk-in'
    if (!map[name]) map[name] = { count: 0, revenue: 0 }
    map[name].count++
    map[name].revenue += toNumber(s.total)
  })
  return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue)
}

function buildCategoryMap(items: SaleItemRow[], inventory: InventoryRow[]) {
  const nameToCategory: Record<string, string> = {}
  inventory.forEach(i => { nameToCategory[i.name] = i.category })
  const map: Record<string, number> = {}
  items.forEach(item => {
    const cat = nameToCategory[item.product_name ?? ''] || 'Other'
    map[cat] = (map[cat] ?? 0) + toNumber(item.line_total)
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

// ─── Chart Components ─────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{children}</label>
}

function RevenueAreaChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.map(p => p.value), 1)
  const width = 760, height = 240, chartTop = 24, chartHeight = 154, chartLeft = 36
  const chartWidth = width - 72
  const points = data.map((p, i) => ({
    ...p,
    x: chartLeft + (data.length <= 1 ? chartWidth / 2 : (i / (data.length - 1)) * chartWidth),
    y: chartTop + chartHeight - (p.value / max) * chartHeight,
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = points.length
    ? `${linePath} L${points[points.length - 1].x},${chartTop + chartHeight} L${points[0].x},${chartTop + chartHeight} Z` : ''

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue trend chart" style={{ width: '100%', height: 260, display: 'block' }}>
      {[0, 1, 2, 3].map(i => <line key={i} x1={chartLeft} x2={width - chartLeft} y1={chartTop + (i / 3) * chartHeight} y2={chartTop + (i / 3) * chartHeight} stroke="rgba(255,255,255,.07)" />)}
      {areaPath && <path d={areaPath} fill="rgba(212,32,32,.18)" />}
      {linePath && <path d={linePath} fill="none" stroke="#d42020" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      {points.map((p, i) => <circle key={`c${i}`} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#d42020" strokeWidth="2" />)}
      {points.map((p, i) => {
        if (i !== 0 && i !== points.length - 1 && i % Math.ceil(points.length / 6) !== 0) return null
        return <text key={`l${i}`} x={p.x} y={height - 24} textAnchor="middle" fill="rgba(255,255,255,.45)" fontSize="11">{p.label}</text>
      })}
    </svg>
  )
}

function HorizontalBars({ data, color = '#54b9fd', valueType = 'count' }: { data: Array<[string, number]>; color?: string; valueType?: 'count' | 'money' }) {
  const max = Math.max(...data.map(([, v]) => v), 1)
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
  const total = data.reduce((sum, [, v]) => sum + v, 0)
  const colors = ['#d42020', '#54b9fd', '#22c55e', '#fd4682', '#f97316', '#ddb837']
  let cur = 0
  const stops = total
    ? data.map(([, v], i) => { const s = cur; cur += (v / total) * 100; return `${colors[i % colors.length]} ${s}% ${cur}%` }).join(', ')
    : 'rgba(255,255,255,.08) 0% 100%'
  return (
    <div className="analytics-donut-grid" style={{ display: 'grid', gridTemplateColumns: '150px minmax(0,1fr)', gap: 20, alignItems: 'center' }}>
      <div style={{ width: 150, height: 150, borderRadius: '50%', background: `conic-gradient(${stops})`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 34, borderRadius: '50%', background: '#181b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 800 }}>{total}</div>
      </div>
      <div>
        {data.map(([label, value], i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, color: '#fff', fontSize: 12 }}>
              <span style={{ width: 9, height: 9, background: colors[i % colors.length], flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            </span>
            <strong style={{ color: '#fff', fontSize: 12 }}>{value}</strong>
          </div>
        ))}
        {!data.length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>No data.</p>}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={card}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
      <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{value}</p>
      {sub && <p style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, marginTop: 32 }}>
      <h2 style={{ fontSize: 11, fontWeight: 800, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, flexShrink: 0 }}>{children}</h2>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage({ searchParams }: { searchParams?: SearchParams }) {
  const supabase = await createClient()
  const params = await (searchParams ?? Promise.resolve({}))
  const { start, end } = getRange(params)
  const salesStatus = getParam(params, 'sales_status') || 'all'
  const paymentMethod = getParam(params, 'payment_method') || 'all'
  const quoteStatus = getParam(params, 'quote_status') || 'all'
  const serviceType = getParam(params, 'service_type') || 'all'

  // Previous period for comparison
  const startDate = new Date(`${start}T00:00:00.000Z`)
  const endDate = new Date(`${end}T00:00:00.000Z`)
  const periodDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1)
  const prevEnd = new Date(startDate)
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1)
  const prevStart = new Date(prevEnd)
  prevStart.setUTCDate(prevStart.getUTCDate() - periodDays + 1)

  let salesQuery = supabase
    .from('sales')
    .select('id,total,discount,amount_paid,status,payment_method,customer_name,staff_id,created_at')
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

  const [
    { data: salesRows },
    { data: quoteRows },
    { data: serviceRows },
    { data: prevSalesRows },
    { data: inventoryRows },
    { data: staffRows },
    { data: complaintRows },
  ] = await Promise.all([
    salesQuery,
    quotesQuery,
    supabase.from('quote_requests').select('service_type').not('service_type', 'is', null).order('service_type'),
    supabase.from('sales').select('total,status,created_at').gte('created_at', startIso(dateInputValue(prevStart))).lte('created_at', endIso(dateInputValue(prevEnd))),
    supabase.from('inventory').select('name,category,stock,price,cost_price,threshold,is_service'),
    supabase.from('profiles').select('id,full_name,email').eq('role', 'staff').eq('active', true),
    supabase.from('complaints').select('status,created_at').gte('created_at', startIso(start)).lte('created_at', endIso(end)),
  ])

  const salesData = (salesRows ?? []) as SaleRow[]
  const quoteData = (quoteRows ?? []) as QuoteRow[]
  const prevSalesData = (prevSalesRows ?? []) as SaleRow[]
  const inventory = (inventoryRows ?? []) as InventoryRow[]
  const staff = (staffRows ?? []) as StaffRow[]
  const complaints = (complaintRows ?? []) as ComplaintRow[]

  const saleIds = salesData.map(s => s.id).filter(Boolean)
  const { data: itemRows } = saleIds.length
    ? await supabase.from('sale_items').select('product_name,quantity,unit_price,cost_price,line_total').in('sale_id', saleIds)
    : { data: [] as SaleItemRow[] }
  const allItems = (itemRows ?? []) as SaleItemRow[]

  // ─── Core metrics ───────────────────────────────────────────────────────────
  const completed = salesData.filter(s => s.status === 'Completed')
  const pending = salesData.filter(s => s.status === 'Pending')
  const partPayments = salesData.filter(s => s.status === 'Part-Payment')
  const cancelled = salesData.filter(s => s.status === 'Cancelled')

  const totalRevenue = completed.reduce((sum, s) => sum + toNumber(s.total), 0)
  const totalCost = allItems.reduce((sum, i) => sum + toNumber(i.cost_price) * toNumber(i.quantity), 0)
  const totalProfit = totalRevenue - totalCost
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
  const avgOrderValue = completed.length ? totalRevenue / completed.length : 0
  const totalDiscount = salesData.reduce((sum, s) => sum + toNumber(s.discount), 0)
  const outstanding = partPayments.reduce((sum, s) => sum + Math.max(0, toNumber(s.total) - toNumber(s.amount_paid)), 0)
  const totalCollected = salesData.reduce((sum, s) => sum + toNumber(s.amount_paid), 0)

  // ─── Previous period comparison ─────────────────────────────────────────────
  const prevCompleted = prevSalesData.filter(s => s.status === 'Completed')
  const prevRevenue = prevCompleted.reduce((sum, s) => sum + toNumber(s.total), 0)
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : totalRevenue > 0 ? 100 : 0
  const salesChange = prevCompleted.length > 0 ? ((completed.length - prevCompleted.length) / prevCompleted.length) * 100 : completed.length > 0 ? 100 : 0

  // ─── Breakdowns ─────────────────────────────────────────────────────────────
  const paymentMap = buildCountMap(completed.map(s => s.payment_method))
  const salesStatusMap = buildCountMap(salesData.map(s => s.status))
  const quoteStatusMap = buildCountMap(quoteData.map(q => q.status))
  const serviceMap = buildCountMap(quoteData.map(q => q.service_type))
  const serviceOptions = Array.from(new Set(((serviceRows ?? []) as Array<{ service_type: string | null }>).map(r => r.service_type).filter(Boolean) as string[]))
  const trendData = groupRevenueByPeriod(completed, start, end)

  const productData = buildProductMap(allItems)
  const topByRevenue = productData.slice(0, 10)
  const topByQty = [...productData].sort((a, b) => b[1].qty - a[1].qty).slice(0, 10)
  const dayOfWeekData = buildDayOfWeekMap(salesData)
  const hourData = buildHourMap(salesData)
  const customerData = buildCustomerMap(completed)
  const topCustomers = customerData.filter(([name]) => name !== 'Walk-in').slice(0, 10)
  const walkInCount = customerData.find(([name]) => name === 'Walk-in')?.[1].count ?? 0
  const namedCustomerCount = completed.length - walkInCount
  const categoryData = buildCategoryMap(allItems, inventory)

  // ─── Quotes conversion ─────────────────────────────────────────────────────
  const quotesCompleted = quoteData.filter(q => q.status === 'completed').length
  const quoteConversion = quoteData.length > 0 ? (quotesCompleted / quoteData.length) * 100 : 0

  // ─── Inventory health ──────────────────────────────────────────────────────
  const physicalItems = inventory.filter(i => !i.is_service)
  const lowStockItems = physicalItems.filter(i => i.stock <= i.threshold)
  const outOfStockItems = physicalItems.filter(i => i.stock === 0)
  const totalStockValue = physicalItems.reduce((sum, i) => sum + i.stock * toNumber(i.cost_price), 0)
  const totalRetailValue = physicalItems.reduce((sum, i) => sum + i.stock * toNumber(i.price), 0)

  // ─── Staff performance ─────────────────────────────────────────────────────
  const staffMap: Record<string, { name: string; count: number; revenue: number }> = {}
  staff.forEach(s => { staffMap[s.id] = { name: s.full_name || s.email, count: 0, revenue: 0 } })
  completed.forEach(s => {
    if (s.staff_id && staffMap[s.staff_id]) {
      staffMap[s.staff_id].count++
      staffMap[s.staff_id].revenue += toNumber(s.total)
    }
  })
  const staffPerformance = Object.values(staffMap).filter(s => s.count > 0).sort((a, b) => b.revenue - a.revenue)

  // ─── Complaints ────────────────────────────────────────────────────────────
  const complaintStatusMap = buildCountMap(complaints.map(c => c.status))
  const newComplaints = complaintStatusMap['New'] ?? 0

  const changeIcon = (val: number) => val > 0 ? '↑' : val < 0 ? '↓' : '→'
  const changeColor = (val: number) => val > 0 ? '#22c55e' : val < 0 ? '#fd4682' : 'rgba(255,255,255,.4)'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>Comprehensive business intelligence for {start} to {end}.</p>
      </div>

      {/* ── Filters ── */}
      <form action="/admin/analytics" style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, alignItems: 'end' }}>
          <div><FilterLabel>Start date</FilterLabel><input type="date" name="start" required defaultValue={start} style={input} /></div>
          <div><FilterLabel>End date</FilterLabel><input type="date" name="end" required defaultValue={end} style={input} /></div>
          <div><FilterLabel>Sale status</FilterLabel>
            <select name="sales_status" defaultValue={salesStatus} style={input}>
              <option value="all">All statuses</option>
              {SALES_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><FilterLabel>Payment</FilterLabel>
            <select name="payment_method" defaultValue={paymentMethod} style={input}>
              <option value="all">All methods</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div><FilterLabel>Quote status</FilterLabel>
            <select name="quote_status" defaultValue={quoteStatus} style={input}>
              <option value="all">All</option>
              {QUOTE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><FilterLabel>Service</FilterLabel>
            <select name="service_type" defaultValue={serviceType} style={input}>
              <option value="all">All services</option>
              {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-gold" style={{ minHeight: 40, fontSize: 11, padding: '12px 18px' }}>Apply</button>
          <Link href="/admin/analytics" style={{ minHeight: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.07)', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reset</Link>
        </div>
      </form>

      {/* ── Revenue & Profit KPIs ── */}
      <SectionTitle>Revenue &amp; Profit</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 8 }}>
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} sub={`${changeIcon(revenueChange)} ${Math.abs(revenueChange).toFixed(1)}% vs prev period`} color="#d42020" />
        <StatCard label="Total Profit" value={formatCurrency(totalProfit)} sub={`${profitMargin.toFixed(1)}% margin`} color={totalProfit >= 0 ? '#22c55e' : '#fd4682'} />
        <StatCard label="Total Cost" value={formatCurrency(totalCost)} color="#f97316" />
        <StatCard label="Discounts Given" value={formatCurrency(totalDiscount)} color="#ddb837" />
        <StatCard label="Amount Collected" value={formatCurrency(totalCollected)} color="#54b9fd" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} sub={`${partPayments.length} part-payment${partPayments.length !== 1 ? 's' : ''}`} color="#f97316" />
      </div>

      {/* ── Sales KPIs ── */}
      <SectionTitle>Sales Performance</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 8 }}>
        <StatCard label="Completed Sales" value={String(completed.length)} sub={`${changeIcon(salesChange)} ${Math.abs(salesChange).toFixed(1)}% vs prev period`} color="#22c55e" />
        <StatCard label="Pending" value={String(pending.length)} color="#d42020" />
        <StatCard label="Part-Payments" value={String(partPayments.length)} color="#f97316" />
        <StatCard label="Cancelled" value={String(cancelled.length)} color="#fd4682" />
        <StatCard label="Avg. Order Value" value={formatCurrency(avgOrderValue)} color="#54b9fd" />
        <StatCard label="Total Transactions" value={String(salesData.length)} color="#ddb837" />
      </div>

      {/* ── Revenue Trend ── */}
      <SectionTitle>Revenue Trend</SectionTitle>
      <div style={{ ...card, marginBottom: 8 }}>
        <RevenueAreaChart data={trendData} />
      </div>

      {/* ── Sales Breakdown ── */}
      <SectionTitle>Sales Breakdown</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 8 }}>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Payment Methods</h3>
          <DonutChart data={Object.entries(paymentMap)} />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Sales by Status</h3>
          <HorizontalBars data={Object.entries(salesStatusMap)} color="#d42020" />
        </div>
      </div>

      {/* ── Busiest Times ── */}
      <SectionTitle>Busiest Times</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 8 }}>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Sales by Day of Week</h3>
          <HorizontalBars data={dayOfWeekData} color="#ddb837" />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Sales by Time of Day</h3>
          <HorizontalBars data={hourData} color="#54b9fd" />
        </div>
      </div>

      {/* ── Products ── */}
      <SectionTitle>Products &amp; Categories</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 8 }}>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Top Products by Revenue</h3>
          <HorizontalBars data={topByRevenue.map(([name, s]) => [name, s.revenue])} color="#22c55e" valueType="money" />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Top Products by Quantity</h3>
          <HorizontalBars data={topByQty.map(([name, s]) => [name, s.qty])} color="#54b9fd" />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Revenue by Category</h3>
          <DonutChart data={categoryData} />
        </div>
      </div>

      {/* ── Product Profitability ── */}
      {topByRevenue.length > 0 && (
        <>
          <SectionTitle>Product Profitability</SectionTitle>
          <div style={{ ...card, marginBottom: 8, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Product', 'Qty', 'Revenue', 'Cost', 'Profit', 'Margin'].map(h => (
                    <th key={h} style={{ textAlign: 'left', color: 'rgba(255,255,255,.4)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 12px 0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topByRevenue.map(([name, stats]) => {
                  const profit = stats.revenue - stats.cost
                  const margin = stats.revenue > 0 ? (profit / stats.revenue) * 100 : 0
                  const color = profit > 0 ? '#22c55e' : profit < 0 ? '#fd4682' : 'rgba(255,255,255,.4)'
                  return (
                    <tr key={name} style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: '#fff' }}>{name}</td>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: '#fff' }}>{stats.qty}</td>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: '#fff', fontWeight: 700 }}>{formatCurrency(stats.revenue)}</td>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{formatCurrency(stats.cost)}</td>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color, fontWeight: 700 }}>{formatCurrency(profit)}</td>
                      <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color, fontWeight: 700 }}>{margin.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Customers ── */}
      <SectionTitle>Customers</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <StatCard label="Named Customers" value={String(namedCustomerCount)} color="#54b9fd" />
          <StatCard label="Walk-in Sales" value={String(walkInCount)} color="rgba(255,255,255,.25)" />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Top Customers by Revenue</h3>
          {topCustomers.length > 0 ? (
            <HorizontalBars data={topCustomers.map(([name, s]) => [name, s.revenue])} color="#d42020" valueType="money" />
          ) : (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>No named customers in this period.</p>
          )}
        </div>
      </div>

      {/* ── Staff Performance ── */}
      {staffPerformance.length > 0 && (
        <>
          <SectionTitle>Staff Performance</SectionTitle>
          <div style={{ ...card, marginBottom: 8, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Staff', 'Sales', 'Revenue', 'Avg. Sale'].map(h => (
                    <th key={h} style={{ textAlign: 'left', color: 'rgba(255,255,255,.4)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 12px 0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map(s => (
                  <tr key={s.name} style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                    <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: '#fff', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: '#fff' }}>{s.count}</td>
                    <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: '#d42020', fontWeight: 700 }}>{formatCurrency(s.revenue)}</td>
                    <td style={{ padding: '10px 12px 10px 0', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{formatCurrency(s.count > 0 ? s.revenue / s.count : 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Quotes ── */}
      <SectionTitle>Quotes &amp; Demand</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 14 }}>
        <StatCard label="Quote Requests" value={String(quoteData.length)} color="#fd4682" />
        <StatCard label="Quotes Completed" value={String(quotesCompleted)} color="#22c55e" />
        <StatCard label="Conversion Rate" value={`${quoteConversion.toFixed(1)}%`} color="#54b9fd" />
        <StatCard label="Complaints" value={String(complaints.length)} sub={newComplaints > 0 ? `${newComplaints} new` : undefined} color={newComplaints > 0 ? '#fd4682' : '#315c5a'} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 8 }}>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Quote Status</h3>
          <HorizontalBars data={Object.entries(quoteStatusMap)} color="#fd4682" />
        </div>
        <div style={card}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Most Quoted Services</h3>
          <HorizontalBars data={Object.entries(serviceMap).sort((a, b) => b[1] - a[1]).slice(0, 8)} color="#54b9fd" />
        </div>
      </div>

      {/* ── Inventory Health ── */}
      <SectionTitle>Inventory Health</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 14 }}>
        <StatCard label="Total Items" value={String(physicalItems.length)} color="#315c5a" />
        <StatCard label="Low Stock" value={String(lowStockItems.length)} color={lowStockItems.length > 0 ? '#f97316' : '#22c55e'} />
        <StatCard label="Out of Stock" value={String(outOfStockItems.length)} color={outOfStockItems.length > 0 ? '#fd4682' : '#22c55e'} />
        <StatCard label="Stock Value (Cost)" value={formatCurrency(totalStockValue)} color="#54b9fd" />
        <StatCard label="Stock Value (Retail)" value={formatCurrency(totalRetailValue)} color="#ddb837" />
        <StatCard label="Potential Profit" value={formatCurrency(totalRetailValue - totalStockValue)} color="#22c55e" />
      </div>
      {lowStockItems.length > 0 && (
        <div style={{ ...card, marginBottom: 8 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f97316', marginBottom: 16 }}>Low Stock Alert</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {lowStockItems.slice(0, 12).map(item => (
              <div key={item.name} style={{ padding: '10px 14px', background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.15)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: item.stock === 0 ? '#fd4682' : '#f97316', fontWeight: 700 }}>
                  {item.stock === 0 ? 'OUT OF STOCK' : `${item.stock} left (threshold: ${item.threshold})`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PrintButton from '@/components/admin/PrintButton'
import { formatCurrency, toNumber } from '@/lib/utils'

export const metadata = { title: 'Business Summary - Seekant Admin' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

type SaleRow = {
  id: string
  sale_ref: string | null
  customer_name: string | null
  customer_phone: string | null
  total: number | string | null
  amount_paid: number | string | null
  discount: number | string | null
  status: string | null
  payment_method: string | null
  created_at: string | null
}

type SaleItemRow = {
  product_name: string | null
  quantity: number | string | null
  line_total: number | string | null
  unit_price: number | string | null
  cost_price: number | string | null
}

type QuoteRow = {
  status: string | null
  service_type: string | null
  created_at: string | null
}

const SALES_STATUSES = ['Completed', 'Pending', 'Part-Payment', 'Cancelled']
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card']

const card: CSSProperties = { background: '#181b2e', padding: 24, overflow: 'hidden' }
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
    const qty = toNumber(item.quantity)
    const revenue = toNumber(item.line_total) || toNumber(item.unit_price) * qty
    const cost = toNumber(item.cost_price) * qty
    if (!map[name]) map[name] = { qty: 0, revenue: 0, cost: 0 }
    map[name].qty += qty
    map[name].revenue += revenue
    map[name].cost += cost
  })
  return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue)
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{children}</label>
}

function StatusTable({ title, rows }: { title: string; rows: Array<[string, number]> }) {
  return (
    <div style={card}>
      <h2 style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 16 }}>{title}</h2>
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
          <span style={{ fontSize: 12, color: '#fff' }}>{label}</span>
          <strong style={{ fontSize: 12, color: '#fff' }}>{value}</strong>
        </div>
      ))}
      {!rows.length && <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>No data for this filter.</p>}
    </div>
  )
}

export default async function BusinessSummaryPage({ searchParams }: { searchParams?: SearchParams }) {
  const supabase = await createClient()
  const params = await (searchParams ?? Promise.resolve({}))
  const { start, end } = getRange(params)
  const salesStatus = getParam(params, 'sales_status') || 'all'
  const paymentMethod = getParam(params, 'payment_method') || 'all'

  let salesQuery = supabase
    .from('sales')
    .select('id,sale_ref,customer_name,customer_phone,total,amount_paid,discount,status,payment_method,created_at')
    .gte('created_at', startIso(start))
    .lte('created_at', endIso(end))
    .order('created_at', { ascending: false })
  if (salesStatus !== 'all') salesQuery = salesQuery.eq('status', salesStatus)
  if (paymentMethod !== 'all') salesQuery = salesQuery.eq('payment_method', paymentMethod)

  const [{ data: salesRows }, { data: quoteRows }] = await Promise.all([
    salesQuery,
    supabase
      .from('quote_requests')
      .select('status,service_type,created_at')
      .gte('created_at', startIso(start))
      .lte('created_at', endIso(end))
      .order('created_at', { ascending: false }),
  ])

  const sales = (salesRows ?? []) as SaleRow[]
  const quotes = (quoteRows ?? []) as QuoteRow[]
  const saleIds = sales.map(sale => sale.id).filter(Boolean)
  const { data: itemRows } = saleIds.length
    ? await supabase.from('sale_items').select('product_name,quantity,line_total,unit_price,cost_price').in('sale_id', saleIds)
    : { data: [] as SaleItemRow[] }

  const completed = sales.filter(sale => sale.status === 'Completed')
  const partPayments = sales.filter(sale => sale.status === 'Part-Payment')
  const totalRevenue = completed.reduce((sum, sale) => sum + toNumber(sale.total), 0)
  const totalDiscounts = sales.reduce((sum, sale) => sum + toNumber(sale.discount), 0)
  const amountPaid = sales.reduce((sum, sale) => sum + toNumber(sale.amount_paid), 0)
  const outstanding = sales.reduce((sum, sale) => sum + Math.max(0, toNumber(sale.total) - toNumber(sale.amount_paid)), 0)
  const allItems = (itemRows ?? []) as SaleItemRow[]
  const totalCost = allItems.reduce((sum, i) => sum + toNumber(i.cost_price) * toNumber(i.quantity), 0)
  const totalProfit = totalRevenue - totalCost
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
  const avgOrderValue = completed.length ? totalRevenue / completed.length : 0
  const quoteCompletion = quotes.length ? (quotes.filter(q => q.status === 'completed').length / quotes.length) * 100 : 0
  const paymentRows = Object.entries(buildCountMap(completed.map(s => s.payment_method))).sort((a, b) => b[1] - a[1])
  const quoteRowsByStatus = Object.entries(buildCountMap(quotes.map(q => q.status))).sort((a, b) => b[1] - a[1])
  const productRows = buildProductMap((itemRows ?? []) as SaleItemRow[]).slice(0, 10)
  const bestProduct = productRows[0]
  const bestPayment = paymentRows[0]
  const recentSales = sales.slice(0, 12)

  const insights = [
    `Revenue for the selected period is ${formatCurrency(totalRevenue)} from ${completed.length} completed sale${completed.length === 1 ? '' : 's'}.`,
    `Average completed order value is ${formatCurrency(avgOrderValue)}.`,
    outstanding > 0
      ? `Outstanding balance is ${formatCurrency(outstanding)} across ${partPayments.length} part-payment sale${partPayments.length === 1 ? '' : 's'}.`
      : 'There are no outstanding balances in the selected period.',
    bestProduct
      ? `${bestProduct[0]} is the highest revenue product/service at ${formatCurrency(bestProduct[1].revenue)}.`
      : 'No product or service sales were recorded in the selected period.',
    bestPayment
      ? `${bestPayment[0]} is the most used completed-sale payment method.`
      : 'No completed-sale payment method data is available for this period.',
    `Quote completion rate is ${quoteCompletion.toFixed(1)}% for ${quotes.length} quote request${quotes.length === 1 ? '' : 's'}.`,
    totalCost > 0
      ? `${totalProfit >= 0 ? 'Profit' : 'Loss'} for the period is ${formatCurrency(Math.abs(totalProfit))} (${profitMargin.toFixed(1)}% margin on completed sales revenue).`
      : 'No cost price data is recorded yet — set cost prices in Inventory to track profit.',
  ]

  return (
    <div>
      <style>{`
        @media print {
          body { background: #fff !important; }
          .admin-sidebar,
          .admin-sidebar-overlay,
          header,
          .admin-print-hide { display: none !important; }
          .admin-shell-outer {
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }
          .admin-content-col {
            overflow: visible !important;
          }
          .admin-main-padding {
            padding: 0 !important;
            overflow: visible !important;
          }
          .business-summary-report {
            background: #fff !important;
            color: #000 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .business-summary-report * {
            color: #000 !important;
            background: transparent !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
          .business-summary-logo {
            background: #fff !important;
            border: 1px solid #ddd !important;
          }
          .business-summary-report section,
          .business-summary-report table,
          .business-summary-report .print-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page { margin: 12mm; size: A4 portrait; }
        }
      `}</style>

      <div className="admin-print-hide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Business Summary</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>Filter and print business insights for meetings, accounting, or management review.</p>
        </div>
        <PrintButton />
      </div>

      <form action="/admin/summary" className="admin-print-hide" style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, alignItems: 'end' }}>
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
          <button type="submit" className="btn btn-gold" style={{ minHeight: 40, fontSize: 11, padding: '12px 18px' }}>Apply Filters</button>
          <Link href="/admin/summary" style={{ minHeight: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.07)', color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reset</Link>
        </div>
      </form>

      <article className="business-summary-report" style={{ background: '#0d0f18' }}>
        <section style={{ ...card, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
              <div className="business-summary-logo" style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Seekant Multimedia" style={{ width: 58, height: 58, objectFit: 'contain', display: 'block' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 10, color: '#d42020', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8 }}>Seekant Multimedia</p>
                <h2 style={{ fontSize: 24, color: '#fff', fontWeight: 900, marginBottom: 6 }}>Business Insights Summary</h2>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>Period: {start} to {end}</p>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', textAlign: 'right' }}>Generated {new Date().toLocaleDateString('en-GB')}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
            {[
              ['Revenue', formatCurrency(totalRevenue), ''],
              ['Profit / Loss', formatCurrency(totalProfit), totalProfit >= 0 ? '#22c55e' : '#fd4682'],
              ['Completed Sales', String(completed.length), ''],
              ['Amount Paid', formatCurrency(amountPaid), ''],
              ['Outstanding', formatCurrency(outstanding), ''],
              ['Discounts', formatCurrency(totalDiscounts), ''],
              ['Quotes', String(quotes.length), ''],
            ].map(([label, value, accent]) => (
              <div key={label} className="print-card" style={{ background: '#111320', padding: 16 }}>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7, fontWeight: 800 }}>{label}</p>
                <p style={{ fontSize: 17, color: accent || '#fff', fontWeight: 900 }}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...card, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, color: '#fff', fontWeight: 900, marginBottom: 16 }}>Management Notes</h2>
          <ol style={{ listStyle: 'decimal', paddingLeft: 20, color: '#fff' }}>
            {insights.map(note => <li key={note} style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>{note}</li>)}
          </ol>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, marginBottom: 24 }}>
          <StatusTable title="Payment Mix" rows={paymentRows} />
          <StatusTable title="Quote Status" rows={quoteRowsByStatus} />
        </div>

        <section style={{ ...card, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, color: '#fff', fontWeight: 900, marginBottom: 16 }}>Top Products And Services</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Qty', 'Revenue', 'Profit'].map(h => <th key={h} style={{ textAlign: 'left', color: 'rgba(255,255,255,.45)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 10px 0' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {productRows.map(([name, stats]) => {
                  const profit = stats.revenue - stats.cost
                  const color = profit > 0 ? '#22c55e' : profit < 0 ? '#fd4682' : '#fff'
                  return (
                    <tr key={name} style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                      <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{name}</td>
                      <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{stats.qty}</td>
                      <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0', fontWeight: 800 }}>{formatCurrency(stats.revenue)}</td>
                      <td style={{ color, fontSize: 12, padding: '10px 12px 10px 0', fontWeight: 800 }}>{formatCurrency(profit)}</td>
                    </tr>
                  )
                })}
                {!productRows.length && <tr><td colSpan={4} style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, padding: '18px 0' }}>No product data for this filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 15, color: '#fff', fontWeight: 900, marginBottom: 16 }}>Recent Sales In Filter</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Ref', 'Customer', 'Total', 'Paid', 'Status', 'Payment', 'Date'].map(h => <th key={h} style={{ textAlign: 'left', color: 'rgba(255,255,255,.45)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px 10px 0' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {recentSales.map(sale => (
                  <tr key={sale.id} style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{sale.sale_ref}</td>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{sale.customer_name || 'Walk-in'}</td>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{formatCurrency(sale.total)}</td>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{formatCurrency(sale.amount_paid)}</td>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{sale.status}</td>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{sale.payment_method}</td>
                    <td style={{ color: '#fff', fontSize: 12, padding: '10px 12px 10px 0' }}>{sale.created_at ? new Date(sale.created_at).toLocaleDateString('en-GB') : '-'}</td>
                  </tr>
                ))}
                {!recentSales.length && <tr><td colSpan={7} style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, padding: '18px 0' }}>No sales for this filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateSaleStatus, updateSale, getSaleItems } from '@/lib/actions/sales'
import { formatCurrency } from '@/lib/utils'

type Sale = {
  id: string
  sale_ref: string
  customer_name: string | null
  total: number
  payment_method: string
  status: string
  notes: string | null
  created_at: string
}

type SaleItem = {
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
}

type ReceiptData = {
  sale: Sale
  items: SaleItem[]
}

const STATUS_COLOR: Record<string, string> = {
  Completed: '#22c55e',
  Pending:   '#ddb837',
  Cancelled: '#fd4682',
}
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card']
const STATUSES        = ['Completed', 'Pending', 'Cancelled']

const inp = {
  width: '100%', padding: '10px 14px',
  background: '#111320', border: '1.5px solid rgba(255,255,255,.08)',
  color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none',
}

// ─── Thermal Receipt ──────────────────────────────────────────────────────────
// Width is constrained to 80mm (302px) for thermal printers.
// Everything outside .thermal-receipt is hidden during printing.
function ThermalReceipt({ data }: { data: ReceiptData }) {
  const { sale, items } = data
  const date = new Date(sale.created_at)
  const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const line = '--------------------------------'
  const dbl  = '================================'

  const padRight = (s: string, n: number) => s.slice(0, n).padEnd(n)
  const padLeft  = (s: string, n: number) => s.slice(0, n).padStart(n)

  return (
    <div className="thermal-receipt" style={{ fontFamily: 'monospace', fontSize: '12px', width: '302px', padding: '8px 4px', lineHeight: '1.4' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>SEEKANT MULTIMEDIA</div>
        <div>Design. Print. Brand.</div>
        <div>Accra, Ghana</div>
        <div>Tel: +233 XX XXX XXXX</div>
      </div>

      <div>{dbl}</div>

      {/* Sale meta */}
      <div>Date: {dateStr}  {timeStr}</div>
      <div>Ref:  {sale.sale_ref}</div>
      <div>Cust: {sale.customer_name || 'Walk-in'}</div>
      <div>Pay:  {sale.payment_method}</div>
      {sale.notes && <div>Note: {sale.notes}</div>}

      <div>{line}</div>

      {/* Column headers */}
      <div style={{ display: 'flex' }}>
        <span style={{ flex: 1 }}>ITEM</span>
        <span style={{ width: '28px', textAlign: 'right' }}>QTY</span>
        <span style={{ width: '72px', textAlign: 'right' }}>TOTAL</span>
      </div>

      <div>{line}</div>

      {/* Line items */}
      {items.map((item, i) => {
        const name = padRight(item.product_name, 18)
        const qty  = String(item.quantity).padStart(3)
        const amt  = formatCurrency(item.line_total).padStart(10)
        return (
          <div key={i} style={{ display: 'flex' }}>
            <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.product_name}</span>
            <span style={{ width: '28px', textAlign: 'right' }}>{item.quantity}</span>
            <span style={{ width: '72px', textAlign: 'right' }}>{formatCurrency(item.line_total)}</span>
          </div>
        )
        // suppress unused var warnings
        void name; void qty; void amt;
      })}

      {items.length === 0 && <div style={{ color: '#999' }}>(no line items on record)</div>}

      <div>{line}</div>

      {/* Total */}
      <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '13px' }}>
        <span style={{ flex: 1 }}>TOTAL</span>
        <span style={{ width: '100px', textAlign: 'right' }}>{formatCurrency(sale.total)}</span>
      </div>

      {/* Status */}
      <div style={{ display: 'flex' }}>
        <span style={{ flex: 1 }}>STATUS</span>
        <span style={{ width: '100px', textAlign: 'right' }}>{sale.status.toUpperCase()}</span>
      </div>

      <div>{dbl}</div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '4px' }}>
        <div>Thank you for your patronage!</div>
        <div>seekantmultimedia.com</div>
        <div style={{ marginTop: '8px', fontSize: '10px' }}>*** CUSTOMER COPY ***</div>
      </div>
    </div>
  )
}

// ─── Edit Modal (admin only) ──────────────────────────────────────────────────
function EditModal({
  sale,
  onClose,
  onSaved,
}: {
  sale: Sale
  onClose: () => void
  onSaved: (updated: Partial<Sale>) => void
}) {
  const [form, setForm] = useState({
    customer_name:  sale.customer_name ?? '',
    payment_method: sale.payment_method,
    status:         sale.status,
    notes:          sale.notes ?? '',
  })
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSale(sale.id, form)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Sale updated')
      onSaved(form)
      onClose()
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
      <div style={{ background: '#181b2e', width: '100%', maxWidth: 440, padding: '32px 32px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Edit Sale</h2>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>{sale.sale_ref}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>Customer Name</label>
            <input title="Customer Name" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} style={inp}
              onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>Payment Method</label>
            <select title="Payment Method" value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
              onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>Status</label>
            <select title="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
              onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>Notes</label>
            <textarea title="Notes" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" onClick={onClose} style={{ fontSize: 11, padding: '10px 18px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SalesClient({
  initialSales,
  role,
}: {
  initialSales: Sale[]
  role: string
}) {
  const [sales, setSales]             = useState(initialSales)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]           = useState('')
  const [isPending, startTransition]  = useTransition()
  const [receipt, setReceipt]         = useState<ReceiptData | null>(null)
  const [editing, setEditing]         = useState<Sale | null>(null)
  const [printing, setPrinting]       = useState<string | null>(null) // sale id being fetched

  const isAdmin = role === 'admin'

  const filtered = sales.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchSearch = !search
      || s.sale_ref.toLowerCase().includes(search.toLowerCase())
      || (s.customer_name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalRevenue = filtered.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.total, 0)

  const handleStatusQuick = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateSaleStatus(id, status)
      if (result?.error) toast.error(result.error)
      else {
        setSales(s => s.map(x => x.id === id ? { ...x, status } : x))
        toast.success('Status updated')
      }
    })
  }

  const handlePrint = async (sale: Sale) => {
    setPrinting(sale.id)
    const items = await getSaleItems(sale.id)
    setReceipt({ sale, items })
    setPrinting(null)
    setTimeout(() => window.print(), 150)
  }

  const handleEditSaved = (id: string, updates: Partial<Sale>) => {
    setSales(s => s.map(x => x.id === id ? { ...x, ...updates } : x))
  }

  const exportCSV = () => {
    const headers = ['Ref', 'Customer', 'Amount', 'Payment', 'Status', 'Date']
    const rows = filtered.map(s => [
      s.sale_ref, s.customer_name ?? '', s.total, s.payment_method, s.status,
      new Date(s.created_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const inp12 = { padding: '9px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

  return (
    <>
      {/* ── Print styles: hide everything except receipt ── */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .thermal-receipt-wrapper { display: block !important; position: fixed; inset: 0; }
          .thermal-receipt {
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 12px !important;
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 6px 2px !important;
            color: #000 !important;
            background: #fff !important;
            line-height: 1.45 !important;
          }
          @page { margin: 4mm; size: 80mm auto; }
        }
        @media screen { .thermal-receipt-wrapper { display: none; } }
      `}</style>

      {/* ── Hidden receipt (shown only on print) ── */}
      <div className="thermal-receipt-wrapper">
        {receipt && <ThermalReceipt data={receipt} />}
      </div>

      {/* ── Edit modal (admin only) ── */}
      {editing && (
        <EditModal
          sale={editing}
          onClose={() => setEditing(null)}
          onSaved={updates => handleEditSaved(editing.id, updates)}
        />
      )}

      {/* ── Main UI ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Sales</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
              {filtered.length} records · Revenue: <span style={{ color: '#ddb837', fontWeight: 700 }}>{formatCurrency(totalRevenue)}</span>
            </p>
          </div>
          <button type="button" onClick={exportCSV} style={{ fontSize: 11, padding: '10px 18px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ref or customer…"
            style={{ ...inp12, flex: 1 }}
            onFocus={e => (e.target.style.borderColor = '#ddb837')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
          />
          <select title="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ ...inp12, appearance: 'none', cursor: 'pointer', paddingRight: 28 }}
            onFocus={e => (e.target.style.borderColor = '#ddb837')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ background: '#181b2e', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                {['Ref', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 16px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#ddb837', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.sale_ref}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{s.customer_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatCurrency(s.total)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.5)', whiteSpace: 'nowrap' }}>{s.payment_method}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: `${STATUS_COLOR[s.status] ?? '#aaa'}18`, color: STATUS_COLOR[s.status] ?? '#aaa', whiteSpace: 'nowrap' }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>
                    {new Date(s.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {/* Quick status buttons for Pending */}
                      {s.status === 'Pending' && (
                        <>
                          <button type="button" onClick={() => handleStatusQuick(s.id, 'Completed')} disabled={isPending}
                            style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(34,197,94,.12)', color: '#22c55e', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', whiteSpace: 'nowrap' }}>
                            Complete
                          </button>
                          <button type="button" onClick={() => handleStatusQuick(s.id, 'Cancelled')} disabled={isPending}
                            style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(253,70,130,.12)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Print receipt */}
                      <button type="button" onClick={() => handlePrint(s)} disabled={printing === s.id}
                        title="Print receipt"
                        style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(84,185,253,.12)', color: '#54b9fd', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', whiteSpace: 'nowrap' }}>
                        {printing === s.id ? '…' : '🖨 Print'}
                      </button>

                      {/* Edit — admin only */}
                      {isAdmin && (
                        <button type="button" onClick={() => setEditing(s)}
                          title="Edit sale"
                          style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(221,184,55,.12)', color: '#ddb837', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} style={{ padding: '32px 16px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

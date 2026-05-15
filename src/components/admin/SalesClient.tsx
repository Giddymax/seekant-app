'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateSaleStatus, updateSale, getSaleItems, addPayment, deleteSale } from '@/lib/actions/sales'
import { formatCurrency } from '@/lib/utils'

type Sale = {
  id: string
  sale_ref: string
  customer_name: string | null
  customer_phone: string | null
  total: number
  discount: number
  amount_paid: number
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
  Completed:    '#22c55e',
  Pending:      '#ddb837',
  'Part-Payment': '#f97316',
  Cancelled:    '#fd4682',
}
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card']
const STATUSES        = ['Completed', 'Pending', 'Part-Payment', 'Cancelled']

const inp = {
  width: '100%', padding: '10px 14px',
  background: '#111320', border: '1.5px solid rgba(255,255,255,.08)',
  color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none',
}

// ─── Thermal Receipt ──────────────────────────────────────────────────────────
function ThermalReceipt({ data }: { data: ReceiptData }) {
  const { sale, items } = data
  const date     = new Date(sale.created_at)
  const dateStr  = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr  = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const LINE     = '--------------------------------'
  const DBL      = '================================'
  const subtotal = items.reduce((s, i) => s + i.line_total, 0)
  const discount = sale.discount ?? 0
  const balance  = Math.max(0, sale.total - (sale.amount_paid ?? sale.total))

  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <div style={{ display: 'flex', fontWeight: bold ? 'bold' : 'normal', fontSize: bold ? '13px' : '12px' }}>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ width: '100px', textAlign: 'right' }}>{value}</span>
    </div>
  )

  return (
    <div className="thermal-receipt" style={{ fontFamily: 'monospace', fontSize: '12px', width: '302px', padding: '8px 4px', lineHeight: '1.5' }}>
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '15px', letterSpacing: '0.05em' }}>SEEKANT MULTIMEDIA</div>
        <div>Design. Print. Brand.</div>
        <div>Asuom, Eastern Region, Ghana</div>
        <div>Tel: +233 XX XXX XXXX</div>
        <div>www.seekantmultimedia.com</div>
      </div>

      <div>{DBL}</div>
      <div>Date: {dateStr} {timeStr}</div>
      <div>Ref:  {sale.sale_ref}</div>
      <div>Cust: {sale.customer_name || 'Walk-in'}</div>
      {sale.customer_phone && <div>Tel:  {sale.customer_phone}</div>}
      <div>Pay:  {sale.payment_method}</div>
      {sale.notes && <div>Note: {sale.notes}</div>}
      <div>{LINE}</div>

      <div style={{ display: 'flex', fontWeight: 'bold' }}>
        <span style={{ flex: 1 }}>ITEM</span>
        <span style={{ width: '28px', textAlign: 'right' }}>QTY</span>
        <span style={{ width: '72px', textAlign: 'right' }}>TOTAL</span>
      </div>
      <div>{LINE}</div>

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex' }}>
          <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.product_name}</span>
          <span style={{ width: '28px', textAlign: 'right' }}>{item.quantity}</span>
          <span style={{ width: '72px', textAlign: 'right' }}>{formatCurrency(item.line_total)}</span>
        </div>
      ))}
      {items.length === 0 && <div style={{ color: '#999' }}>(no line items on record)</div>}
      <div>{LINE}</div>

      <Row label="SUBTOTAL" value={formatCurrency(subtotal)} />
      <Row label="DISCOUNT" value={discount > 0 ? `-${formatCurrency(discount)}` : 'None'} />
      <Row label="TAX" value="None" />
      <div>{LINE}</div>
      <Row label="TOTAL" value={formatCurrency(sale.total)} bold />
      <Row label="PAID" value={formatCurrency(sale.amount_paid ?? sale.total)} />
      {balance > 0 && <Row label="BALANCE DUE" value={formatCurrency(balance)} bold />}
      <Row label="STATUS" value={sale.status.toUpperCase()} />
      <div>{DBL}</div>

      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        {balance > 0
          ? <div style={{ fontWeight: 'bold' }}>BALANCE DUE: {formatCurrency(balance)}</div>
          : <div>Thank you for your patronage!</div>
        }
        <div style={{ marginTop: '8px', fontSize: '10px' }}>*** CUSTOMER COPY ***</div>
      </div>
    </div>
  )
}

// ─── Settle Modal ─────────────────────────────────────────────────────────────
function SettleModal({
  sale,
  onClose,
  onSettled,
}: {
  sale: Sale
  onClose: () => void
  onSettled: (newAmountPaid: number, newStatus: string) => void
}) {
  const balance = Math.max(0, sale.total - sale.amount_paid)
  const [amount, setAmount] = useState(balance)
  const [isPending, startTransition] = useTransition()

  const handleSettle = () => {
    if (amount <= 0) { toast.error('Enter a payment amount'); return }
    startTransition(async () => {
      const result = await addPayment(sale.id, amount)
      if (result?.error) { toast.error(result.error); return }
      toast.success(result.new_status === 'Completed' ? 'Sale fully settled!' : 'Payment recorded')
      onSettled(result.new_amount_paid!, result.new_status!)
      onClose()
    })
  }

  const newBalance = Math.max(0, balance - amount)

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
      <div style={{ background: '#181b2e', width: '100%', maxWidth: 400, padding: '32px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Record Payment</h2>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>{sale.sale_ref} · {sale.customer_name || 'Walk-in'}</p>

        {/* Balance summary */}
        <div style={{ background: 'rgba(249,115,22,.08)', border: '1px solid rgba(249,115,22,.2)', padding: '14px 16px', marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Total</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{formatCurrency(sale.total)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Paid</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#22c55e' }}>{formatCurrency(sale.amount_paid)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Balance</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f97316' }}>{formatCurrency(balance)}</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 6 }}>
            Amount to Collect (GH₵)
          </label>
          <input
            title="Payment amount"
            type="number"
            min="0.01"
            max={balance}
            step="0.01"
            value={amount}
            onChange={e => setAmount(Math.min(Number(e.target.value), balance))}
            style={inp}
            onFocus={e => (e.target.style.borderColor = '#ddb837')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
          />
        </div>

        {/* Live preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,.04)', marginBottom: 24 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Remaining after payment</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: newBalance === 0 ? '#22c55e' : '#f97316' }}>
            {newBalance === 0 ? 'Fully settled ✓' : formatCurrency(newBalance)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={handleSettle} disabled={isPending || amount <= 0} className="btn btn-gold" style={{ fontSize: 11 }}>
            {isPending ? 'Saving…' : 'Record Payment'}
          </button>
          <button type="button" onClick={onClose} style={{ fontSize: 11, padding: '10px 18px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
            Cancel
          </button>
        </div>
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
  const lbl = { display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.4)', marginBottom: 6 }
  const [form, setForm] = useState({
    customer_name:  sale.customer_name ?? '',
    customer_phone: sale.customer_phone ?? '',
    payment_method: sale.payment_method,
    status:         sale.status,
    discount:       sale.discount ?? 0,
    amount_paid:    sale.amount_paid ?? 0,
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
      <div style={{ background: '#181b2e', width: '100%', maxWidth: 460, padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Edit Sale</h2>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>{sale.sale_ref}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Customer Name</label>
              <input title="Customer Name" value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
            <div>
              <label style={lbl}>Customer Phone</label>
              <input title="Customer Phone" value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Payment Method</label>
              <select title="Payment Method" value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select title="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Discount (GH₵)</label>
              <input title="Discount" type="number" min="0" step="0.01" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
            <div>
              <label style={lbl}>Amount Paid (GH₵)</label>
              <input title="Amount Paid" type="number" min="0" step="0.01" value={form.amount_paid} onChange={e => setForm(f => ({ ...f, amount_paid: Number(e.target.value) }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
          </div>
          <div>
            <label style={lbl}>Notes</label>
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
  const [sales, setSales]               = useState(initialSales)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch]             = useState('')
  const [isPending, startTransition]    = useTransition()
  const [receipt, setReceipt]           = useState<ReceiptData | null>(null)
  const [editing, setEditing]           = useState<Sale | null>(null)
  const [settling, setSettling]         = useState<Sale | null>(null)
  const [printing, setPrinting]         = useState<string | null>(null)

  const isAdmin = role === 'admin'

  const partPayments = sales.filter(s => s.status === 'Part-Payment')
  const totalOutstanding = partPayments.reduce((sum, s) => sum + Math.max(0, s.total - s.amount_paid), 0)

  const filtered = sales.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchSearch = !search
      || s.sale_ref.toLowerCase().includes(search.toLowerCase())
      || (s.customer_name ?? '').toLowerCase().includes(search.toLowerCase())
      || (s.customer_phone ?? '').includes(search)
    return matchStatus && matchSearch
  })

  const totalRevenue = filtered.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.total, 0)

  const handleStatusQuick = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateSaleStatus(id, status)
      if (result?.error) toast.error(result.error)
      else { setSales(s => s.map(x => x.id === id ? { ...x, status } : x)); toast.success('Status updated') }
    })
  }

  const handleDelete = (sale: Sale) => {
    if (!confirm(`Delete sale ${sale.sale_ref}? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteSale(sale.id)
      if (result?.error) { toast.error(result.error); return }
      setSales(s => s.filter(x => x.id !== sale.id))
      toast.success('Sale deleted')
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

  const handleSettled = (id: string, newAmountPaid: number, newStatus: string) => {
    setSales(s => s.map(x => x.id === id ? { ...x, amount_paid: newAmountPaid, status: newStatus } : x))
  }

  const exportCSV = () => {
    const headers = ['Ref', 'Customer', 'Phone', 'Total', 'Paid', 'Balance', 'Payment', 'Status', 'Date']
    const rows = filtered.map(s => [
      s.sale_ref, s.customer_name ?? '', s.customer_phone ?? '',
      s.total, s.amount_paid, Math.max(0, s.total - s.amount_paid),
      s.payment_method, s.status, new Date(s.created_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const inp12 = { padding: '9px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .thermal-receipt-wrapper, .thermal-receipt-wrapper * { visibility: visible !important; }
          .thermal-receipt-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 80mm !important; background: #fff !important; }
          .thermal-receipt { font-family: 'Courier New', Courier, monospace !important; font-size: 12px !important; width: 80mm !important; padding: 6px 4px !important; color: #000 !important; background: #fff !important; line-height: 1.5 !important; }
          @page { margin: 4mm; size: 80mm auto; }
        }
        @media screen { .thermal-receipt-wrapper { display: none; } }
      `}</style>

      <div className="thermal-receipt-wrapper">
        {receipt && <ThermalReceipt data={receipt} />}
      </div>

      {editing && (
        <EditModal sale={editing} onClose={() => setEditing(null)} onSaved={u => handleEditSaved(editing.id, u)} />
      )}
      {settling && (
        <SettleModal sale={settling} onClose={() => setSettling(null)}
          onSettled={(paid, status) => handleSettled(settling.id, paid, status)} />
      )}

      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
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

        {/* ── Part-Payment Outstanding Section ── */}
        {partPayments.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f97316' }}>Outstanding Balances</div>
              <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: 'rgba(249,115,22,.15)', color: '#f97316' }}>{partPayments.length} sale{partPayments.length !== 1 ? 's' : ''}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginLeft: 'auto' }}>
                Total owed: <span style={{ color: '#f97316', fontWeight: 700 }}>{formatCurrency(totalOutstanding)}</span>
              </div>
            </div>

            <div style={{ background: '#181b2e', border: '1px solid rgba(249,115,22,.2)', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    {['Ref', 'Customer', 'Total', 'Paid', 'Balance', 'Date', ''].map((h, i) => (
                      <th key={i} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '12px 16px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partPayments.map(s => {
                    const balance = Math.max(0, s.total - s.amount_paid)
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#ddb837', fontWeight: 700 }}>{s.sale_ref}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                          <div>{s.customer_name || 'Walk-in'}</div>
                          {s.customer_phone && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>{s.customer_phone}</div>}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#fff', fontWeight: 600 }}>{formatCurrency(s.total)}</td>
                        <td style={{ padding: '12px 16px', fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{formatCurrency(s.amount_paid)}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#f97316', fontWeight: 800 }}>{formatCurrency(balance)}</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{new Date(s.created_at).toLocaleDateString('en-GB')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button type="button" onClick={() => setSettling(s)}
                              style={{ fontSize: 9, padding: '4px 12px', background: 'rgba(249,115,22,.15)', color: '#f97316', border: '1px solid rgba(249,115,22,.3)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontWeight: 700 }}>
                              Settle
                            </button>
                            <button type="button" onClick={() => handlePrint(s)} disabled={printing === s.id}
                              style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(84,185,253,.12)', color: '#54b9fd', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                              {printing === s.id ? '…' : '🖨'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ref, customer or phone…"
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

        {/* ── All Sales Table ── */}
        <div style={{ background: '#181b2e', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                {['Ref', 'Customer', 'Total', 'Paid / Balance', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 16px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const balance = Math.max(0, s.total - s.amount_paid)
                const isPartPay = s.status === 'Part-Payment'
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)', background: isPartPay ? 'rgba(249,115,22,.03)' : 'transparent' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#ddb837', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.sale_ref}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                      <div>{s.customer_name || '—'}</div>
                      {s.customer_phone && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{s.customer_phone}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>{formatCurrency(s.total)}</td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      {isPartPay ? (
                        <div>
                          <div style={{ fontSize: 11, color: '#22c55e' }}>Paid {formatCurrency(s.amount_paid)}</div>
                          <div style={{ fontSize: 11, color: '#f97316', fontWeight: 700 }}>Bal {formatCurrency(balance)}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>{formatCurrency(s.amount_paid)}</span>
                      )}
                    </td>
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
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
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
                        {isPartPay && (
                          <button type="button" onClick={() => setSettling(s)}
                            style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(249,115,22,.15)', color: '#f97316', border: '1px solid rgba(249,115,22,.3)', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontWeight: 700 }}>
                            Settle
                          </button>
                        )}
                        <button type="button" onClick={() => handlePrint(s)} disabled={printing === s.id}
                          title="Print receipt"
                          style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(84,185,253,.12)', color: '#54b9fd', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', whiteSpace: 'nowrap' }}>
                          {printing === s.id ? '…' : '🖨 Print'}
                        </button>
                        {isAdmin && (
                          <button type="button" onClick={() => setEditing(s)}
                            style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(221,184,55,.12)', color: '#ddb837', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                            Edit
                          </button>
                        )}
                        {isAdmin && (
                          <button type="button" onClick={() => handleDelete(s)} disabled={isPending}
                            style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(253,70,130,.10)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                            Del
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} style={{ padding: '32px 16px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>
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

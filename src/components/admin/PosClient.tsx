'use client'

import { useState, useTransition, useRef, type CSSProperties } from 'react'
import { toast } from 'sonner'
import { createSale, type CartItem } from '@/lib/actions/sales'
import { formatCurrency } from '@/lib/utils'
import { printReceipt } from '@/lib/print'

type Product = {
  id: number
  name: string
  category: string
  image_url: string | null
  price: number
  cost_price: number
  stock: number
  is_service: boolean
}

type ReceiptSnapshot = {
  ref: string
  customer: string
  phone: string
  payment: string
  staffName: string
  contactPhone: string
  cart: CartItem[]
  discount: number
  amountPaid: number
  total: number
  date: Date
}

const CATEGORIES = ['All', 'Services', 'Print', 'Signage', 'Apparel', 'Design', 'Gifts', 'Other']
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer', 'Card']

const inp = (extra = {}) => ({
  padding: '10px 14px',
  background: '#111320',
  border: '1.5px solid rgba(255,255,255,.08)',
  color: '#fff',
  fontSize: 12,
  fontFamily: 'Poppins,sans-serif',
  outline: 'none',
  ...extra,
})

// ─── Product Grid ─────────────────────────────────────────────────────────────
function PosProductGrid({
  products, search, cat, onSearch, onCat, onAdd,
}: {
  products: Product[]
  search: string
  cat: string
  onSearch: (v: string) => void
  onCat: (v: string) => void
  onAdd: (p: Product) => void
}) {
  const filtered = products.filter(p => {
    const matchCat = cat === 'All'
      || (cat === 'Services' ? p.is_service : (!p.is_service && p.category === cat))
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexShrink: 0 }}>
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search products…"
          style={{ ...inp(), flex: 1 }}
          onFocus={e => (e.target.style.borderColor = '#d42020')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <select
          value={cat}
          onChange={e => onCat(e.target.value)}
          aria-label="Filter by category"
          style={{ ...inp({ appearance: 'none', cursor: 'pointer', paddingRight: 24 }) }}
          onFocus={e => (e.target.style.borderColor = '#d42020')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="pos-product-grid" style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, alignContent: 'start' }}>
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => onAdd(p)}
            style={{
              background: '#181b2e', border: '1.5px solid rgba(255,255,255,.06)',
              cursor: 'pointer', padding: 0, textAlign: 'left',
              fontFamily: 'Poppins,sans-serif', transition: 'border-color .15s',
              touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#d42020')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}
          >
            {/* Product image or placeholder */}
            {p.image_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.image_url} alt={p.name} className="pos-product-img" style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
              : <div className="pos-product-img" style={{ width: '100%', height: 80, background: 'rgba(255,255,255,.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>
            }
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: p.is_service ? '#54b9fd' : '#d42020', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                {p.is_service ? 'Service' : p.category}
              </div>
              <div className="pos-product-name" style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#d42020' }}>{formatCurrency(p.price)}</div>
              {p.is_service
                ? <div style={{ fontSize: 9, fontWeight: 700, color: '#54b9fd', marginTop: 4, letterSpacing: '0.06em' }}>UNLIMITED</div>
                : <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>Stock: {p.stock}</div>
              }
            </div>
          </button>
        ))}
        {!filtered.length && (
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, padding: '24px 0', gridColumn: '1/-1' }}>No products found.</p>
        )}
      </div>
    </div>
  )
}

// ─── Cart Panel ───────────────────────────────────────────────────────────────
function PosCartPanel({
  cart, customerName, customerPhone, payment, discount, amountPaid,
  isPending, lastRef,
  onUpdateQty, onRemove, onCustomerName, onCustomerPhone, onPayment, onDiscount, onAmountPaid, onCheckout,
}: {
  cart: CartItem[]
  customerName: string
  customerPhone: string
  payment: string
  discount: number
  amountPaid: number
  isPending: boolean
  lastRef: string | null
  onUpdateQty: (id: number, qty: number) => void
  onRemove: (id: number) => void
  onCustomerName: (v: string) => void
  onCustomerPhone: (v: string) => void
  onPayment: (v: string) => void
  onDiscount: (v: number) => void
  onAmountPaid: (v: number) => void
  onCheckout: () => void
}) {
  const subtotal   = cart.reduce((sum, x) => sum + x.unit_price * x.quantity, 0)
  const total      = Math.max(0, subtotal - discount)
  const changeDue  = amountPaid > total ? amountPaid - total : 0
  const balanceDue = amountPaid > 0 && amountPaid < total ? total - amountPaid : 0

  return (
    <div className="pos-cart" style={{ background: '#181b2e', display: 'flex', flexDirection: 'column', width: 320, flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h2>
      </div>

      <div className="pos-cart-items" style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
        {!cart.length && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center', marginTop: 24 }}>Cart is empty — click a product to add</p>
        )}
        {cart.map(item => (
          <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.35)' }}>{formatCurrency(item.unit_price)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
                style={{ width: 20, height: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, fontFamily: 'Poppins,sans-serif' }}>−</button>
              <span style={{ fontSize: 12, color: '#fff', minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
                style={{ width: 20, height: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, fontFamily: 'Poppins,sans-serif' }}>+</button>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#d42020', minWidth: 52, textAlign: 'right' }}>{formatCurrency(item.unit_price * item.quantity)}</div>
            <button onClick={() => onRemove(item.product_id)} style={{ background: 'none', border: 'none', color: 'rgba(253,70,130,.7)', cursor: 'pointer', fontSize: 16, padding: '0 2px', lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 20px 20px', borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <input
          value={customerName}
          onChange={e => onCustomerName(e.target.value)}
          placeholder="Customer name (Walk-in)"
          style={{ ...inp({ width: '100%', marginBottom: 8 }) }}
          onFocus={e => (e.target.style.borderColor = '#d42020')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <input
          value={customerPhone}
          onChange={e => onCustomerPhone(e.target.value)}
          placeholder="Customer phone (optional)"
          style={{ ...inp({ width: '100%', marginBottom: 8 }) }}
          onFocus={e => (e.target.style.borderColor = '#d42020')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <select
          value={payment}
          onChange={e => onPayment(e.target.value)}
          aria-label="Payment method"
          style={{ ...inp({ width: '100%', appearance: 'none', marginBottom: 8, cursor: 'pointer' }) }}
          onFocus={e => (e.target.style.borderColor = '#d42020')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        >
          {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Discount field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <label style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>DISCOUNT GH₵</label>
          <input
            type="number" min="0" step="0.01"
            value={discount || ''}
            onChange={e => onDiscount(Number(e.target.value) || 0)}
            placeholder="0.00"
            style={{ ...inp({ flex: 1 }) }}
            onFocus={e => (e.target.style.borderColor = '#d42020')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
          />
        </div>

        {/* Amount Paid field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <label style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>AMOUNT PAID GH₵</label>
          <input
            type="number" min="0" step="0.01"
            value={amountPaid || ''}
            onChange={e => onAmountPaid(Number(e.target.value) || 0)}
            placeholder="Full payment"
            style={{ ...inp({ flex: 1 }) }}
            onFocus={e => (e.target.style.borderColor = '#d42020')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
          />
        </div>

        {/* Totals */}
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)' }}>SUBTOTAL</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{formatCurrency(subtotal)}</span>
          </div>
        )}
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#22c55e' }}>DISCOUNT</span>
            <span style={{ fontSize: 11, color: '#22c55e' }}>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: changeDue || balanceDue ? 6 : 14 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>TOTAL</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#d42020' }}>{formatCurrency(total)}</span>
        </div>
        {changeDue > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, padding: '6px 10px', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>CHANGE DUE</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#22c55e' }}>{formatCurrency(changeDue)}</span>
          </div>
        )}
        {balanceDue > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, padding: '6px 10px', background: 'rgba(249,115,22,.08)', border: '1px solid rgba(249,115,22,.3)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316' }}>BALANCE DUE</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f97316' }}>{formatCurrency(balanceDue)}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onCheckout}
          disabled={isPending || !cart.length}
          style={{
            width: '100%', padding: '13px',
            background: cart.length ? '#d42020' : 'rgba(255,255,255,.06)',
            color: cart.length ? '#1a181d' : 'rgba(255,255,255,.25)',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            border: 'none', cursor: cart.length ? 'pointer' : 'not-allowed',
            fontFamily: 'Poppins,sans-serif', opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? 'Processing…' : 'Process Sale'}
        </button>

        {lastRef && (
          <p style={{ fontSize: 11, color: '#22c55e', textAlign: 'center', marginTop: 10 }}>
            ✓ Sale recorded — <strong>{lastRef}</strong>
          </p>
        )}
      </div>
    </div>
  )
}

// ─── POS Thermal Receipt ──────────────────────────────────────────────────────
function PosReceipt({ snap }: { snap: ReceiptSnapshot }) {
  const dateStr = snap.date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = snap.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const headerText: CSSProperties = { minWidth: 0, flex: 1, lineHeight: '1.4', overflow: 'hidden' }
  const headerLine: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
  const lineRule: CSSProperties = { borderTop: '1px dashed #000', margin: '4px 0' }
  const dblRule: CSSProperties = { borderTop: '3px double #000', margin: '4px 0' }
  const itemGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) 24px 58px 64px',
    columnGap: '6px',
    width: '100%',
    overflow: 'hidden',
  }
  const amountCell: CSSProperties = { textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
  const summaryRow: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 100px', columnGap: '10px', width: '100%' }

  return (
    <div className="pos-receipt" style={{ fontFamily: 'monospace', fontSize: '12px', width: '302px', maxWidth: '80mm', boxSizing: 'border-box', overflow: 'hidden', padding: '8px 4px', lineHeight: '1.5', color: '#000', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: '6px 4px 8px', borderBottom: '3px solid #000', marginBottom: '8px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Seekant Multimedia" style={{ width: '56px', height: '56px', objectFit: 'contain', flexShrink: 0 }} />
        <div style={headerText}>
          <div style={{ ...headerLine, fontWeight: '900', fontSize: '14px', letterSpacing: '0.06em', color: '#000' }}>SEEKANT MULTIMEDIA</div>
          <div style={{ ...headerLine, fontWeight: '700', fontSize: '11px', letterSpacing: '0.04em', color: '#222' }}>Design. Print. Brand.</div>
          <div style={{ ...headerLine, fontSize: '10px', color: '#333' }}>Asuom, Eastern Region, Ghana</div>
          {snap.contactPhone && <div style={{ ...headerLine, fontSize: '10px', color: '#333' }}>Tel: {snap.contactPhone}</div>}
          <div style={{ ...headerLine, fontSize: '10px', color: '#333' }}>www.seekantmultimedia.com</div>
        </div>
      </div>

      <div style={{ overflow: 'hidden', padding: '0 4px' }}>
        <div style={dblRule} />
        <div style={summaryRow}><span>Date:</span><span style={amountCell}>{dateStr} {timeStr}</span></div>
        <div style={summaryRow}><span>Ref:</span><span style={amountCell}>{snap.ref}</span></div>
        <div style={summaryRow}><span>Cust:</span><span style={amountCell}>{snap.customer}</span></div>
        {snap.phone && <div style={summaryRow}><span>Tel:</span><span style={amountCell}>{snap.phone}</span></div>}
        <div style={summaryRow}><span>Pay:</span><span style={amountCell}>{snap.payment}</span></div>
        <div style={summaryRow}><span>Serv:</span><span style={amountCell}>{snap.staffName}</span></div>
        <div style={lineRule} />

        <div style={{ ...itemGrid, fontWeight: 'bold' }}>
          <span>ITEM</span>
          <span style={{ textAlign: 'center' }}>QTY</span>
          <span style={amountCell}>PRICE</span>
          <span style={amountCell}>TOTAL</span>
        </div>
        <div style={lineRule} />

        {snap.cart.map(i => (
          <div key={i.product_id} style={itemGrid}>
            <span style={{ minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontWeight: 'bold' }}>{i.name}</span>
            <span style={{ textAlign: 'center' }}>{i.quantity}</span>
            <span style={amountCell}>{formatCurrency(i.unit_price)}</span>
            <span style={amountCell}>{formatCurrency(i.unit_price * i.quantity)}</span>
          </div>
        ))}

        <div style={lineRule} />
        <div style={summaryRow}>
          <span>SUBTOTAL</span>
          <span style={amountCell}>{formatCurrency(snap.cart.reduce((s, i) => s + i.unit_price * i.quantity, 0))}</span>
        </div>
        {snap.discount > 0 && (
          <div style={summaryRow}><span>DISCOUNT</span><span style={amountCell}>-{formatCurrency(snap.discount)}</span></div>
        )}
        <div style={lineRule} />
        <div style={{ ...summaryRow, fontWeight: 'bold', fontSize: '13px' }}>
          <span>TOTAL</span>
          <span style={amountCell}>{formatCurrency(snap.total)}</span>
        </div>
        {snap.amountPaid > 0 && (
          <div style={summaryRow}>
            <span>PAID</span>
            <span style={amountCell}>{formatCurrency(snap.amountPaid)}</span>
          </div>
        )}
        {snap.amountPaid > snap.total && (
          <div style={{ ...summaryRow, fontWeight: 'bold' }}>
            <span>CHANGE</span>
            <span style={amountCell}>{formatCurrency(snap.amountPaid - snap.total)}</span>
          </div>
        )}
        <div style={{ ...summaryRow, fontWeight: 'bold' }}>
          <span>BALANCE</span>
          <span style={amountCell}>{formatCurrency(Math.max(0, snap.total - snap.amountPaid))}</span>
        </div>
        <div style={dblRule} />
        {snap.total > 0 && snap.amountPaid >= snap.total && (
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.06em', marginTop: '8px', paddingTop: '6px', borderTop: '3px solid #000' }}>PAID IN FULL</div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '6px', overflowWrap: 'anywhere' }}>
        <div>Thank you for your patronage!</div>
        <div style={{ marginTop: '8px', fontSize: '10px' }}>*** CUSTOMER COPY ***</div>
      </div>
    </div>
  )
}

// ─── Main POS Component ───────────────────────────────────────────────────────
export default function PosClient({ products, staffName, contactPhone }: { products: Product[]; staffName: string; contactPhone: string }) {
  const [cart, setCart]               = useState<CartItem[]>([])
  const [search, setSearch]           = useState('')
  const [cat, setCat]                 = useState('All')
  const [payment, setPayment]         = useState('Cash')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [discount, setDiscount]       = useState(0)
  const [amountPaid, setAmountPaid]   = useState(0)
  const [isPending, startTransition]  = useTransition()
  const [receiptSnap, setReceiptSnap] = useState<ReceiptSnapshot | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  const receiptPreviewRef = useRef<HTMLDivElement>(null)

  function openPrintWindow(mode: 'thermal' | 'pdf') {
    const result = printReceipt(mode, receiptPreviewRef.current, `Receipt — ${receiptSnap?.ref ?? ''}`)
    if (!result.ok) toast.error(result.error)
  }

  const addToCart = (p: Product) => {
    setCart(c => {
      const existing = c.find(x => x.product_id === p.id)
      if (existing) {
        if (!p.is_service && existing.quantity >= p.stock) { toast.error('Not enough stock'); return c }
        return c.map(x => x.product_id === p.id ? { ...x, quantity: x.quantity + 1 } : x)
      }
      if (!p.is_service && p.stock < 1) { toast.error('Out of stock'); return c }
      return [...c, { product_id: p.id, name: p.name, quantity: 1, unit_price: p.price, cost_price: p.cost_price, is_service: p.is_service }]
    })
  }

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart(c => c.filter(x => x.product_id !== id))
    else setCart(c => c.map(x => x.product_id === id ? { ...x, quantity: qty } : x))
  }

  const removeFromCart = (id: number) => setCart(c => c.filter(x => x.product_id !== id))

  const handleCheckout = () => {
    if (!cart.length) { toast.error('Cart is empty'); return }
    const snapTotal = Math.max(0, cart.reduce((s, i) => s + i.unit_price * i.quantity, 0) - discount)
    const snap: ReceiptSnapshot = {
      ref:          '',
      customer:     customerName || 'Walk-in',
      phone:        customerPhone,
      payment,
      staffName,
      contactPhone,
      cart:         [...cart],
      discount,
      amountPaid:   amountPaid > 0 ? amountPaid : snapTotal,
      total:        snapTotal,
      date:         new Date(),
    }
    startTransition(async () => {
      const result = await createSale({
        items:           snap.cart,
        payment_method:  snap.payment,
        customer_name:   snap.customer,
        customer_phone:  snap.phone || undefined,
        discount:        snap.discount,
        amount_paid:     amountPaid > 0 ? Math.min(amountPaid, snapTotal) : undefined,
      })
      if (result?.error) { toast.error(result.error); return }
      snap.ref = result.sale_ref ?? ''
      setReceiptSnap({ ...snap })
      setShowReceiptModal(true)
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      setDiscount(0)
      setAmountPaid(0)
      toast.success(`Sale recorded! Ref: ${result.sale_ref}`)
    })
  }

  return (
    <>
      {/* Receipt preview modal — print via window.open() for mobile compatibility */}
      {showReceiptModal && receiptSnap && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16, cursor: 'pointer' }}
          onClick={e => { if (e.target === e.currentTarget) setShowReceiptModal(false) }}
        >
          <div style={{ background: '#181b2e', borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: 360, maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,.08)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Receipt — {receiptSnap.ref}</h3>
              <button type="button" onClick={() => setShowReceiptModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', padding: 4, fontSize: 20, lineHeight: 1, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as CSSProperties}>×</button>
            </div>
            {/* Receipt preview — scrollable */}
            <div ref={receiptPreviewRef} style={{ overflowY: 'auto', flex: 1, padding: 16 }}>
              <PosReceipt snap={receiptSnap} />
            </div>
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.08)', flexShrink: 0 }}>
              <button type="button" onClick={() => openPrintWindow('thermal')}
                style={{ flex: 1, padding: '11px 8px', background: '#d42020', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as CSSProperties}>
                Print
              </button>
              <button type="button" onClick={() => openPrintWindow('pdf')}
                style={{ flex: 1, padding: '11px 8px', background: 'rgba(34,197,94,.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,.25)', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'Poppins,sans-serif', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as CSSProperties}>
                Save PDF
              </button>
              <button type="button" onClick={() => setShowReceiptModal(false)}
                style={{ flex: 1, padding: '11px 8px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'Poppins,sans-serif', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' } as CSSProperties}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pos-layout" style={{ display: 'flex', gap: 20, height: 'calc(100vh - 120px)', minHeight: 600 }}>
        <PosProductGrid
          products={products}
          search={search}
          cat={cat}
          onSearch={setSearch}
          onCat={setCat}
          onAdd={addToCart}
        />
        <PosCartPanel
          cart={cart}
          customerName={customerName}
          customerPhone={customerPhone}
          payment={payment}
          discount={discount}
          amountPaid={amountPaid}
          isPending={isPending}
          lastRef={receiptSnap?.ref ?? null}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCustomerName={setCustomerName}
          onCustomerPhone={setCustomerPhone}
          onPayment={setPayment}
          onDiscount={setDiscount}
          onAmountPaid={setAmountPaid}
          onCheckout={handleCheckout}
        />
      </div>
    </>
  )
}

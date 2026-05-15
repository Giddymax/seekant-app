'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createSale, type CartItem } from '@/lib/actions/sales'
import { formatCurrency } from '@/lib/utils'

type Product = {
  id: number
  name: string
  category: string
  image_url: string | null
  price: number
  stock: number
}

type ReceiptSnapshot = {
  ref: string
  customer: string
  phone: string
  payment: string
  cart: CartItem[]
  discount: number
  amountPaid: number
  total: number
  date: Date
}

const CATEGORIES = ['All', 'Print', 'Signage', 'Apparel', 'Design', 'Gifts', 'Other']
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
    const matchCat = cat === 'All' || p.category === cat
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
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <select
          value={cat}
          onChange={e => onCat(e.target.value)}
          aria-label="Filter by category"
          style={{ ...inp({ appearance: 'none', cursor: 'pointer', paddingRight: 24 }) }}
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, alignContent: 'start' }}>
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => onAdd(p)}
            style={{
              background: '#181b2e', border: '1.5px solid rgba(255,255,255,.06)',
              cursor: 'pointer', padding: 0, textAlign: 'left',
              fontFamily: 'Poppins,sans-serif', transition: 'border-color .15s', overflow: 'hidden',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#ddb837')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}
          >
            {/* Product image or placeholder */}
            {p.image_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: 80, background: 'rgba(255,255,255,.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>
            }
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#ddb837', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{p.category}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ddb837' }}>{formatCurrency(p.price)}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>Stock: {p.stock}</div>
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
    <div style={{ background: '#181b2e', display: 'flex', flexDirection: 'column', width: 320, flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
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
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ddb837', minWidth: 52, textAlign: 'right' }}>{formatCurrency(item.unit_price * item.quantity)}</div>
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
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <input
          value={customerPhone}
          onChange={e => onCustomerPhone(e.target.value)}
          placeholder="Customer phone (optional)"
          style={{ ...inp({ width: '100%', marginBottom: 8 }) }}
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <select
          value={payment}
          onChange={e => onPayment(e.target.value)}
          aria-label="Payment method"
          style={{ ...inp({ width: '100%', appearance: 'none', marginBottom: 8, cursor: 'pointer' }) }}
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
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
            onFocus={e => (e.target.style.borderColor = '#ddb837')}
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
            onFocus={e => (e.target.style.borderColor = '#ddb837')}
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
          <span style={{ fontSize: 22, fontWeight: 900, color: '#ddb837' }}>{formatCurrency(total)}</span>
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
            background: cart.length ? '#ddb837' : 'rgba(255,255,255,.06)',
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
  const LINE = '--------------------------------'
  const DBL  = '================================'
  const dateStr = snap.date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeStr = snap.date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="pos-receipt" style={{ fontFamily: 'monospace', fontSize: '12px', width: '302px', padding: '8px 4px', lineHeight: '1.5', color: '#000', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '15px', letterSpacing: '0.05em' }}>SEEKANT MULTIMEDIA</div>
        <div>Design. Print. Brand.</div>
        <div>Accra, Ghana</div>
        <div>Tel: +233 XX XXX XXXX</div>
        <div>www.seekantmultimedia.com</div>
      </div>

      <div>{DBL}</div>
      <div>Date: {dateStr} {timeStr}</div>
      <div>Ref:  {snap.ref}</div>
      <div>Cust: {snap.customer}</div>
      {snap.phone && <div>Tel:  {snap.phone}</div>}
      <div>Pay:  {snap.payment}</div>
      <div>{LINE}</div>

      <div style={{ display: 'flex', fontWeight: 'bold' }}>
        <span style={{ flex: 1 }}>ITEM</span>
        <span style={{ width: '28px', textAlign: 'right' }}>QTY</span>
        <span style={{ width: '72px', textAlign: 'right' }}>TOTAL</span>
      </div>
      <div>{LINE}</div>

      {snap.cart.map(i => (
        <div key={i.product_id} style={{ display: 'flex' }}>
          <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>{i.name}</span>
          <span style={{ width: '28px', textAlign: 'right' }}>{i.quantity}</span>
          <span style={{ width: '72px', textAlign: 'right' }}>{formatCurrency(i.unit_price * i.quantity)}</span>
        </div>
      ))}

      <div>{LINE}</div>
      <div style={{ display: 'flex' }}>
        <span style={{ flex: 1 }}>SUBTOTAL</span>
        <span style={{ width: '100px', textAlign: 'right' }}>{formatCurrency(snap.cart.reduce((s, i) => s + i.unit_price * i.quantity, 0))}</span>
      </div>
      {snap.discount > 0
        ? <div style={{ display: 'flex' }}><span style={{ flex: 1 }}>DISCOUNT</span><span style={{ width: '100px', textAlign: 'right' }}>-{formatCurrency(snap.discount)}</span></div>
        : <div style={{ display: 'flex' }}><span style={{ flex: 1 }}>DISCOUNT</span><span style={{ width: '100px', textAlign: 'right' }}>None</span></div>
      }
      <div style={{ display: 'flex' }}><span style={{ flex: 1 }}>TAX</span><span style={{ width: '100px', textAlign: 'right' }}>None</span></div>
      <div>{LINE}</div>
      <div style={{ display: 'flex', fontWeight: 'bold', fontSize: '13px' }}>
        <span style={{ flex: 1 }}>TOTAL</span>
        <span style={{ width: '100px', textAlign: 'right' }}>{formatCurrency(snap.total)}</span>
      </div>
      {snap.amountPaid > 0 && (
        <div style={{ display: 'flex' }}>
          <span style={{ flex: 1 }}>PAID</span>
          <span style={{ width: '100px', textAlign: 'right' }}>{formatCurrency(snap.amountPaid)}</span>
        </div>
      )}
      {snap.amountPaid > snap.total && (
        <div style={{ display: 'flex', fontWeight: 'bold' }}>
          <span style={{ flex: 1 }}>CHANGE</span>
          <span style={{ width: '100px', textAlign: 'right' }}>{formatCurrency(snap.amountPaid - snap.total)}</span>
        </div>
      )}
      {snap.amountPaid > 0 && snap.amountPaid < snap.total && (
        <div style={{ display: 'flex', fontWeight: 'bold' }}>
          <span style={{ flex: 1 }}>BALANCE DUE</span>
          <span style={{ width: '100px', textAlign: 'right' }}>{formatCurrency(snap.total - snap.amountPaid)}</span>
        </div>
      )}
      <div>{DBL}</div>

      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        <div>Thank you for your patronage!</div>
        <div style={{ marginTop: '8px', fontSize: '10px' }}>*** CUSTOMER COPY ***</div>
      </div>
    </div>
  )
}

// ─── Main POS Component ───────────────────────────────────────────────────────
export default function PosClient({ products }: { products: Product[] }) {
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

  const addToCart = (p: Product) => {
    setCart(c => {
      const existing = c.find(x => x.product_id === p.id)
      if (existing) {
        if (existing.quantity >= p.stock) { toast.error('Not enough stock'); return c }
        return c.map(x => x.product_id === p.id ? { ...x, quantity: x.quantity + 1 } : x)
      }
      if (p.stock < 1) { toast.error('Out of stock'); return c }
      return [...c, { product_id: p.id, name: p.name, quantity: 1, unit_price: p.price }]
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
      ref:        '',
      customer:   customerName || 'Walk-in',
      phone:      customerPhone,
      payment,
      cart:       [...cart],
      discount,
      amountPaid: amountPaid > 0 ? amountPaid : snapTotal,
      total:      snapTotal,
      date:       new Date(),
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
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      setDiscount(0)
      setAmountPaid(0)
      toast.success(`Sale recorded! Ref: ${result.sale_ref}`)
      setTimeout(() => window.print(), 200)
    })
  }

  return (
    <>
      {/* Print CSS — visibility approach so nested receipt becomes visible */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .pos-receipt-wrapper,
          .pos-receipt-wrapper * { visibility: visible !important; }
          .pos-receipt-wrapper {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 80mm !important;
            background: #fff !important;
          }
          .pos-receipt {
            font-family: 'Courier New', Courier, monospace !important;
            font-size: 12px !important;
            width: 80mm !important;
            padding: 6px 4px !important;
            color: #000 !important;
            background: #fff !important;
            line-height: 1.5 !important;
          }
          @page { margin: 4mm; size: 80mm auto; }
        }
        @media screen { .pos-receipt-wrapper { display: none; } }
      `}</style>

      <div className="pos-receipt-wrapper">
        {receiptSnap && <PosReceipt snap={receiptSnap} />}
      </div>

      <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 120px)', minHeight: 600 }}>
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

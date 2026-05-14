'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createSale, type CartItem } from '@/lib/actions/sales'
import { formatCurrency } from '@/lib/utils'

type Product = {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

const CATEGORIES = ['All', 'Print', 'Signage', 'Apparel', 'Design', 'Other']
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
  products,
  search,
  cat,
  onSearch,
  onCat,
  onAdd,
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
      {/* Search + filter */}
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

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10, alignContent: 'start' }}>
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => onAdd(p)}
            style={{
              background: '#181b2e', border: '1.5px solid rgba(255,255,255,.06)',
              cursor: 'pointer', padding: '14px 12px', textAlign: 'left',
              fontFamily: 'Poppins,sans-serif', transition: 'border-color .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#ddb837')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)')}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: '#ddb837', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{p.category}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{p.name}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#ddb837' }}>{formatCurrency(p.price)}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 4 }}>Stock: {p.stock}</div>
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
  cart,
  customerName,
  payment,
  isPending,
  lastRef,
  onUpdateQty,
  onRemove,
  onCustomerName,
  onPayment,
  onCheckout,
}: {
  cart: CartItem[]
  customerName: string
  payment: string
  isPending: boolean
  lastRef: string | null
  onUpdateQty: (id: number, qty: number) => void
  onRemove: (id: number) => void
  onCustomerName: (v: string) => void
  onPayment: (v: string) => void
  onCheckout: () => void
}) {
  const total = cart.reduce((sum, x) => sum + x.unit_price * x.quantity, 0)

  return (
    <div style={{ background: '#181b2e', display: 'flex', flexDirection: 'column', width: 320, flexShrink: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Cart ({cart.length} item{cart.length !== 1 ? 's' : ''})</h2>
      </div>

      {/* Items */}
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
              <button
                onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
                style={{ width: 20, height: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, fontFamily: 'Poppins,sans-serif' }}
              >−</button>
              <span style={{ fontSize: 12, color: '#fff', minWidth: 16, textAlign: 'center' }}>{item.quantity}</span>
              <button
                onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
                style={{ width: 20, height: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1, fontFamily: 'Poppins,sans-serif' }}
              >+</button>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#ddb837', minWidth: 52, textAlign: 'right' }}>{formatCurrency(item.unit_price * item.quantity)}</div>
            <button onClick={() => onRemove(item.product_id)} style={{ background: 'none', border: 'none', color: 'rgba(253,70,130,.7)', cursor: 'pointer', fontSize: 16, padding: '0 2px', lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 20px 20px', borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
        <input
          value={customerName}
          onChange={e => onCustomerName(e.target.value)}
          placeholder="Customer name (Walk-in)"
          style={{ ...inp({ width: '100%', marginBottom: 10 }) }}
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
        <select
          value={payment}
          onChange={e => onPayment(e.target.value)}
          aria-label="Payment method"
          style={{ ...inp({ width: '100%', appearance: 'none', marginBottom: 14, cursor: 'pointer' }) }}
          onFocus={e => (e.target.style.borderColor = '#ddb837')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        >
          {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>TOTAL</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#ddb837' }}>{formatCurrency(total)}</span>
        </div>

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

// ─── Main POS Component ───────────────────────────────────────────────────────
export default function PosClient({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [payment, setPayment] = useState('Cash')
  const [customerName, setCustomerName] = useState('')
  const [isPending, startTransition] = useTransition()
  const [lastRef, setLastRef] = useState<string | null>(null)

  const addToCart = (p: Product) => {
    setCart(c => {
      const existing = c.find(x => x.product_id === p.id)
      if (existing) {
        const inCart = existing.quantity
        const available = p.stock
        if (inCart >= available) { toast.error('Not enough stock'); return c }
        return c.map(x => x.product_id === p.id ? { ...x, quantity: x.quantity + 1 } : x)
      }
      if (p.stock < 1) { toast.error('Out of stock'); return c }
      return [...c, { product_id: p.id, name: p.name, quantity: 1, unit_price: p.price }]
    })
  }

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) removeFromCart(id)
    else setCart(c => c.map(x => x.product_id === id ? { ...x, quantity: qty } : x))
  }

  const removeFromCart = (id: number) => setCart(c => c.filter(x => x.product_id !== id))

  const handleCheckout = () => {
    if (!cart.length) { toast.error('Cart is empty'); return }
    startTransition(async () => {
      const result = await createSale({ items: cart, payment_method: payment, customer_name: customerName || 'Walk-in' })
      if (result?.error) { toast.error(result.error); return }
      setLastRef(result.sale_ref ?? null)
      setCart([])
      setCustomerName('')
      toast.success(`Sale recorded! Ref: ${result.sale_ref}`)
      // Trigger print receipt
      setTimeout(() => window.print(), 300)
    })
  }

  return (
    <>
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
          payment={payment}
          isPending={isPending}
          lastRef={lastRef}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCustomerName={setCustomerName}
          onPayment={setPayment}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Print receipt (hidden on screen, visible on print) */}
      <style>{`
        @media print {
          body > *:not(.receipt) { display: none !important; }
          .receipt {
            display: block !important;
            font-family: monospace;
            font-size: 12px;
            width: 300px;
            margin: 0 auto;
            padding: 16px;
          }
        }
        @media screen { .receipt { display: none; } }
      `}</style>
      {lastRef && (
        <div className="receipt">
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <strong>SEEKANT MULTIMEDIA</strong><br />
            Design. Print. Brand.<br />
            Accra, Ghana<br />
            {new Date().toLocaleString()}<br />
            Ref: <strong>{lastRef}</strong>
          </div>
          <hr />
          {cart.map(i => (
            <div key={i.product_id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{i.name} × {i.quantity}</span>
              <span>{formatCurrency(i.unit_price * i.quantity)}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>TOTAL</span>
            <span>{formatCurrency(cart.reduce((s, i) => s + i.unit_price * i.quantity, 0))}</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            Payment: {payment}<br />
            Thank you for choosing Seekant Multimedia!
          </div>
        </div>
      )}
    </>
  )
}

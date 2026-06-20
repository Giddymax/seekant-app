'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertInventory, deleteInventory } from '@/lib/actions/admin'
import { formatCurrency } from '@/lib/utils'
import ImageUploader from './ImageUploader'

type Item = {
  id: string
  name: string
  category: string
  image_url: string | null
  price: number
  cost_price: number
  stock: number
  threshold: number
  is_service: boolean
}

const BLANK: Omit<Item, 'id'> = { name: '', category: 'Print', image_url: null, price: 0, cost_price: 0, stock: 0, threshold: 10, is_service: false }
const CATEGORIES = ['Print', 'Signage', 'Apparel', 'Design', 'Gifts', 'Other']
const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

export default function InventoryManager({ initialItems, role }: { initialItems: Item[]; role: string }) {
  const [items, setItems] = useState(initialItems)
  const [editing, setEditing] = useState<Partial<Item> | null>(null)
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()
  const isAdmin = role === 'admin'
  const tableHeaders = isAdmin
    ? ['', 'Name', 'Category', 'Cost', 'Selling', 'Margin', 'Stock / Type', '']
    : ['', 'Name', 'Category', 'Cost', 'Selling', 'Margin', 'Stock / Type']

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
  const lowStockCount = items.filter(i => !i.is_service && i.stock <= i.threshold).length

  const handleSave = () => {
    if (!isAdmin) { toast.error('Only admins can manage inventory.'); return }
    if (!editing?.name) { toast.error('Name required'); return }
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(editing).forEach(([k, v]) => fd.append(k, String(v ?? '')))
      const result = await upsertInventory(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Item saved!')
      setEditing(null)
      window.location.reload()
    })
  }

  const handleDelete = (id: string) => {
    if (!isAdmin) { toast.error('Only admins can manage inventory.'); return }
    if (!confirm('Delete this item?')) return
    startTransition(async () => {
      const result = await deleteInventory(id)
      if (result?.error) toast.error(result.error)
      else { toast.success('Deleted'); setItems(s => s.filter(x => x.id !== id)) }
    })
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Inventory</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            {items.length} items
            {lowStockCount > 0 && <> · <span style={{ color: '#fd4682', fontWeight: 700 }}>{lowStockCount} low stock</span></>}
            {!isAdmin && <> · View-only access</>}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setEditing({ ...BLANK })} className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Item</button>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search items…"
          style={{ ...inp, maxWidth: 320 }}
          onFocus={e => (e.target.style.borderColor = '#d42020')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
        />
      </div>

      <div className="admin-table-wrap" style={{ background: '#181b2e' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              {tableHeaders.map((h, i) => (
                <th key={i} className={h === 'Category' || h === 'Cost' || h === 'Margin' || (h === '' && i === 0) ? 'admin-col-secondary' : undefined} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 16px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const lowStock = !item.is_service && item.stock <= item.threshold
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <td className="admin-col-secondary" style={{ padding: '8px 8px 8px 16px', width: 48 }}>
                    {item.image_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={item.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                      : <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        </div>
                    }
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{item.name}</td>
                  <td className="admin-col-secondary" style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{item.category}</td>
                  <td className="admin-col-secondary" style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{formatCurrency(item.cost_price)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#d42020', fontWeight: 700 }}>{formatCurrency(item.price)}</td>
                  <td className="admin-col-secondary" style={{ padding: '12px 16px' }}>
                    {(() => {
                      const profit = item.price - item.cost_price
                      const margin = item.price > 0 ? (profit / item.price) * 100 : 0
                      const color = profit > 0 ? '#22c55e' : profit < 0 ? '#fd4682' : 'rgba(255,255,255,.35)'
                      return <span style={{ fontSize: 11, fontWeight: 700, color }}>{profit > 0 ? '+' : ''}{margin.toFixed(0)}%</span>
                    })()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {item.is_service
                      ? <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: 'rgba(84,185,253,.12)', color: '#54b9fd' }}>SERVICE</span>
                      : <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: lowStock ? '#fd4682' : '#fff', fontWeight: lowStock ? 700 : 400 }}>{item.stock}</span>
                          {lowStock && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', background: 'rgba(253,70,130,.15)', color: '#fd4682' }}>LOW</span>}
                        </div>
                    }
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button onClick={() => setEditing({ ...item })} className="admin-action-btn" style={{ fontSize: 10, padding: '4px 12px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="admin-action-btn" style={{ fontSize: 10, padding: '4px 12px', background: 'rgba(253,70,130,.12)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
            {!filtered.length && (
              <tr><td colSpan={tableHeaders.length} style={{ padding: '32px 20px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {isAdmin && editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div className="admin-modal-inner" style={{ background: '#181b2e', width: '100%', maxWidth: 500, padding: '36px 36px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>{editing.id ? 'Edit Item' : 'New Item'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Service toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: editing.is_service ? 'rgba(84,185,253,.08)' : 'rgba(255,255,255,.03)', border: `1px solid ${editing.is_service ? 'rgba(84,185,253,.25)' : 'rgba(255,255,255,.06)'}` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Service Item</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>Services have no stock — available in POS anytime</div>
                </div>
                <button
                  type="button"
                  aria-label="Toggle service item"
                  onClick={() => setEditing(p => ({ ...p, is_service: !p?.is_service }))}
                  style={{ width: 42, height: 24, background: editing.is_service ? '#54b9fd' : 'rgba(255,255,255,.12)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background .2s', flexShrink: 0 }}
                >
                  <span style={{ position: 'absolute', top: 3, left: editing.is_service ? 20 : 3, width: 18, height: 18, background: '#fff', transition: 'left .2s' }} />
                </button>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Name *</label>
                <input title="Item name" placeholder="e.g. Business Cards" value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Category</label>
                <select title="Category" value={editing.category ?? 'Print'} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} style={{ ...inp, appearance: 'none' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <ImageUploader
                bucket="product-images"
                value={editing.image_url}
                onUpload={url => setEditing(p => ({ ...p, image_url: url }))}
                label="Image (optional)"
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Cost Price (GH₵)</label>
                  <input title="Cost price" type="number" min="0" step="0.01" placeholder="0.00" value={editing.cost_price ?? 0} onChange={e => setEditing(p => ({ ...p, cost_price: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Selling Price (GH₵)</label>
                  <input title="Selling price" type="number" min="0" step="0.01" placeholder="0.00" value={editing.price ?? 0} onChange={e => setEditing(p => ({ ...p, price: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
              </div>
              {(() => {
                const cost = editing.cost_price ?? 0
                const sell = editing.price ?? 0
                const profit = sell - cost
                const margin = sell > 0 ? (profit / sell) * 100 : 0
                const isLoss = profit < 0
                const color = profit > 0 ? '#22c55e' : profit < 0 ? '#fd4682' : 'rgba(255,255,255,.35)'
                return cost > 0 || sell > 0 ? (
                  <div style={{ display: 'flex', gap: 16, padding: '10px 14px', background: isLoss ? 'rgba(253,70,130,.06)' : 'rgba(34,197,94,.06)', border: `1px solid ${isLoss ? 'rgba(253,70,130,.15)' : 'rgba(34,197,94,.15)'}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{isLoss ? 'Loss' : 'Profit'} / Unit</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color }}>{profit > 0 ? '+' : ''}{formatCurrency(profit)}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Margin</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color }}>{margin.toFixed(1)}%</div>
                    </div>
                  </div>
                ) : null
              })()}
              {!editing.is_service && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Stock</label>
                    <input title="Stock quantity" type="number" min="0" placeholder="0" value={editing.stock ?? 0} onChange={e => setEditing(p => ({ ...p, stock: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                  </div>
                </div>
              )}
              {!editing.is_service && (
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Low Stock Threshold</label>
                  <input title="Low stock threshold" type="number" min="0" placeholder="10" value={editing.threshold ?? 10} onChange={e => setEditing(p => ({ ...p, threshold: Number(e.target.value) }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button type="button" onClick={handleSave} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save Item'}</button>
              <button type="button" onClick={() => setEditing(null)} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

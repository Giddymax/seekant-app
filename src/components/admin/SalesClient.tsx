'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateSaleStatus } from '@/lib/actions/sales'
import { formatCurrency } from '@/lib/utils'

type Sale = {
  id: string
  sale_ref: string
  customer_name: string | null
  total: number
  payment_method: string
  status: string
  created_at: string
}

const statusColor: Record<string, string> = {
  Completed: '#22c55e',
  Pending: '#ddb837',
  Cancelled: '#fd4682',
}

export default function SalesClient({ initialSales }: { initialSales: Sale[] }) {
  const [sales, setSales] = useState(initialSales)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = sales.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchSearch = !search || s.sale_ref.toLowerCase().includes(search.toLowerCase()) || (s.customer_name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const totalRevenue = filtered.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.total, 0)

  const handleStatus = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateSaleStatus(id, status)
      if (result?.error) toast.error(result.error)
      else {
        setSales(s => s.map(x => x.id === id ? { ...x, status } : x))
        toast.success('Status updated')
      }
    })
  }

  const exportCSV = () => {
    const headers = ['Ref', 'Customer', 'Amount', 'Payment', 'Status', 'Date']
    const rows = filtered.map(s => [s.sale_ref, s.customer_name ?? '', s.total, s.payment_method, s.status, new Date(s.created_at).toLocaleDateString()])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const inp12 = { padding: '9px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Sales</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            {filtered.length} records · Revenue: <span style={{ color: '#ddb837', fontWeight: 700 }}>{formatCurrency(totalRevenue)}</span>
          </p>
        </div>
        <button onClick={exportCSV} style={{ fontSize: 11, padding: '10px 18px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
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
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inp12, appearance: 'none', cursor: 'pointer', paddingRight: 28 }} onFocus={e => (e.target.style.borderColor = '#ddb837')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
          <option value="all">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div style={{ background: '#181b2e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              {['Ref', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 16px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#ddb837', fontWeight: 700 }}>{s.sale_ref}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{s.customer_name || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#fff', fontWeight: 600 }}>{formatCurrency(s.total)}</td>
                <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{s.payment_method}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: `${statusColor[s.status] ?? '#aaa'}18`, color: statusColor[s.status] ?? '#aaa' }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  {s.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleStatus(s.id, 'Completed')} disabled={isPending} style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(34,197,94,.12)', color: '#22c55e', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Complete</button>
                      <button onClick={() => handleStatus(s.id, 'Cancelled')} disabled={isPending} style={{ fontSize: 9, padding: '3px 8px', background: 'rgba(253,70,130,.12)', color: '#fd4682', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} style={{ padding: '32px 16px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No sales found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

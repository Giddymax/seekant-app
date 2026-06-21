'use client'

import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { updateQuoteStatus, updateQuote, deleteQuote } from '@/lib/actions/admin'

type Quote = {
  id: string
  name: string
  email: string
  phone: string | null
  service_type: string
  quantity: string | null
  deadline: string | null
  details: string
  status: string | null
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:    'rgba(251,191,36,.2)',
  reviewed:   'rgba(84,185,253,.2)',
  quoted:     'rgba(167,139,250,.2)',
  completed:  'rgba(34,197,94,.2)',
  cancelled:  'rgba(253,70,130,.15)',
}
const STATUS_TEXT: Record<string, string> = {
  pending:   '#fbbf24',
  reviewed:  '#54b9fd',
  quoted:    '#a78bfa',
  completed: '#22c55e',
  cancelled: '#fd4682',
}
const STATUSES = ['pending', 'reviewed', 'quoted', 'completed', 'cancelled']

const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }
const lbl = { display: 'block' as const, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.45)', marginBottom: 6 }

function EditModal({ quote, onClose, onSaved }: { quote: Quote; onClose: () => void; onSaved: (updated: Partial<Quote>) => void }) {
  const [form, setForm] = useState({
    name: quote.name,
    email: quote.email,
    phone: quote.phone ?? '',
    service_type: quote.service_type,
    quantity: quote.quantity ?? '',
    deadline: quote.deadline ?? '',
    details: quote.details,
  })
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return }
    startTransition(async () => {
      const result = await updateQuote(quote.id, form)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Quote updated')
      onSaved(form)
      onClose()
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
      <div style={{ background: '#181b2e', width: '100%', maxWidth: 500, padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Edit Quote Request</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="admin-modal-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Name *</label>
              <input title="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
            <div>
              <label style={lbl}>Email *</label>
              <input title="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
          </div>
          <div className="admin-modal-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Phone</label>
              <input title="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
            <div>
              <label style={lbl}>Service Type</label>
              <input title="Service Type" value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
          </div>
          <div className="admin-modal-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={lbl}>Quantity</label>
              <input title="Quantity" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
            <div>
              <label style={lbl}>Deadline</label>
              <input title="Deadline" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} style={inp}
                onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
            </div>
          </div>
          <div>
            <label style={lbl}>Project Details</label>
            <textarea title="Details" rows={5} value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} style={{ ...inp, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<Quote | null>(null)
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState<string>('staff')

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('quote_requests')
      .select('id, name, email, phone, service_type, quantity, deadline, details, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => setQuotes(data ?? []))

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('role').eq('id', user.id).single()
          .then(({ data }) => { if (data?.role) setRole(data.role) })
      }
    })
  }, [])

  const isAdmin = role === 'admin'

  const handleStatus = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateQuoteStatus(id, status)
      if (result?.error) toast.error(result.error)
      else {
        toast.success('Status updated')
        setQuotes(q => q.map(x => x.id === id ? { ...x, status } : x))
      }
    })
  }

  const handleDelete = (q: Quote) => {
    if (!confirm(`Delete quote from "${q.name}"? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteQuote(q.id)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Quote deleted')
      setQuotes(qs => qs.filter(x => x.id !== q.id))
      if (expanded === q.id) setExpanded(null)
    })
  }

  const handleEditSaved = (id: string, updates: Partial<Quote>) => {
    setQuotes(q => q.map(x => x.id === id ? { ...x, ...updates } : x))
  }

  const selectInp = { background: '#111320', border: '1px solid rgba(255,255,255,.1)', color: '#fff', fontSize: 11, fontFamily: 'Poppins,sans-serif', padding: '4px 8px', cursor: 'pointer', outline: 'none' }

  return (
    <div>
      {editing && (
        <EditModal quote={editing} onClose={() => setEditing(null)} onSaved={u => handleEditSaved(editing.id, u)} />
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Quote Requests</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>All quote submissions from the website. Update status to track progress.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUSES.map(s => {
          const count = quotes.filter(q => (q.status ?? 'pending') === s).length
          return (
            <div key={s} style={{ padding: '6px 14px', background: STATUS_COLORS[s] ?? 'rgba(255,255,255,.06)', fontSize: 11, fontWeight: 700, color: STATUS_TEXT[s] ?? '#fff', textTransform: 'capitalize' }}>
              {s} ({count})
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quotes.map(q => {
          const status = q.status ?? 'pending'
          const isOpen = expanded === q.id
          return (
            <div key={q.id} style={{ background: '#181b2e', overflow: 'hidden' }}>
              <div
                className="admin-quote-row"
                onClick={() => setExpanded(isOpen ? null : q.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', background: STATUS_COLORS[status] ?? 'rgba(255,255,255,.08)', color: STATUS_TEXT[status] ?? '#aaa', textTransform: 'capitalize', flexShrink: 0 }}>{status}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{q.name} — <span style={{ color: '#d42020' }}>{q.service_type}</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{q.email}{q.phone ? ` · ${q.phone}` : ''}</div>
                </div>
                <div className="admin-quote-date" style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>{new Date(q.created_at).toLocaleDateString()}</div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="M6 9l6 6 6-6"/></svg>
              </div>

              {isOpen && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="quotes-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, margin: '16px 0' }}>
                    {q.quantity && <div><div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Quantity</div><div style={{ fontSize: 12, color: '#fff' }}>{q.quantity}</div></div>}
                    {q.deadline && <div><div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Deadline</div><div style={{ fontSize: 12, color: '#fff' }}>{q.deadline}</div></div>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Project Details</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.7, background: '#111320', padding: '12px 14px', whiteSpace: 'pre-wrap' }}>{q.details}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Status:</span>
                    <select
                      title="Update status"
                      value={status}
                      disabled={isPending}
                      onChange={e => handleStatus(q.id, e.target.value)}
                      style={selectInp}
                    >
                      {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <a href={`mailto:${q.email}`} style={{ fontSize: 11, padding: '4px 14px', background: 'rgba(221,184,55,.12)', color: '#d42020', textDecoration: 'none', fontFamily: 'Poppins,sans-serif' }}>Reply by Email</a>
                    {isAdmin && (
                      <button type="button" onClick={() => setEditing(q)} className="admin-action-btn"
                        style={{ fontSize: 11, padding: '4px 14px', background: 'rgba(84,185,253,.1)', color: '#54b9fd', border: 'none', fontFamily: 'Poppins,sans-serif' }}>
                        Edit
                      </button>
                    )}
                    {isAdmin && (
                      <button type="button" onClick={() => handleDelete(q)} disabled={isPending} className="admin-action-btn"
                        style={{ fontSize: 11, padding: '4px 14px', background: 'rgba(253,70,130,.1)', color: '#fd4682', border: 'none', fontFamily: 'Poppins,sans-serif' }}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {!quotes.length && <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>No quote requests yet.</p>}
      </div>
    </div>
  )
}

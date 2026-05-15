'use client'

import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { updateQuoteStatus } from '@/lib/actions/admin'

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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('quote_requests')
      .select('id, name, email, phone, service_type, quantity, deadline, details, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => setQuotes(data ?? []))
  }, [])

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

  const inp = { background: '#111320', border: '1px solid rgba(255,255,255,.1)', color: '#fff', fontSize: 11, fontFamily: 'Poppins,sans-serif', padding: '4px 8px', cursor: 'pointer', outline: 'none' }

  return (
    <div>
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
                onClick={() => setExpanded(isOpen ? null : q.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 9px', background: STATUS_COLORS[status] ?? 'rgba(255,255,255,.08)', color: STATUS_TEXT[status] ?? '#aaa', textTransform: 'capitalize', flexShrink: 0 }}>{status}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{q.name} — <span style={{ color: '#d42020' }}>{q.service_type}</span></div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{q.email}{q.phone ? ` · ${q.phone}` : ''}</div>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>{new Date(q.created_at).toLocaleDateString()}</div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><path d="M6 9l6 6 6-6"/></svg>
              </div>

              {isOpen && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, margin: '16px 0' }}>
                    {q.quantity && <div><div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Quantity</div><div style={{ fontSize: 12, color: '#fff' }}>{q.quantity}</div></div>}
                    {q.deadline && <div><div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Deadline</div><div style={{ fontSize: 12, color: '#fff' }}>{q.deadline}</div></div>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Project Details</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', lineHeight: 1.7, background: '#111320', padding: '12px 14px', whiteSpace: 'pre-wrap' }}>{q.details}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Update status:</span>
                    <select
                      title="Update status"
                      value={status}
                      disabled={isPending}
                      onChange={e => handleStatus(q.id, e.target.value)}
                      style={inp}
                    >
                      {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <a href={`mailto:${q.email}`} style={{ fontSize: 11, padding: '4px 14px', background: 'rgba(221,184,55,.12)', color: '#d42020', textDecoration: 'none', fontFamily: 'Poppins,sans-serif' }}>Reply by Email</a>
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

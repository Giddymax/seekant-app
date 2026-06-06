'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { updateComplaintStatus, deleteComplaint } from '@/lib/actions/admin'
import { createClient } from '@/lib/supabase/client'

type Complaint = {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

const STATUSES = ['New', 'In Review', 'Resolved', 'Closed']

const STATUS_COLOR: Record<string, string> = {
  New:        '#d42020',
  'In Review': '#f59e0b',
  Resolved:   '#22c55e',
  Closed:     'rgba(255,255,255,.3)',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState<string>('All')

  const fetchComplaints = () => {
    const supabase = createClient()
    supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error('Failed to load complaints: ' + error.message)
        else setComplaints(data ?? [])
        setLoading(false)
      })
  }

  useEffect(() => { fetchComplaints() }, [])

  const handleStatus = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateComplaintStatus(id, status)
      if (result?.error) toast.error(result.error)
      else {
        toast.success('Status updated')
        setComplaints(c => c.map(x => x.id === id ? { ...x, status } : x))
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this complaint permanently?')) return
    startTransition(async () => {
      const result = await deleteComplaint(id)
      if (result?.error) toast.error(result.error)
      else {
        toast.success('Complaint deleted')
        setComplaints(c => c.filter(x => x.id !== id))
        if (expanded === id) setExpanded(null)
      }
    })
  }

  const visible = filter === 'All' ? complaints : complaints.filter(c => c.status === filter)
  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = complaints.filter(c => c.status === s).length
    return acc
  }, {})

  const inp: React.CSSProperties = {
    padding: '6px 10px', background: '#111320',
    border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
    fontSize: 11, fontFamily: 'inherit', outline: 'none',
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Customer Complaints</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            {complaints.length} total &nbsp;·&nbsp; {counts['New'] ?? 0} new
          </p>
        </div>
        <button type="button" onClick={fetchComplaints} style={{ fontSize: 11, padding: '8px 16px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontFamily: 'inherit' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.04em',
              background: filter === s ? '#d42020' : 'rgba(255,255,255,.05)',
              border: `1px solid ${filter === s ? '#d42020' : 'rgba(255,255,255,.1)'}`,
              color: filter === s ? '#fff' : 'rgba(255,255,255,.5)',
            }}
          >
            {s} {s !== 'All' && counts[s] ? `(${counts[s]})` : s === 'All' ? `(${complaints.length})` : ''}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13 }}>Loading…</p>}

      {!loading && visible.length === 0 && (
        <div style={{ background: '#181b2e', padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 13 }}>No complaints {filter !== 'All' ? `with status "${filter}"` : 'yet'}.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visible.map(c => (
          <div key={c.id} style={{ background: '#181b2e' }}>
            {/* Row header */}
            <div
              className="complaint-row-header"
              style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'center', padding: '14px 20px', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  <span style={{ fontSize: 10, color: STATUS_COLOR[c.status] ?? '#fff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>● {c.status}</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{c.email} &nbsp;·&nbsp; {formatDate(c.created_at)}</span>
              </div>

              {/* Status dropdown */}
              <select
                title="Update complaint status"
                value={c.status}
                onChange={e => { e.stopPropagation(); handleStatus(c.id, e.target.value) }}
                onClick={e => e.stopPropagation()}
                disabled={isPending}
                style={{ ...inp, color: STATUS_COLOR[c.status] ?? '#fff' }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Delete */}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); handleDelete(c.id) }}
                disabled={isPending}
                title="Delete complaint"
                style={{ width: 32, height: 32, background: 'rgba(255,60,60,.08)', border: '1px solid rgba(255,60,60,.2)', color: 'rgba(255,100,100,.7)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                ×
              </button>

              <span style={{ fontSize: 14, color: 'rgba(255,255,255,.3)', transform: expanded === c.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
            </div>

            {/* Expanded message */}
            {expanded === c.id && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, marginTop: 16 }}>Message</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.8, whiteSpace: 'pre-wrap', background: '#111320', padding: '14px 16px' }}>{c.message}</p>
                <div style={{ marginTop: 12 }}>
                  <a
                    href={`mailto:${c.email}?subject=Re: Your complaint`}
                    style={{ fontSize: 11, fontWeight: 700, color: '#d42020', textDecoration: 'none', letterSpacing: '0.05em' }}
                  >
                    ✉ Reply via Email
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

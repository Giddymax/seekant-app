'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createStaffAccount, toggleStaffActive } from '@/lib/actions/admin'

type Staff = {
  id: string
  email: string
  role: string
  full_name: string | null
  active: boolean
  created_at: string
}

const inp = { width: '100%', padding: '10px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none' }

export default function StaffManager({ initialStaff }: { initialStaff: Staff[] }) {
  const [staff, setStaff] = useState(initialStaff)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ email: '', full_name: '', password: '', role: 'staff' })
  const [isPending, startTransition] = useTransition()

  const handleCreate = () => {
    if (!form.email || !form.password) { toast.error('Email and password are required'); return }
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      const result = await createStaffAccount(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Staff account created!')
      setShowNew(false)
      setForm({ email: '', full_name: '', password: '', role: 'staff' })
      window.location.reload()
    })
  }

  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      const result = await toggleStaffActive(id, !active)
      if (result?.error) toast.error(result.error)
      else {
        setStaff(s => s.map(x => x.id === id ? { ...x, active: !active } : x))
        toast.success(active ? 'Account deactivated' : 'Account activated')
      }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Staff Accounts</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Manage team members who can access this portal.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Staff</button>
      </div>

      <div style={{ background: '#181b2e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Joined', ''].map(h => (
                <th key={h} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 20px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{s.full_name || '—'}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.email}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: s.role === 'admin' ? 'rgba(221,184,55,.15)' : 'rgba(84,185,253,.15)', color: s.role === 'admin' ? '#d42020' : '#54b9fd' }}>
                    {s.role}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: s.active ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.08)', color: s.active ? '#22c55e' : '#aaa' }}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <button
                    onClick={() => handleToggle(s.id, s.active)}
                    style={{ fontSize: 10, padding: '4px 12px', background: s.active ? 'rgba(253,70,130,.12)' : 'rgba(34,197,94,.12)', color: s.active ? '#fd4682' : '#22c55e', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}
                  >
                    {s.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {!staff.length && (
              <tr><td colSpan={6} style={{ padding: '32px 20px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No staff accounts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New staff modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
          <div style={{ background: '#181b2e', width: '100%', maxWidth: 480, padding: '36px 36px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Create Staff Account</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Full Name</label>
                <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Password *</label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ ...inp, appearance: 'none' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={handleCreate} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Creating…' : 'Create Account'}</button>
              <button onClick={() => setShowNew(false)} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

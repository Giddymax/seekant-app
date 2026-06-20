'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createStaffAccount, toggleStaffActive, updateStaffAccount, deleteStaffAccount } from '@/lib/actions/admin'

type Staff = {
  id: string
  email: string
  role: string
  full_name: string | null
  active: boolean
  created_at: string
}

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: '#111320',
  border: '1.5px solid rgba(255,255,255,.08)', color: '#fff',
  fontSize: 12, fontFamily: 'inherit', outline: 'none',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6,
}
const modalBox: React.CSSProperties = {
  background: '#181b2e', width: '100%', maxWidth: 480, padding: '36px',
}

type Modal =
  | { type: 'create' }
  | { type: 'edit'; staff: Staff }
  | { type: 'delete'; staff: Staff }
  | null

export default function StaffManager({ initialStaff }: { initialStaff: Staff[] }) {
  const [staff, setStaff]       = useState(initialStaff)
  const [modal, setModal]       = useState<Modal>(null)
  const [createForm, setCreate] = useState({ email: '', full_name: '', password: '', role: 'staff' })
  const [editForm, setEdit]     = useState({ full_name: '', role: 'staff', password: '' })
  const [isPending, startTransition] = useTransition()

  const closeModal = () => setModal(null)

  // ── Create ──────────────────────────────────────────────────
  const handleCreate = () => {
    if (!createForm.email || !createForm.password) { toast.error('Email and password are required'); return }
    startTransition(async () => {
      const fd = new FormData()
      Object.entries(createForm).forEach(([k, v]) => fd.append(k, v))
      const result = await createStaffAccount(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Staff account created!')
      closeModal()
      setCreate({ email: '', full_name: '', password: '', role: 'staff' })
      window.location.reload()
    })
  }

  // ── Edit ────────────────────────────────────────────────────
  const openEdit = (s: Staff) => {
    setEdit({ full_name: s.full_name ?? '', role: s.role, password: '' })
    setModal({ type: 'edit', staff: s })
  }

  const handleEdit = (id: string) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.append('id', id)
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v))
      const result = await updateStaffAccount(fd)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Account updated!')
      setStaff(s => s.map(x => x.id === id
        ? { ...x, full_name: editForm.full_name || null, role: editForm.role }
        : x))
      closeModal()
    })
  }

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteStaffAccount(id)
      if (result?.error) { toast.error(result.error); return }
      toast.success('Account deleted.')
      setStaff(s => s.filter(x => x.id !== id))
      closeModal()
    })
  }

  // ── Toggle active ───────────────────────────────────────────
  const handleToggle = (id: string, active: boolean) => {
    startTransition(async () => {
      const result = await toggleStaffActive(id, !active)
      if (result?.error) { toast.error(result.error); return }
      setStaff(s => s.map(x => x.id === id ? { ...x, active: !active } : x))
      toast.success(active ? 'Account deactivated' : 'Account activated')
    })
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Staff Accounts</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Manage team members who can access this portal.</p>
        </div>
        <button onClick={() => setModal({ type: 'create' })} className="btn btn-gold" style={{ fontSize: 11 }}>+ Add Staff</button>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-wrap" style={{ background: '#181b2e' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className={h === 'Email' || h === 'Joined' ? 'admin-col-secondary' : undefined} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', padding: '14px 20px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#fff', fontWeight: 600 }}>{s.full_name || '—'}</td>
                <td className="admin-col-secondary" style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{s.email}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: s.role === 'admin' ? 'rgba(212,32,32,.15)' : 'rgba(84,185,253,.15)', color: s.role === 'admin' ? '#d42020' : '#54b9fd' }}>
                    {s.role}
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', background: s.active ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.08)', color: s.active ? '#22c55e' : '#aaa' }}>
                    {s.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="admin-col-secondary" style={{ padding: '14px 20px', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{new Date(s.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      className="admin-action-btn"
                      style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(84,185,253,.1)', color: '#54b9fd', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(s.id, s.active)}
                      disabled={isPending}
                      className="admin-action-btn"
                      style={{ fontSize: 10, padding: '4px 10px', background: s.active ? 'rgba(253,70,130,.1)' : 'rgba(34,197,94,.1)', color: s.active ? '#fd4682' : '#22c55e', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal({ type: 'delete', staff: s })}
                      className="admin-action-btn"
                      style={{ fontSize: 10, padding: '4px 10px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!staff.length && (
              <tr><td colSpan={6} style={{ padding: '32px 20px', fontSize: 12, color: 'rgba(255,255,255,.3)', textAlign: 'center' }}>No staff accounts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24, cursor: 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >

          {/* Create modal */}
          {modal.type === 'create' && (
            <div style={modalBox}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 24 }}>Create Staff Account</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Full Name</label>
                  <input value={createForm.full_name} onChange={e => setCreate(f => ({ ...f, full_name: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
                <div>
                  <label style={lbl}>Email *</label>
                  <input type="email" value={createForm.email} onChange={e => setCreate(f => ({ ...f, email: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
                <div>
                  <label style={lbl}>Password *</label>
                  <input type="password" value={createForm.password} onChange={e => setCreate(f => ({ ...f, password: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
                <div>
                  <label style={lbl}>Role</label>
                  <select value={createForm.role} onChange={e => setCreate(f => ({ ...f, role: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={handleCreate} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Creating…' : 'Create Account'}</button>
                <button onClick={closeModal} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Edit modal */}
          {modal.type === 'edit' && (
            <div style={modalBox}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Edit Staff Account</h2>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginBottom: 24 }}>{modal.staff.email}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={lbl}>Full Name</label>
                  <input value={editForm.full_name} onChange={e => setEdit(f => ({ ...f, full_name: e.target.value }))} style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
                <div>
                  <label style={lbl}>Role</label>
                  <select value={editForm.role} onChange={e => setEdit(f => ({ ...f, role: e.target.value }))} style={{ ...inp, appearance: 'none', cursor: 'pointer' }} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>New Password <span style={{ color: 'rgba(255,255,255,.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(leave blank to keep current)</span></label>
                  <input type="password" value={editForm.password} onChange={e => setEdit(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inp} onFocus={e => (e.target.style.borderColor = '#d42020')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button onClick={() => handleEdit(modal.staff.id)} disabled={isPending} className="btn btn-gold" style={{ fontSize: 11 }}>{isPending ? 'Saving…' : 'Save Changes'}</button>
                <button onClick={closeModal} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Delete confirm modal */}
          {modal.type === 'delete' && (
            <div style={modalBox}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>Delete Account?</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.7, marginBottom: 8 }}>
                This will permanently delete the account for:
              </p>
              <div style={{ background: '#111320', padding: '12px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{modal.staff.full_name || '—'}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{modal.staff.email}</p>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,100,100,.7)', marginBottom: 24 }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => handleDelete(modal.staff.id)}
                  disabled={isPending}
                  style={{ fontSize: 11, padding: '11px 22px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: isPending ? 0.7 : 1 }}
                >
                  {isPending ? 'Deleting…' : 'Yes, Delete'}
                </button>
                <button onClick={closeModal} style={{ fontSize: 11, padding: '10px 20px', background: 'rgba(255,255,255,.06)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

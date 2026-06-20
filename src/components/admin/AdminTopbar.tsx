'use client'

export default function AdminTopbar({
  role,
  email,
  onToggleSidebar,
}: {
  role: string
  email: string
  onToggleSidebar?: () => void
}) {
  return (
    <header style={{
      height: 60, background: '#181b2e',
      borderBottom: '1px solid rgba(255,255,255,.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0, zIndex: 10, position: 'relative',
    }}>
      {/* Left — hamburger (mobile) */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="admin-hamburger"
        aria-label="Open menu"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#fff', padding: 6,
          alignItems: 'center', justifyContent: 'center',
          minWidth: 44, minHeight: 44,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Right — role badge + email */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '3px 10px',
          background: role === 'admin' ? 'rgba(221,184,55,.15)' : 'rgba(84,185,253,.15)',
          color: role === 'admin' ? '#d42020' : '#54b9fd',
        }}>
          {role}
        </span>
        <div className="admin-topbar-email" style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{email}</div>
      </div>
    </header>
  )
}

export default function AdminTopbar({ title, role, email }: { title: string; role: string; email: string }) {
  return (
    <header style={{ height: 60, background: '#181b2e', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
      <h1 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '3px 10px',
          background: role === 'admin' ? 'rgba(221,184,55,.15)' : 'rgba(84,185,253,.15)',
          color: role === 'admin' ? '#d42020' : '#54b9fd',
        }}>
          {role}
        </span>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{email}</div>
      </div>
    </header>
  )
}

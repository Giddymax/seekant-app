import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0d1017',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, system-ui, sans-serif', padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ddb837', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#1a181d', marginBottom: 24 }}>SM</div>

      <div style={{ fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,.06)', lineHeight: 1, marginBottom: 8 }}>404</div>

      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12 }}>
        Page not found
      </h1>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, marginBottom: 36, maxWidth: 380 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <Link
        href="/"
        style={{
          padding: '12px 28px', background: '#ddb837', color: '#1a181d',
          fontWeight: 800, fontSize: 12, textDecoration: 'none',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}
      >
        Back to home
      </Link>
    </div>
  )
}

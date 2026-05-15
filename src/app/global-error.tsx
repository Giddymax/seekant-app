'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0d1017', fontFamily: 'system-ui,sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 480 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ddb837', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#1a181d', marginBottom: 24 }}>SM</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Something went wrong</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.6, marginBottom: 28 }}>
            The app hit an unexpected error. This is usually a temporary network or database issue.
          </p>
          <button
            onClick={reset}
            style={{ padding: '12px 28px', background: '#ddb837', color: '#1a181d', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

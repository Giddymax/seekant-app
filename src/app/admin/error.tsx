'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('[Admin error]', error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f18',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, system-ui, sans-serif', padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ddb837', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#1a181d', marginBottom: 24 }}>SM</div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ddb837', marginBottom: 14 }}>Admin Error</div>

      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
        Something went wrong
      </h1>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
        This is usually a temporary connection issue with the database.
        {error.message && error.message !== 'An error occurred in the Server Components render.' && (
          <span style={{ display: 'block', marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: 'rgba(253,70,130,.7)', wordBreak: 'break-all' }}>
            {error.message}
          </span>
        )}
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px', background: '#ddb837', color: '#1a181d',
            border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif',
          }}
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/admin/login')}
          style={{
            padding: '12px 28px', background: 'rgba(255,255,255,.06)', color: '#fff',
            border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif',
          }}
        >
          Sign in again
        </button>
      </div>

      {error.digest && (
        <p style={{ marginTop: 32, fontSize: 10, color: 'rgba(255,255,255,.2)', fontFamily: 'monospace' }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}

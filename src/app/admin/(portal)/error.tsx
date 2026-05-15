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
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, system-ui, sans-serif', padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ maxWidth: 420 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: 'rgba(253,70,130,.15)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fd4682" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
          Page failed to load
        </h2>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, marginBottom: 28 }}>
          This is usually a temporary database or network issue.
          {error.message && error.message !== 'An error occurred in the Server Components render.' && (
            <span style={{ display: 'block', marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: 'rgba(253,70,130,.7)', wordBreak: 'break-all' }}>
              {error.message}
            </span>
          )}
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 22px', background: '#ddb837', color: '#1a181d',
              border: 'none', fontWeight: 800, fontSize: 11, cursor: 'pointer',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif',
            }}
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            style={{
              padding: '10px 22px', background: 'rgba(255,255,255,.06)', color: '#fff',
              border: 'none', fontWeight: 600, fontSize: 11, cursor: 'pointer',
              letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif',
            }}
          >
            Dashboard
          </button>
        </div>

        {error.digest && (
          <p style={{ marginTop: 24, fontSize: 10, color: 'rgba(255,255,255,.15)', fontFamily: 'monospace' }}>
            {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}

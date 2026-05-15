'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', background: '#0d1017',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Poppins, system-ui, sans-serif', padding: '40px 24px', textAlign: 'center',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d42020', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#1a181d', marginBottom: 24 }}>SM</div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d42020', marginBottom: 14 }}>Page Error</div>

      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
        Something went wrong
      </h1>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, marginBottom: 36, maxWidth: 400 }}>
        This is usually a temporary connection issue. Try reloading — if the problem persists, check back shortly.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px', background: '#d42020', color: '#fff',
            border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer',
            letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Poppins,sans-serif',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: '12px 28px', background: 'rgba(255,255,255,.06)', color: '#fff',
            border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
            letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
            fontFamily: 'Poppins,sans-serif',
          }}
        >
          Go home
        </Link>
      </div>

      {error.digest && (
        <p style={{ marginTop: 32, fontSize: 10, color: 'rgba(255,255,255,.2)', fontFamily: 'monospace' }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}

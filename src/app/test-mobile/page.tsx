'use client'

import { useState, useEffect, useRef } from 'react'

export default function MobileTestPage() {
  const [reactCount, setReactCount] = useState(0)
  const [nativeCount, setNativeCount] = useState(0)
  const [formCount, setFormCount] = useState(0)
  const nativeBtnRef = useRef<HTMLButtonElement>(null)

  // Test 2: Native DOM addEventListener (bypasses React event system)
  useEffect(() => {
    const btn = nativeBtnRef.current
    if (!btn) return
    const handler = () => setNativeCount(c => c + 1)
    btn.addEventListener('click', handler)
    return () => btn.removeEventListener('click', handler)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 24 }}>
        Mobile Diagnostics
      </h1>

      {/* Test 1: React onClick */}
      <div style={{ marginBottom: 24, padding: 16, background: '#181b2e' }}>
        <p style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>
          Test 1: React onClick — Count: <strong style={{ color: '#d42020' }}>{reactCount}</strong>
        </p>
        <button
          type="button"
          onClick={() => setReactCount(c => c + 1)}
          style={{ padding: '16px 24px', background: '#d42020', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer', width: '100%' }}
        >
          React onClick
        </button>
      </div>

      {/* Test 2: Native addEventListener */}
      <div style={{ marginBottom: 24, padding: 16, background: '#181b2e' }}>
        <p style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>
          Test 2: Native addEventListener — Count: <strong style={{ color: '#22c55e' }}>{nativeCount}</strong>
        </p>
        <button
          ref={nativeBtnRef}
          type="button"
          style={{ padding: '16px 24px', background: '#22c55e', color: '#000', border: 'none', fontSize: 16, cursor: 'pointer', width: '100%' }}
        >
          Native addEventListener
        </button>
      </div>

      {/* Test 3: HTML form (no JS needed) */}
      <div style={{ marginBottom: 24, padding: 16, background: '#181b2e' }}>
        <p style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>
          Test 3: HTML form submit — Count: <strong style={{ color: '#54b9fd' }}>{formCount}</strong>
        </p>
        <form onSubmit={(e) => { e.preventDefault(); setFormCount(c => c + 1) }}>
          <button
            type="submit"
            style={{ padding: '16px 24px', background: '#54b9fd', color: '#000', border: 'none', fontSize: 16, cursor: 'pointer', width: '100%' }}
          >
            Form onSubmit
          </button>
        </form>
      </div>

      {/* Test 4: Plain anchor (always works) */}
      <div style={{ padding: 16, background: '#181b2e' }}>
        <p style={{ color: '#fff', fontSize: 14, marginBottom: 8 }}>
          Test 4: Plain link (should always work)
        </p>
        <a
          href="/test-mobile?clicked=yes"
          style={{ display: 'block', padding: '16px 24px', background: '#ddb837', color: '#000', fontSize: 16, fontWeight: 700, textAlign: 'center', textDecoration: 'none', width: '100%' }}
        >
          Plain Link (reload page)
        </a>
      </div>

      <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, marginTop: 24 }}>
        JS loaded: {typeof window !== 'undefined' ? 'YES' : 'NO'} |
        React hydrated: YES (you see this) |
        URL: {typeof window !== 'undefined' ? window.location.search : ''}
      </p>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

export default function MobileTestPage() {
  const [hydrated, setHydrated] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setHydrated(true)

    // Also add a raw DOM listener to the document as proof JS runs
    const marker = document.getElementById('js-marker')
    if (marker) marker.textContent = 'JS IS RUNNING'
    if (marker) marker.style.background = '#22c55e'
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
        Mobile Debug
      </h1>

      {/* This div will be changed by useEffect if JS runs */}
      <div
        id="js-marker"
        style={{
          padding: 16,
          background: '#d42020',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        JS NOT RUNNING
      </div>

      <div style={{
        padding: 16,
        background: hydrated ? '#22c55e' : '#d42020',
        color: '#fff',
        fontSize: 16,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 16,
      }}>
        React hydrated: {hydrated ? 'YES' : 'NO'}
      </div>

      <p style={{ color: '#fff', fontSize: 20, marginBottom: 16 }}>
        Count: {count}
      </p>

      <button
        type="button"
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '20px 32px',
          background: '#54b9fd',
          color: '#000',
          border: 'none',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          marginBottom: 16,
        }}
      >
        TAP ME (+1)
      </button>

      <a
        href="/"
        style={{
          display: 'block',
          padding: '20px 32px',
          background: '#ddb837',
          color: '#000',
          fontSize: 18,
          fontWeight: 700,
          textAlign: 'center',
          textDecoration: 'none',
        }}
      >
        Go Home (plain link)
      </a>
    </div>
  )
}

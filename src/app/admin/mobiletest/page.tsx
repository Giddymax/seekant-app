'use client'

import { useState } from 'react'

export default function MobileTestPage() {
  const [count, setCount] = useState(0)
  const [color, setColor] = useState('#fff')

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'Poppins,sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
        Test WITHOUT AdminShell
      </h1>
      <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginBottom: 24 }}>
        This page does NOT use AdminShell. If buttons work here but not at /admin/test, the issue is AdminShell.
      </p>

      <p style={{ color: '#d42020', fontSize: 24, fontWeight: 800, marginBottom: 20 }}>
        Count: {count}
      </p>

      <button
        type="button"
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '20px 32px',
          background: '#d42020',
          color: '#fff',
          border: 'none',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 16,
          display: 'block',
          width: '100%',
        }}
      >
        TAP ME (+1)
      </button>

      <button
        type="button"
        onClick={() => setColor(c => c === '#fff' ? '#22c55e' : '#fff')}
        style={{
          padding: '20px 32px',
          background: 'rgba(255,255,255,.1)',
          color: color,
          border: '2px solid ' + color,
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'block',
          width: '100%',
        }}
      >
        TAP TO CHANGE COLOR
      </button>
    </div>
  )
}

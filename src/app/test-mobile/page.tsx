'use client'

import { useState } from 'react'

export default function MobileTestPage() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
        Mobile Test - Clean
      </h1>

      <p style={{ color: '#d42020', fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
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
          display: 'block',
          width: '100%',
          marginBottom: 16,
        }}
      >
        TAP ME (+1)
      </button>

      <button
        type="button"
        onClick={() => setCount(0)}
        style={{
          padding: '20px 32px',
          background: '#22c55e',
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
        RESET TO 0
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
        Go Home
      </a>
    </div>
  )
}

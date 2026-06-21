'use client'

import { useState } from 'react'

export default function MobileTestPage() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f18', padding: 24, fontFamily: 'Poppins,sans-serif' }}>
      <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
        Test OUTSIDE /admin
      </h1>
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
          display: 'block',
          width: '100%',
        }}
      >
        TAP ME (+1)
      </button>
    </div>
  )
}

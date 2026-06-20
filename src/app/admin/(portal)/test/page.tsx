'use client'

import { useState } from 'react'

export default function AdminTestPage() {
  const [count, setCount] = useState(0)
  const [color, setColor] = useState('#fff')

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
        Mobile Button Test
      </h1>

      <p style={{ color: '#fff', fontSize: 16, marginBottom: 20 }}>
        Count: {count}
      </p>

      <button
        type="button"
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '16px 32px',
          background: '#d42020',
          color: '#fff',
          border: 'none',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 12,
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
          padding: '16px 32px',
          background: 'rgba(255,255,255,.1)',
          color: color,
          border: '2px solid ' + color,
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'block',
          width: '100%',
        }}
      >
        TAP TO CHANGE COLOR
      </button>

      <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, marginTop: 20 }}>
        If these buttons work on your phone, the issue is with specific page content.
        If they don&apos;t work, the issue is with AdminShell layout.
      </p>
    </div>
  )
}

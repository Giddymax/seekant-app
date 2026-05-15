'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function NewsletterBar() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) { toast.error('Enter a valid email address'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    setEmail('')
    toast.success('You\'re subscribed — thanks!')
  }

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,.08)',
      padding: '32px 48px',
      maxWidth: 1280,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 20,
    }}>
      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Stay <em style={{ color: '#d42020' }}>in the Loop</em>
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
          Get printing tips, exclusive offers, and news from Seekant Multimedia.
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          style={{
            padding: '12px 18px', fontSize: 13, border: 'none', outline: 'none',
            background: 'rgba(255,255,255,.08)', color: '#fff', width: 260,
            fontFamily: 'Poppins,sans-serif',
          }}
        />
        <button
          type="submit"
          className="btn btn-gold"
          disabled={loading}
          style={{ fontSize: 11, padding: '12px 22px', borderRadius: 0, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '…' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}

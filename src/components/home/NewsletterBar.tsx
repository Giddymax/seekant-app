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
    <div className="newsletter-wrap">
      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Stay <em style={{ color: '#d42020' }}>in the Loop</em>
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
          Get printing tips, exclusive offers, and news from Seekant Multimedia.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          style={{
            padding: '12px 18px', fontSize: 13, border: 'none', outline: 'none',
            background: 'rgba(255,255,255,.08)', color: '#fff', flex: 1, minWidth: 180,
            fontFamily: 'Poppins,sans-serif',
          }}
        />
        <button
          type="submit"
          className="btn btn-gold"
          disabled={loading}
          style={{ fontSize: 11, padding: '12px 22px', borderRadius: 0, opacity: loading ? 0.7 : 1, flexShrink: 0 }}
        >
          {loading ? '…' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}

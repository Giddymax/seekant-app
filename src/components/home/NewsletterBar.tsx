'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { submitComplaint } from '@/lib/actions/admin'

export default function NewsletterBar() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('name', name)
    fd.append('email', email)
    fd.append('message', message)
    const result = await submitComplaint(fd)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Your complaint has been submitted. We\'ll get back to you shortly.')
      setName('')
      setEmail('')
      setMessage('')
    }
  }

  return (
    <div className="newsletter-wrap" style={{ flexDirection: 'column', gap: 20, padding: '40px 48px' }}>
      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
          Have a <em style={{ color: '#d42020' }}>Complaint?</em>
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
          We take every concern seriously. Fill in the form and our team will respond promptly.
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 560 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            required
            className="newsletter-input"
            style={{
              flex: 1, minWidth: 140, padding: '11px 16px', fontSize: 13, border: 'none', outline: 'none',
              background: 'rgba(255,255,255,.08)', color: '#fff',
              fontFamily: 'var(--brand-font, Poppins, sans-serif)',
            }}
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="newsletter-input"
            style={{
              flex: 1, minWidth: 140, padding: '11px 16px', fontSize: 13, border: 'none', outline: 'none',
              background: 'rgba(255,255,255,.08)', color: '#fff',
              fontFamily: 'var(--brand-font, Poppins, sans-serif)',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe your complaint or concern…"
            required
            rows={3}
            style={{
              flex: 1, padding: '11px 16px', fontSize: 13, border: 'none', outline: 'none', resize: 'vertical',
              background: 'rgba(255,255,255,.08)', color: '#fff',
              fontFamily: 'var(--brand-font, Poppins, sans-serif)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{ fontSize: 11, padding: '12px 26px', borderRadius: 0, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending…' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  )
}

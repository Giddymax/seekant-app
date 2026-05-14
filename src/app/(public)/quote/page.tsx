'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { quoteSchema, type QuoteFormData } from '@/lib/validations'
import { submitQuote } from '@/lib/actions/quote'
import { createBrowserClient } from '@supabase/ssr'

const SERVICES = [
  'Business Cards', 'Letterheads', 'Flyers & Brochures', 'Banners & Signage',
  'Roll-Up Banners', 'Vehicle Branding', 'Custom Jerseys', 'Screen Printing',
  'Polo Shirts & Caps', 'Embroidery', 'Book Printing', 'Branding & Design',
  'Mug Printing', 'ID Card Printing', 'Souvenir Printing', 'Other',
]

const field = (label: string, required = false) => (
  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#737a80', marginBottom: 6 }}>
    {label}{required && <span style={{ color: '#fd4682' }}> *</span>}
  </label>
)

const inputStyle = {
  width: '100%', padding: '12px 16px', fontSize: 13, border: '1.5px solid #e5e7eb',
  outline: 'none', fontFamily: 'Poppins,sans-serif', background: '#fff',
  transition: 'border-color .2s',
}

export default function QuotePage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10 MB'); return }

    setUploading(true)
    setAttachmentUrl(null)
    setAttachmentName(file.name)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const ext = file.name.split('.').pop()
    const path = `quote-attachments/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from('uploads').upload(path, file, { upsert: false })
    setUploading(false)

    if (error || !data) {
      toast.error('File upload failed — please try again')
      setAttachmentName(null)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(data.path)
    setAttachmentUrl(publicUrl)
    toast.success('File attached')
  }

  const onSubmit = async (data: QuoteFormData) => {
    setLoading(true)
    const details = attachmentUrl
      ? `${data.details}\n\nAttachment: ${attachmentUrl}`
      : data.details
    const result = await submitQuote({ ...data, details })
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      setDone(true)
      reset()
      setAttachmentUrl(null)
      setAttachmentName(null)
      toast.success('Quote request sent! We\'ll be in touch within 24 hours.')
    }
  }

  return (
    <>
      <div style={{ marginTop: 68, background: '#15212c', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#ddb837' }}>Get a Quote</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>Free Quote</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>Get a Quote</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>Fill in the form and we&apos;ll get back to you within 24 hours with a free, no-obligation quote.</p>
        </div>
      </div>

      <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 48px' }}>

          {done ? (
            <div style={{ background: '#fff', padding: '64px 48px', textAlign: 'center', borderTop: '4px solid #ddb837' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(221,184,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ddb837" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a181d', marginBottom: 12 }}>Quote Request Sent!</h2>
              <p style={{ fontSize: 14, color: '#737a80', lineHeight: 1.8, marginBottom: 32 }}>
                Thank you! We&apos;ve received your request and will get back to you within 24 hours. A confirmation has been sent to your email.
              </p>
              <button onClick={() => setDone(false)} className="btn btn-dark">Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#fff', padding: '48px 48px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  {field('Full Name', true)}
                  <input {...register('name')} placeholder="e.g. Kwame Asante" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#ddb837')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                  {errors.name && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
                </div>
                <div>
                  {field('Email Address', true)}
                  <input {...register('email')} type="email" placeholder="you@example.com" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#ddb837')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                  {errors.email && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  {field('Phone Number')}
                  <input {...register('phone')} placeholder="+233 XX XXX XXXX" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#ddb837')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  {field('Service Type', true)}
                  <select {...register('service_type')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => (e.target.style.borderColor = '#ddb837')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  >
                    <option value="">Select a service…</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service_type && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.service_type.message}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  {field('Estimated Quantity')}
                  <input {...register('quantity')} placeholder="e.g. 500 copies" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#ddb837')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  {field('Required By Date')}
                  <input {...register('deadline')} type="date" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#ddb837')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                {field('Project Details', true)}
                <textarea {...register('details')} rows={5} placeholder="Describe your project — size, colours, finish, special requirements…" style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = '#ddb837')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
                {errors.details && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.details.message}</p>}
              </div>

              {/* File attachment */}
              <div style={{ marginBottom: 32 }}>
                {field('Attach Reference File')}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '1.5px dashed #e5e7eb', padding: '20px', cursor: 'pointer', textAlign: 'center', background: attachmentUrl ? 'rgba(221,184,55,.04)' : '#fafafa', transition: 'border-color .2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#ddb837')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = attachmentUrl ? '#ddb837' : '#e5e7eb')}
                >
                  {uploading ? (
                    <p style={{ fontSize: 12, color: '#737a80' }}>Uploading…</p>
                  ) : attachmentUrl ? (
                    <div>
                      <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginBottom: 4 }}>✓ {attachmentName}</p>
                      <p style={{ fontSize: 11, color: '#737a80' }}>Click to replace</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 12, color: '#737a80', marginBottom: 4 }}>Click to upload artwork or reference</p>
                      <p style={{ fontSize: 11, color: '#b0b7be' }}>PDF, AI, JPG, PNG, CDR — max 10 MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  title="Attach reference file"
                  accept=".pdf,.ai,.jpg,.jpeg,.png,.cdr,.psd,.zip"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-gold" disabled={loading || uploading} style={{ width: '100%', fontSize: 13, padding: '16px', opacity: loading || uploading ? 0.7 : 1 }}>
                {loading ? 'Sending…' : 'Send Quote Request'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}

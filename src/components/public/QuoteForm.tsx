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
  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-text, #737a80)', marginBottom: 6 }}>
    {label}{required && <span style={{ color: '#fd4682' }}> *</span>}
  </label>
)

const inputStyle = {
  width: '100%', padding: '12px 16px', fontSize: 13, border: '1.5px solid #e5e7eb',
  outline: 'none', fontFamily: 'var(--brand-font, Poppins, sans-serif)', background: '#fff',
  transition: 'border-color .2s',
}

function buildWhatsAppUrl(number: string, data: QuoteFormData, attachmentUrl: string | null): string {
  const clean = number.replace(/[\s+\-() ]/g, '')
  const lines = [
    '*New Quote Request — Seekant Multimedia*',
    '',
    `*Name:* ${data.name}`,
    `*Email:* ${data.email}`,
    data.phone ? `*Phone:* ${data.phone}` : null,
    `*Service:* ${data.service_type}`,
    data.quantity ? `*Quantity:* ${data.quantity}` : null,
    data.deadline ? `*Deadline:* ${data.deadline}` : null,
    '',
    `*Details:*\n${data.details}`,
    attachmentUrl ? `\n*Attachment:* ${attachmentUrl}` : null,
  ].filter(Boolean).join('\n')
  return `https://wa.me/${clean}?text=${encodeURIComponent(lines)}`
}

export default function QuoteForm({ whatsappNumber, heroImage = '', heroTag = '', heroTitle = '', heroSubtitle = '' }: { whatsappNumber: string; heroImage?: string; heroTag?: string; heroTitle?: string; heroSubtitle?: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [waUrl, setWaUrl] = useState<string | null>(null)
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
      return
    }

    if (whatsappNumber) {
      const url = buildWhatsAppUrl(whatsappNumber, data, attachmentUrl)
      setWaUrl(url)
      window.open(url, '_blank', 'noopener,noreferrer')
    }

    setDone(true)
    reset()
    setAttachmentUrl(null)
    setAttachmentName(null)
    toast.success("Quote request sent! We'll be in touch within 24 hours.")
  }

  return (
    <>
      <div style={{ marginTop: 68, background: heroImage ? `url(${heroImage})` : '#15212c', backgroundSize: 'cover', backgroundPosition: 'center', padding: '88px 0 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: heroImage ? 'rgba(0,0,0,.62)' : 'linear-gradient(135deg,rgba(221,184,55,.18),rgba(84,185,253,.1))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'rgba(255,255,255,.4)' }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: '#d42020' }}>Get a Quote</span>
          </div>
          <span className="section-tag" style={{ marginBottom: 20, display: 'inline-block' }}>{heroTag || 'Free Quote'}</span>
          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>{heroTitle || 'Get a Quote'}</h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 15, maxWidth: 560, lineHeight: 1.8 }}>{heroSubtitle || 'Fill in the form and we\'ll get back to you within 24 hours with a free, no-obligation quote.'}</p>
        </div>
      </div>

      <section style={{ padding: '64px 0 88px', background: '#f7f8fa' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 48px' }}>

          {done ? (
            <div style={{ background: '#fff', padding: '64px 48px', textAlign: 'center', borderTop: '4px solid #d42020' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(221,184,55,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d42020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-heading, #1a181d)', marginBottom: 12 }}>Quote Request Sent!</h2>
              <p style={{ fontSize: 14, color: 'var(--brand-text, #737a80)', lineHeight: 1.8, marginBottom: 28 }}>
                Thank you! We&apos;ve received your request and will get back to you within 24 hours. A confirmation has been sent to your email.
              </p>
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: '#25d366', color: '#fff', padding: '14px 28px',
                    fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
                    textDecoration: 'none', marginBottom: 16,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Also Send via WhatsApp
                </a>
              )}
              <div>
                <button onClick={() => { setDone(false); setWaUrl(null) }} className="btn btn-dark">Submit Another</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#fff', padding: '48px 48px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  {field('Full Name', true)}
                  <input {...register('name')} placeholder="e.g. Kwame Asante" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                  {errors.name && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
                </div>
                <div>
                  {field('Email Address', true)}
                  <input {...register('email')} type="email" placeholder="you@example.com" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                  {errors.email && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                <div>
                  {field('Phone Number')}
                  <input {...register('phone')} placeholder="+233 XX XXX XXXX" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  {field('Service Type', true)}
                  <select {...register('service_type')} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
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
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
                <div>
                  {field('Required By Date')}
                  <input {...register('deadline')} type="date" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#d42020')}
                    onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                {field('Project Details', true)}
                <textarea {...register('details')} rows={5} placeholder="Describe your project — size, colours, finish, special requirements…" style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = '#d42020')}
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
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = '#d42020')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = attachmentUrl ? '#d42020' : '#e5e7eb')}
                >
                  {uploading ? (
                    <p style={{ fontSize: 12, color: 'var(--brand-text, #737a80)' }}>Uploading…</p>
                  ) : attachmentUrl ? (
                    <div>
                      <p style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, marginBottom: 4 }}>✓ {attachmentName}</p>
                      <p style={{ fontSize: 11, color: 'var(--brand-text, #737a80)' }}>Click to replace</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--brand-text, #737a80)', marginBottom: 4 }}>Click to upload artwork or reference</p>
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

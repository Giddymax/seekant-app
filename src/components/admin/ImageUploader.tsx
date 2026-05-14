'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'

type Props = {
  bucket: string
  value?: string | null
  onUpload: (url: string) => void
  label?: string
}

export default function ImageUploader({ bucket, value, onUpload, label = 'Image' }: Props) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }

    setUploading(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    setUploading(false)

    if (error || !data) { toast.error('Upload failed — ' + (error?.message ?? 'unknown error')); return }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)
    onUpload(publicUrl)
    toast.success('Image uploaded')
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: '#111320', border: '1.5px solid rgba(255,255,255,.08)',
    color: '#fff', fontSize: 12, fontFamily: 'Poppins,sans-serif', outline: 'none',
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 6,
  }

  return (
    <div>
      <label style={lbl}>{label}</label>

      {/* Current preview */}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', marginBottom: 8, opacity: 0.85 }} />
      )}

      {/* Upload zone */}
      <div
        onClick={() => !uploading && ref.current?.click()}
        style={{
          border: '1.5px dashed rgba(255,255,255,.15)', padding: '14px',
          textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
          background: 'rgba(255,255,255,.02)', marginBottom: 8,
          transition: 'border-color .15s',
        }}
        onMouseEnter={e => { if (!uploading) (e.currentTarget as HTMLDivElement).style.borderColor = '#ddb837' }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.15)' }}
      >
        <p style={{ fontSize: 11, color: uploading ? '#ddb837' : 'rgba(255,255,255,.4)', margin: 0 }}>
          {uploading ? 'Uploading…' : value ? 'Click to replace image' : 'Click to upload image (max 5 MB)'}
        </p>
      </div>
      <input
        ref={ref}
        type="file"
        title={`Upload ${label}`}
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      {/* Manual URL fallback */}
      <input
        title={`${label} URL`}
        value={value ?? ''}
        onChange={e => onUpload(e.target.value)}
        placeholder="or paste URL directly"
        style={inp}
        onFocus={e => (e.target.style.borderColor = '#ddb837')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
      />
    </div>
  )
}

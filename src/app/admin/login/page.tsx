'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { signIn } from '@/lib/actions/auth'

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    const result = await signIn(data)
    setLoading(false)
    if (result?.error) toast.error(result.error)
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0d0f18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px 60px', fontFamily: 'Poppins,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, background: '#d42020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#1a181d', letterSpacing: '-0.02em' }}>SM</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>SEEKANT</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="login-card" style={{ background: '#181b2e', borderTop: '3px solid #d42020' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Sign In</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 32 }}>Access the management dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@seekantmultimedia.com"
                autoComplete="email"
                style={{ width: '100%', padding: '12px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif', outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              {errors.email && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ width: '100%', padding: '12px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 13, fontFamily: 'Poppins,sans-serif', outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              {errors.password && <p style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#d42020', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Poppins,sans-serif', transition: 'opacity .2s' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Hint box */}
          <div style={{ marginTop: 28 }}>
            <button
              onClick={() => setShowHint(h => !h)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.35)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: 'Poppins,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              First time setup
            </button>
            {showHint && (
              <div style={{ marginTop: 12, background: '#111320', padding: '14px 16px', borderLeft: '2px solid rgba(221,184,55,.4)', fontSize: 11, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>
                Create your admin account via the Supabase Dashboard → Authentication → Users → Add User, then run:<br />
                <code style={{ color: '#d42020', fontSize: 10 }}>INSERT INTO profiles (id, email, role) VALUES ('&lt;uid&gt;', 'admin@example.com', 'admin');</code>
              </div>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,.2)' }}>
          © 2026 Seekant Multimedia
        </p>
      </div>
    </div>
  )
}

'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { signInWithForm, type SignInFormState } from '@/lib/actions/auth'

const INITIAL_STATE: SignInFormState = {}

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(signInWithForm, INITIAL_STATE)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (state.error) toast.error(state.error)
  }, [state.error])

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

          <form action={formAction}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="admin-email" style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                placeholder=""
                autoComplete="email"
                inputMode="email"
                required
                defaultValue={state.email ?? ''}
                aria-invalid={Boolean(state.fieldErrors?.email)}
                aria-describedby={state.fieldErrors?.email ? 'admin-email-error' : undefined}
                style={{ width: '100%', minHeight: 48, padding: '13px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 16, fontFamily: 'Poppins,sans-serif', outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              {state.fieldErrors?.email && <p id="admin-email-error" style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{state.fieldErrors.email}</p>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label htmlFor="admin-password" style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                placeholder=""
                autoComplete="current-password"
                required
                minLength={6}
                aria-invalid={Boolean(state.fieldErrors?.password)}
                aria-describedby={state.fieldErrors?.password ? 'admin-password-error' : undefined}
                style={{ width: '100%', minHeight: 48, padding: '13px 14px', background: '#111320', border: '1.5px solid rgba(255,255,255,.08)', color: '#fff', fontSize: 16, fontFamily: 'Poppins,sans-serif', outline: 'none', transition: 'border-color .2s' }}
                onFocus={e => (e.target.style.borderColor = '#d42020')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,.08)')}
              />
              {state.fieldErrors?.password && <p id="admin-password-error" style={{ color: '#fd4682', fontSize: 11, marginTop: 4 }}>{state.fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              style={{ width: '100%', minHeight: 48, padding: '14px', background: '#d42020', color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1, fontFamily: 'Poppins,sans-serif', transition: 'opacity .2s', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Hint box */}
          <div style={{ marginTop: 28 }}>
            <button
              onClick={() => setShowHint(h => !h)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.35)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: 'Poppins,sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              .
            </button>
            {showHint && (
              <div style={{ marginTop: 12, background: '#111320', padding: '14px 16px', borderLeft: '2px solid rgba(221,184,55,.4)', fontSize: 11, color: 'rgba(255,255,255,.5)', lineHeight: 1.7 }}>
                Create your admin account via the Supabase Dashboard → Authentication → Users → Add User, then run:<br />
                <code style={{ color: '#d42020', fontSize: 10 }}>{"INSERT INTO profiles (id, email, role) VALUES ('<uid>', 'admin@example.com', 'admin');"}</code>
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

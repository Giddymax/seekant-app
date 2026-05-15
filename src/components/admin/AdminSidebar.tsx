'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', adminOnly: false },
  { href: '/admin/pos', label: 'Point of Sale', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', adminOnly: false },
  { href: '/admin/sales', label: 'Sales', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', adminOnly: false },
  { href: '/admin/inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', adminOnly: false },
  { href: '/admin/analytics', label: 'Analytics', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', adminOnly: true },
  { href: '/admin/content', label: 'Site Content', icon: 'M4 6h16M4 12h16M4 18h7', adminOnly: true },
  { href: '/admin/hero', label: 'Hero Slides', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', adminOnly: true },
  { href: '/admin/gallery', label: 'Works & Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h.01', adminOnly: true },
  { href: '/admin/services', label: 'Services', icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18', adminOnly: true },
  { href: '/admin/blog', label: 'Blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', adminOnly: true },
  { href: '/admin/quotes', label: 'Quote Requests', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', adminOnly: false },
  { href: '/admin/social', label: 'Social Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', adminOnly: true },
  { href: '/admin/theme', label: 'Theme', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', adminOnly: true },
  { href: '/admin/staff', label: 'Staff Accounts', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', adminOnly: true },
]

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const nav = role === 'admin' ? ADMIN_NAV : ADMIN_NAV.filter(n => !n.adminOnly)

  return (
    <aside className="admin-sidebar" style={{ width: 220, minHeight: '100vh', background: '#111320', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ padding: '24px 14px 20px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Seekant" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', background: '#fff', flexShrink: 0 }} />
          <div className="admin-sidebar-logotext">
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>SEEKANT</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,.35)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                fontSize: 12, fontWeight: active ? 700 : 500,
                color: active ? '#d42020' : 'rgba(255,255,255,.5)',
                background: active ? 'rgba(212,32,32,.08)' : 'transparent',
                borderLeft: active ? '2px solid #d42020' : '2px solid transparent',
                textDecoration: 'none', transition: 'all .15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={icon} />
              </svg>
              <span className="admin-sidebar-label">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,.35)', textDecoration: 'none', marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          <span className="admin-sidebar-footer-label">View Site</span>
        </Link>
        <form action={signOut}>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Poppins,sans-serif', transition: 'color .15s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            <span className="admin-sidebar-footer-label">Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

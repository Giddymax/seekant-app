'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminShell({
  role,
  email,
  children,
}: {
  role: string
  email: string
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0f18', fontFamily: 'Poppins,sans-serif' }}>
      {/* Mobile overlay — tap to close */}
      <div
        className={`admin-sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <AdminSidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTopbar
          role={role}
          email={email}
          onToggleSidebar={() => setSidebarOpen(s => !s)}
        />
        <main className="admin-main-padding" style={{ flex: 1, padding: '28px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

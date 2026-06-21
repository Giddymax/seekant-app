'use client'

import { useState, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

const SidebarContext = createContext<{
  open: boolean
  toggle: () => void
  close: () => void
}>({ open: false, toggle: () => {}, close: () => {} })

export function useSidebar() {
  return useContext(SidebarContext)
}

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

  const ctx = {
    open: sidebarOpen,
    toggle: () => setSidebarOpen(s => !s),
    close: () => setSidebarOpen(false),
  }

  return (
    <SidebarContext.Provider value={ctx}>
      <div
        className="admin-shell-outer"
        style={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
          background: '#0d0f18',
          fontFamily: 'Poppins,sans-serif',
        }}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-overlay open"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AdminSidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div
          className="admin-content-col"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <AdminTopbar
            role={role}
            email={email}
            onToggleSidebar={() => setSidebarOpen(s => !s)}
          />
          <main
            className="admin-main-padding"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 28,
              minHeight: 0,
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

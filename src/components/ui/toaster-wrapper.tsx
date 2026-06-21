'use client'

import { useEffect, useState } from 'react'

export default function ToasterWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Lazy import to avoid SSR hydration mismatch from next-themes
  const { Toaster } = require('@/components/ui/sonner')
  return <Toaster richColors position="top-right" />
}

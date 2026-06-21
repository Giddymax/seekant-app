import type { Metadata, Viewport } from 'next'
import ThemeProvider from '@/components/ThemeProvider'
import ToasterWrapper from '@/components/ui/toaster-wrapper'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Seekant Multimedia – Design. Print. Brand.',
  description:
    'Professional printing, branding, and design services in Asuom, Eastern Region, Ghana. Business cards, banners, jerseys, and more.',
  keywords: 'printing, branding, design, Ghana, Asuom, Kwaebibirim, Eastern Region, business cards, banners, jerseys',
  openGraph: {
    title: 'Seekant Multimedia – Design. Print. Brand.',
    description: 'Your trusted printing and branding partner in Asuom, Eastern Region, Ghana.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider />
        {children}
        <ToasterWrapper />
      </body>
    </html>
  )
}

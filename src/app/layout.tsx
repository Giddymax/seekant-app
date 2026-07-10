import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import ThemeProvider from '@/components/ThemeProvider'
import { SITE_URL } from '@/lib/site'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#d42020',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Seekant Multimedia – Design. Print. Brand.',
  description:
    'Professional printing, branding, and design services in Asuom, Eastern Region, Ghana. Business cards, banners, jerseys, and more.',
  keywords: 'printing, branding, design, Ghana, Asuom, Kwaebibirim, Eastern Region, business cards, banners, jerseys',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Seekant',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
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
        <Toaster richColors position="top-right" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        ` }} />
      </body>
    </html>
  )
}

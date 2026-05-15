import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

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
      <body className={`${poppins.className} min-h-full flex flex-col antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

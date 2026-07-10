import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Footer from '@/components/layout/Footer'
import LocalBusinessSchema from '@/components/layout/LocalBusinessSchema'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LocalBusinessSchema />
      <NavbarWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

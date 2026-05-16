import NavbarWrapper from '@/components/layout/NavbarWrapper'
import Footer from '@/components/layout/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

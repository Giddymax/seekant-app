import { createClient } from '@/lib/supabase/server'
import Navbar from './Navbar'

const DEFAULT_NAV = [
  { label: 'Home',      href: '/' },
  { label: 'About',     href: '/about' },
  { label: 'Services',  href: '/services' },
  { label: 'Products',  href: '/products' },
  { label: 'Our Works', href: '/works' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Blog',      href: '/blog' },
  { label: 'Contacts',  href: '/contacts' },
]

export default async function NavbarWrapper() {
  const supabase = await createClient()
  const keys = Array.from({ length: 8 }, (_, i) => [`nav_${i + 1}_label`, `nav_${i + 1}_url`]).flat()
  const { data } = await supabase.from('site_content').select('key,value').in('key', keys)

  let navItems = DEFAULT_NAV
  if (data && data.length > 0) {
    const map = Object.fromEntries(data.map(r => [r.key, r.value]))
    const items = Array.from({ length: 8 }, (_, i) => {
      const label = map[`nav_${i + 1}_label`]
      const href  = map[`nav_${i + 1}_url`]
      if (!label || !href) return null
      return { label, href }
    }).filter(Boolean) as { label: string; href: string }[]
    if (items.length > 0) navItems = items
  }

  return <Navbar navItems={navItems} />
}

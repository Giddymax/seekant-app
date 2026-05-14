import { createClient } from '@/lib/supabase/server'
import HeroSlideManager from '@/components/admin/HeroSlideManager'

export const metadata = { title: 'Hero Slides – Seekant Admin' }

export default async function HeroPage() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true })

  return <HeroSlideManager initialSlides={slides ?? []} />
}

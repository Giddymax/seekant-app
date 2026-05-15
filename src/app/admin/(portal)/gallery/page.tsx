import { createClient } from '@/lib/supabase/server'
import GalleryManager from '@/components/admin/GalleryManager'

export const metadata = { title: 'Works & Gallery – Seekant Admin' }

export default async function GalleryAdminPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('gallery_items')
    .select('id, image_url, label, category, sort_order, active')
    .order('sort_order')

  return <GalleryManager initialItems={items ?? []} />
}

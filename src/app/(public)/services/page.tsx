import { createClient } from '@/lib/supabase/server'
import ServicesClientPage from '@/components/public/ServicesClientPage'

export const metadata = { title: 'Our Services – Seekant Multimedia' }

export default async function ServicesPage() {
  const supabase = await createClient()
  const [{ data: services }, { data: contentRows }] = await Promise.all([
    supabase.from('services').select('*').eq('active', true).order('sort_order'),
    supabase.from('site_content').select('key,value').in('key', ['page_hero_services_image', 'page_header_services_tag', 'page_header_services_title', 'page_header_services_subtitle']),
  ])
  const c = Object.fromEntries((contentRows ?? []).map(r => [r.key, r.value]))

  return (
    <ServicesClientPage
      services={services ?? []}
      heroImage={c.page_hero_services_image || ''}
      heroTag={c.page_header_services_tag || ''}
      heroTitle={c.page_header_services_title || ''}
      heroSubtitle={c.page_header_services_subtitle || ''}
    />
  )
}

import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/home/HeroSlider'
import ServicesGrid from '@/components/home/ServicesGrid'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import PortfolioStrip from '@/components/home/PortfolioStrip'
import BlogPreview from '@/components/home/BlogPreview'
import FaqAccordion from '@/components/home/FaqAccordion'

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: slides }, { data: services }, { data: posts }] = await Promise.all([
    supabase.from('hero_slides').select('*').eq('active', true).order('sort_order'),
    supabase.from('services').select('*').eq('active', true).order('sort_order').limit(12),
    supabase.from('blog_posts').select('*').eq('status', 'Published').order('published_at', { ascending: false }).limit(3),
  ])

  return (
    <>
      <HeroSlider slides={slides ?? []} />
      <ServicesGrid services={services ?? []} />
      <WhyChooseUs />
      <PortfolioStrip />
      <BlogPreview posts={posts ?? []} />
      <FaqAccordion />
    </>
  )
}

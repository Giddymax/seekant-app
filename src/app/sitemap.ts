import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/products', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/works', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/gallery', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/contacts', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/quote', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/info/design', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/info/printing', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/info/publishing', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()
  const [{ data: services }, { data: posts }] = await Promise.all([
    supabase.from('services').select('slug').eq('active', true),
    supabase.from('blog_posts').select('slug,published_at').eq('status', 'Published'),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }))

  const serviceEntries: MetadataRoute.Sitemap = (services ?? []).map(({ slug }) => ({
    url: `${SITE_URL}/services/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const blogEntries: MetadataRoute.Sitemap = (posts ?? []).map(({ slug, published_at }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: published_at ? new Date(published_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...serviceEntries, ...blogEntries]
}

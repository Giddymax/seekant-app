import { createClient } from '@/lib/supabase/server'
import BlogManager from '@/components/admin/BlogManager'

export const metadata = { title: 'Blog – Seekant Admin' }

export default async function BlogAdminPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id,title,slug,category,status,published_at')
    .order('created_at', { ascending: false })

  return <BlogManager initialPosts={posts ?? []} />
}

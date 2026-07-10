'use server'

import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

async function isCurrentUserAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin' && profile?.active !== false
}

// ── SERVICES ──────────────────────────────────────────────
export async function upsertService(fd: FormData) {
  const supabase = await createClient()
  const id = fd.get('id') as string | null
  const name = fd.get('name') as string
  const payload = {
    name,
    slug: (fd.get('slug') as string) || slugify(name),
    category: fd.get('category') as string,
    description: fd.get('description') as string || null,
    image_url: fd.get('image_url') as string || null,
    sort_order: Number(fd.get('sort_order') ?? 0),
    active: fd.get('active') === 'true',
  }
  const { error } = id
    ? await supabase.from('services').update(payload).eq('id', id)
    : await supabase.from('services').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/services')
  revalidatePath('/admin/services')
  return { success: true }
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/services')
  revalidatePath('/admin/services')
  return { success: true }
}

// ── BLOG ──────────────────────────────────────────────────
export async function upsertBlog(fd: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const id = fd.get('id') as string | null
  const title = fd.get('title') as string
  const status = fd.get('status') as string
  const payload = {
    title,
    slug: (fd.get('slug') as string) || slugify(title),
    category: fd.get('category') as string || null,
    excerpt: fd.get('excerpt') as string || null,
    content: fd.get('content') as string || null,
    cover_url: fd.get('cover_url') as string || null,
    status,
    published_at: status === 'Published' ? (fd.get('published_at') as string || new Date().toISOString()) : null,
    author_id: user?.id,
  }
  const { error } = id
    ? await supabase.from('blog_posts').update(payload).eq('id', id)
    : await supabase.from('blog_posts').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}

export async function deleteBlog(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}

// ── SITE CONTENT ──────────────────────────────────────────
export async function saveSiteContent(values: Record<string, string>) {
  const supabase = await createClient()
  const entries = Object.entries(values).map(([key, value]) => ({ key, value }))
  if (!entries.length) return { success: true }
  const { error } = await supabase
    .from('site_content')
    .upsert(entries, { onConflict: 'key' })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/admin/content')
  revalidatePath('/admin/theme')
  revalidatePath('/admin/pages')
  revalidatePath('/admin/legal')
  revalidatePath('/terms')
  revalidatePath('/privacy')
  return { success: true }
}

// ── SOCIAL LINKS ──────────────────────────────────────────
function normalizeExternalUrl(url: string) {
  const value = url.trim()
  if (!value) return ''
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`

  try {
    const parsed = new URL(candidate)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : ''
  } catch {
    return ''
  }
}

export async function upsertSocialLink(fd: FormData) {
  const supabase = await createClient()
  const id = fd.get('id') as string | null
  const label = (fd.get('label') as string) || null
  const rawPlatform = fd.get('platform') as string
  const platform = rawPlatform || `custom-${slugify(label ?? '')}-${Date.now().toString(36)}`
  const url = normalizeExternalUrl(fd.get('url') as string)
  if (!url) return { error: 'Enter a valid URL.' }

  const payload = { platform, label, url }
  const { error } = id
    ? await supabase.from('social_links').update(payload).eq('id', id)
    : await supabase.from('social_links').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/admin/content')
  return { success: true }
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('social_links').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/admin/content')
  return { success: true }
}

export async function reorderSocialLinks(orderedIds: string[]) {
  const supabase = await createClient()
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from('social_links').update({ sort_order: index }).eq('id', id))
  )
  const error = results.find(r => r.error)?.error
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  revalidatePath('/admin/content')
  return { success: true }
}

// ── HERO SLIDES ───────────────────────────────────────────
export async function upsertHeroSlide(fd: FormData) {
  const supabase = await createClient()
  const id = fd.get('id') as string | null
  const payload = {
    heading: fd.get('heading') as string,
    subtext: fd.get('subtext') as string || null,
    tag: fd.get('tag') as string || null,
    btn1_label: fd.get('btn1_label') as string || null,
    btn1_href: fd.get('btn1_href') as string || null,
    btn2_label: fd.get('btn2_label') as string || null,
    btn2_href: fd.get('btn2_href') as string || null,
    image_url: fd.get('image_url') as string || null,
    sort_order: Number(fd.get('sort_order') ?? 0),
    active: fd.get('active') === 'true',
  }
  const { error } = id
    ? await supabase.from('hero_slides').update(payload).eq('id', id)
    : await supabase.from('hero_slides').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/hero')
  return { success: true }
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('hero_slides').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/hero')
  return { success: true }
}

// ── INVENTORY ─────────────────────────────────────────────
export async function upsertInventory(fd: FormData) {
  const supabase = await createClient()
  if (!(await isCurrentUserAdmin(supabase))) {
    return { error: 'Only admins can manage inventory.' }
  }

  const id = fd.get('id') as string | null
  const isService = fd.get('is_service') === 'true'
  const payload = {
    name: fd.get('name') as string,
    category: fd.get('category') as string,
    image_url: (fd.get('image_url') as string) || null,
    price: Number(fd.get('price') ?? 0),
    cost_price: Number(fd.get('cost_price') ?? 0),
    stock: isService ? 0 : Number(fd.get('stock') ?? 0),
    threshold: isService ? 0 : Number(fd.get('threshold') ?? 10),
    is_service: isService,
  }
  const { error } = id
    ? await supabase.from('inventory').update(payload).eq('id', id)
    : await supabase.from('inventory').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/admin/inventory')
  revalidatePath('/admin/pos')
  return { success: true }
}

export async function deleteInventory(id: string) {
  const supabase = await createClient()
  if (!(await isCurrentUserAdmin(supabase))) {
    return { error: 'Only admins can manage inventory.' }
  }

  const { error } = await supabase.from('inventory').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/inventory')
  return { success: true }
}

// ── GALLERY ───────────────────────────────────────────────
export async function upsertGalleryItem(fd: FormData) {
  const supabase = await createClient()
  const id = fd.get('id') as string | null
  const payload = {
    image_url: fd.get('image_url') as string,
    label: fd.get('label') as string || null,
    category: fd.get('category') as string || null,
    sort_order: Number(fd.get('sort_order') ?? 0),
    active: fd.get('active') === 'true',
  }
  const { error } = id
    ? await supabase.from('gallery_items').update(payload).eq('id', id)
    : await supabase.from('gallery_items').insert(payload)
  if (error) return { error: error.message }
  revalidatePath('/gallery')
  revalidatePath('/works')
  revalidatePath('/')
  revalidatePath('/admin/gallery')
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('gallery_items').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/gallery')
  revalidatePath('/works')
  revalidatePath('/')
  revalidatePath('/admin/gallery')
  return { success: true }
}

// ── QUOTES ────────────────────────────────────────────────
export async function updateQuoteStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('quote_requests').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/quotes')
  return { success: true }
}

export async function updateQuote(id: string, fields: {
  name?: string
  email?: string
  phone?: string
  service_type?: string
  quantity?: string
  deadline?: string
  details?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('quote_requests').update(fields).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/quotes')
  return { success: true }
}

export async function deleteQuote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('quote_requests').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/quotes')
  return { success: true }
}

// ── STAFF ACCOUNTS ────────────────────────────────────────
export async function createStaffAccount(fd: FormData) {
  const supabase = createAdminClient()
  const email = fd.get('email') as string
  const password = fd.get('password') as string
  const full_name = fd.get('full_name') as string || null
  const role = (fd.get('role') as string) || 'staff'

  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authErr || !authData.user) return { error: authErr?.message ?? 'Failed to create user' }

  const { error: profileErr } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    username: email.split('@')[0],
    full_name,
    role,
    active: true,
  })
  if (profileErr) return { error: profileErr.message }
  revalidatePath('/admin/staff')
  return { success: true }
}

export async function toggleStaffActive(id: string, active: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/staff')
  return { success: true }
}

export async function updateStaffAccount(fd: FormData) {
  const id        = fd.get('id') as string
  const full_name = (fd.get('full_name') as string) || null
  const role      = (fd.get('role') as string) || 'staff'
  const password  = (fd.get('password') as string) || ''

  const supabase = createAdminClient()

  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ full_name, role })
    .eq('id', id)
  if (profileErr) return { error: profileErr.message }

  if (password) {
    const { error: pwErr } = await supabase.auth.admin.updateUserById(id, { password })
    if (pwErr) return { error: pwErr.message }
  }

  revalidatePath('/admin/staff')
  return { success: true }
}

export async function deleteStaffAccount(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) return { error: error.message }
  revalidatePath('/admin/staff')
  return { success: true }
}

// ── COMPLAINTS ────────────────────────────────────────────
export async function submitComplaint(fd: FormData) {
  const supabase = await createClient()
  const name    = (fd.get('name') as string)?.trim()
  const email   = (fd.get('email') as string)?.trim()
  const message = (fd.get('message') as string)?.trim()

  if (!name || !email || !message) return { error: 'All fields are required.' }
  if (!email.includes('@')) return { error: 'Please enter a valid email address.' }

  const { error } = await supabase.from('complaints').insert({ name, email, message })
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateComplaintStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('complaints').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/complaints')
  return { success: true }
}

export async function deleteComplaint(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('complaints').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/complaints')
  return { success: true }
}

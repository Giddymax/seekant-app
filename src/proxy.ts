import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_HOME_PATH = '/admin/dashboard'
const STAFF_HOME_PATH = '/admin/pos'

const ADMIN_ONLY_PATHS = [
  '/admin/dashboard',
  '/admin/summary',
  '/admin/analytics',
  '/admin/content',
  '/admin/hero',
  '/admin/services',
  '/admin/blog',
  '/admin/social',
  '/admin/theme',
  '/admin/staff',
  '/admin/gallery',
  '/admin/pages',
  '/admin/legal',
]

function pathMatches(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow public routes and block admin
  if (!url || !key || url.includes('placeholder')) {
    const { pathname } = request.nextUrl
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          toSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const getRole = async () => {
    if (!user) return 'staff'
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role ?? 'staff'
  }

  // Protect all /admin/* except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Role-gate admin-only routes.
    if (ADMIN_ONLY_PATHS.some(p => pathMatches(pathname, p))) {
      const role = await getRole()
      if (role !== 'admin') {
        return NextResponse.redirect(new URL(STAFF_HOME_PATH, request.url))
      }
    }
  }

  // Redirect logged-in user away from login page
  if (pathname === '/admin/login' && user) {
    const role = await getRole()
    return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_HOME_PATH : STAFF_HOME_PATH, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}

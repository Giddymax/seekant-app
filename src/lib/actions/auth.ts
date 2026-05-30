'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, type LoginFormData } from '@/lib/validations'

export type SignInFormState = {
  error?: string
  fieldErrors?: Partial<Record<keyof LoginFormData, string>>
  email?: string
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  let homePath = '/admin/pos'
  const user = data.user
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') homePath = '/admin/dashboard'
  }

  redirect(homePath)
}

export async function signInWithForm(
  _prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const validated = loginSchema.safeParse({ email, password })

  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors

    return {
      email,
      fieldErrors: {
        email: errors.email?.[0],
        password: errors.password?.[0],
      },
      error: errors.email?.[0] ?? errors.password?.[0] ?? 'Check your login details.',
    }
  }

  const result = await signIn(validated.data)
  return result ?? {}
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  return profile
}

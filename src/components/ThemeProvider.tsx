import { createClient } from '@/lib/supabase/server'

const DEFAULTS = {
  theme_dark: '#15212c',
  theme_gold: '#d42020',
  theme_pink: '#fd4682',
  theme_blue: '#54b9fd',
  theme_teal: '#315c5a',
}

function isValidHex(val: string) {
  return /^#[0-9a-fA-F]{3,8}$/.test(val.trim())
}

export default async function ThemeProvider() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key,value')
    .in('key', Object.keys(DEFAULTS))

  const t = { ...DEFAULTS }
  for (const row of data ?? []) {
    if (row.key in t && isValidHex(row.value)) {
      t[row.key as keyof typeof t] = row.value.trim()
    }
  }

  const css = `:root{--brand-dark:${t.theme_dark};--brand-gold:${t.theme_gold};--brand-pink:${t.theme_pink};--brand-blue:${t.theme_blue};--brand-teal:${t.theme_teal}}`

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

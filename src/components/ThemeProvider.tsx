import { createClient } from '@/lib/supabase/server'

const DEFAULTS = {
  theme_dark:          '#15212c',
  theme_gold:          '#d42020',
  theme_pink:          '#fd4682',
  theme_blue:          '#54b9fd',
  theme_teal:          '#315c5a',
  theme_font_family:   'Poppins',
  theme_text_color:    '#737a80',
  theme_heading_color: '#1a181d',
}

// Whitelisted fonts → Google Fonts weight string
const ALLOWED_FONTS: Record<string, string> = {
  'Poppins':          '300;400;500;600;700;800;900',
  'Inter':            '300;400;500;600;700;800;900',
  'Montserrat':       '300;400;500;600;700;800;900',
  'Raleway':          '300;400;500;600;700;800;900',
  'Open Sans':        '300;400;500;600;700;800',
  'Nunito':           '300;400;500;600;700;800;900',
  'Lato':             '300;400;700;900',
  'Playfair Display': '400;500;600;700;800;900',
  'DM Sans':          '300;400;500;600;700',
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
    if (row.key in t) t[row.key as keyof typeof t] = row.value.trim()
  }

  // Validate colors
  const dark    = isValidHex(t.theme_dark)          ? t.theme_dark          : DEFAULTS.theme_dark
  const gold    = isValidHex(t.theme_gold)          ? t.theme_gold          : DEFAULTS.theme_gold
  const pink    = isValidHex(t.theme_pink)          ? t.theme_pink          : DEFAULTS.theme_pink
  const blue    = isValidHex(t.theme_blue)          ? t.theme_blue          : DEFAULTS.theme_blue
  const teal    = isValidHex(t.theme_teal)          ? t.theme_teal          : DEFAULTS.theme_teal
  const text    = isValidHex(t.theme_text_color)    ? t.theme_text_color    : DEFAULTS.theme_text_color
  const heading = isValidHex(t.theme_heading_color) ? t.theme_heading_color : DEFAULTS.theme_heading_color

  // Validate font (must be in allowlist)
  const fontName = t.theme_font_family in ALLOWED_FONTS ? t.theme_font_family : 'Poppins'
  const weights  = ALLOWED_FONTS[fontName]
  const fontSlug = fontName.replace(/\s+/g, '+')
  const fontUrl  = `https://fonts.googleapis.com/css2?family=${fontSlug}:wght@${weights}&display=swap`

  const css = [
    ':root{',
    `--brand-dark:${dark};`,
    `--brand-gold:${gold};`,
    `--brand-pink:${pink};`,
    `--brand-blue:${blue};`,
    `--brand-teal:${teal};`,
    `--brand-font:'${fontName}',sans-serif;`,
    `--brand-text:${text};`,
    `--brand-heading:${heading};`,
    '}',
  ].join('')

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={fontUrl} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  )
}

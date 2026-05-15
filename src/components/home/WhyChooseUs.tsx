import { createClient } from '@/lib/supabase/server'

const DEFAULTS = [
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Fast Turnaround',
    body: 'Most orders ready in 24–72 hours. Rush jobs available. We never compromise quality for speed.',
  },
  {
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    title: 'Premium Quality',
    body: 'State-of-the-art equipment and premium materials. Every print is colour-accurate, sharp, and long-lasting.',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Competitive Pricing',
    body: 'Transparent pricing with no hidden fees. Volume discounts available. Value for every budget.',
  },
]

export default async function WhyChooseUs() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key,value')
    .in('key', ['why_1_title', 'why_1_body', 'why_2_title', 'why_2_body', 'why_3_title', 'why_3_body'])

  const map: Record<string, string> = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))

  const features = DEFAULTS.map((def, i) => ({
    icon: def.icon,
    title: map[`why_${i + 1}_title`] || def.title,
    body:  map[`why_${i + 1}_body`]  || def.body,
  }))

  return (
    <section style={{ background: '#f7f8fa', padding: '88px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-tag">Why Us</span>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: '#1a181d', letterSpacing: '-0.025em', marginTop: 16 }}>
            Why Choose Seekant?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
          {features.map(({ icon, title, body }) => (
            <div key={title} style={{ background: '#fff', padding: '40px 36px', textAlign: 'center' }} className="card-shadow">
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'rgba(221,184,55,.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d42020" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a181d', marginBottom: 12 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#737a80', lineHeight: 1.8 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

import { createClient } from '@/lib/supabase/server'
import FaqList from './FaqList'

const DEFAULTS = [
  { q: 'What types of printing services do you offer?', a: 'We offer a full range of printing services including business cards, letterheads, flyers, brochures, banners, vehicle branding, book printing, ID cards, and much more — over 36 services in total.' },
  { q: 'How long does it take to complete an order?', a: "Standard orders are typically ready within 24–72 hours. Rush orders can be accommodated for an additional fee. Large or complex orders may require more time — we'll confirm the timeline when you get a quote." },
  { q: 'Can I get a price quote for my print job?', a: "Absolutely! Fill out our online quote form or walk into our shop. We'll assess your requirements and provide a transparent, no-obligation quote within a few hours." },
  { q: 'Can you design or help me design my print job?', a: 'Yes! Our in-house design team can create your artwork from scratch or refine your existing files. Design services are quoted separately depending on the complexity of the project.' },
  { q: 'Can you scan my hardcopy originals into electronic form?', a: 'Yes, we offer scanning and digitisation services. We can scan documents, photos, and artworks to high-resolution digital files in PDF, JPG, or PNG format.' },
]

export default async function FaqAccordion() {
  const supabase = await createClient()
  const keys = Array.from({ length: 5 }, (_, i) => [`faq_${i + 1}_q`, `faq_${i + 1}_a`]).flat()
  const { data } = await supabase.from('site_content').select('key,value').in('key', keys)
  const map: Record<string, string> = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))

  const faqs = DEFAULTS.map((def, i) => ({
    q: map[`faq_${i + 1}_q`] || def.q,
    a: map[`faq_${i + 1}_a`] || def.a,
  }))

  return (
    <section style={{ padding: '88px 0', background: '#f7f8fa' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-tag">FAQ</span>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: '#1a181d', letterSpacing: '-0.025em', marginTop: 16 }}>
            Frequently Asked Questions
          </h2>
        </div>
        <FaqList faqs={faqs} />
      </div>
    </section>
  )
}

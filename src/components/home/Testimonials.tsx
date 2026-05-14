const TESTIMONIALS = [
  {
    name: 'Kwame Asante',
    role: 'CEO, Asante Group',
    quote: 'Seekant Multimedia delivered our full brand identity in record time. The quality of the business cards and letterheads was exceptional. Highly recommend!',
    initials: 'KA',
  },
  {
    name: 'Ama Darkwah',
    role: 'Event Coordinator',
    quote: 'We ordered 50 roll-up banners for our trade fair and they were perfect — vivid colours, great finish, and delivered a day early. Will always use Seekant.',
    initials: 'AD',
  },
  {
    name: 'GreenTech Ltd.',
    role: 'Corporate Client',
    quote: 'The vehicle branding on our fleet is outstanding. People stop us on the road to ask about our company. Best investment we\'ve made in our brand.',
    initials: 'GT',
  },
]

const STARS = Array(5).fill('M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z')

export default function Testimonials() {
  return (
    <section style={{ padding: '88px 0', background: '#15212c' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="section-tag">Testimonials</span>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', marginTop: 16 }}>
            What Our Clients Say
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
          {TESTIMONIALS.map(({ name, role, quote, initials }) => (
            <div key={name} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', padding: '36px 32px' }}>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                {STARS.map((d, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#ddb837">
                    <path d={d} />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.72)', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>
                &ldquo;{quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#ddb837', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#1a181d', flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', letterSpacing: '0.04em' }}>{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

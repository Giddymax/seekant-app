const STATS = [
  { value: '500+', label: 'Projects Completed' },
  { value: '10+',  label: 'Years Experience' },
  { value: '200+', label: 'Happy Clients' },
  { value: '36',   label: 'Services Offered' },
]

export default function StatsBar() {
  return (
    <section style={{ background: '#15212c', padding: '48px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
        {STATS.map(({ value, label }, i) => (
          <div key={label} style={{
            textAlign: 'center', padding: '20px 16px',
            borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,.1)' : 'none',
          }}>
            <div style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 900, color: '#ddb837', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 8 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

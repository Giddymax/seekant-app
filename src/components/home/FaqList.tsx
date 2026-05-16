type Faq = { q: string; a: string }

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq-list">
      {faqs.map((faq, i) => (
        <details key={i} className="faq-item">
          <summary className="faq-summary">
            <span style={{ flex: 1 }}>{faq.q}</span>
            <svg
              className="faq-icon"
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="#d42020" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                flexShrink: 0,
                transition: 'transform 0.2s',
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="faq-answer">
            {faq.a}
          </div>
        </details>
      ))}
    </div>
  )
}

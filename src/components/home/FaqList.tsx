'use client'

import { useState } from 'react'

type Faq = { q: string; a: string }

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          marginBottom: 12,
          overflow: 'hidden',
        }}>
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '20px 24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: '#1a181d',
              textAlign: 'left',
              fontFamily: 'Poppins, sans-serif',
              lineHeight: 1.5,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ flex: 1 }}>{faq.q}</span>
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="#d42020" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                flexShrink: 0,
                transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {openIdx === i && (
            <div style={{
              padding: '0 24px 22px',
              fontSize: 13,
              color: '#737a80',
              lineHeight: 1.8,
            }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

'use client'

export default function PrintButton({ label = 'Print Report' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-gold"
      style={{ minHeight: 40, fontSize: 11, padding: '12px 18px' }}
    >
      {label}
    </button>
  )
}

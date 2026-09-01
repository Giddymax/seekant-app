// Shared receipt-printing helper used by the POS and Sales admin screens.
// Both "Print" (thermal) and "Save PDF" open the *same* physical page size —
// 80mm wide, auto height — so the output matches a real 80mm receipt-roll
// printer edge-to-edge (no A4 margins, no wasted paper), and matches the
// dimensions of an 80mm receipt PDF (e.g. SEL-87729896.pdf: 227.04pt ≈ 80mm wide).

export type PrintMode = 'thermal' | 'pdf'

const BASE_CSS = `
*{box-sizing:border-box}
@page{size:80mm auto;margin:0}
body{font-family:'Courier New',monospace;margin:0;padding:3mm 3mm;width:80mm;background:#fff;color:#000}
img{display:block;margin:0 auto 4px}
div{word-break:break-word}
table{width:100%;border-collapse:collapse}
td{vertical-align:top;padding:1px 0}
`

const MODE_CSS: Record<PrintMode, string> = {
  // Straight to the receipt printer — tight font/line-height for an 80mm roll.
  thermal: `${BASE_CSS}body{font-size:10px;line-height:1.4}img{max-width:70px}`,
  // Save-as-PDF copy — same 80mm width, slightly roomier for on-screen reading.
  pdf: `${BASE_CSS}body{font-size:11px;line-height:1.5}img{max-width:90px}`,
}

type PrintResult = { ok: true } | { ok: false; error: string }

/** Opens `node`'s current markup in a popup sized to the receipt and sends it to print. */
export function printReceipt(mode: PrintMode, node: HTMLElement | null, title: string): PrintResult {
  const content = node?.innerHTML || ''
  if (!content) return { ok: false, error: 'Nothing to print' }

  const base = window.location.origin
  const win = window.open('', '_blank', 'width=400,height=700')
  if (!win) return { ok: false, error: 'Enable popups to print' }

  win.document.write(`<html><head><title>${title}</title><base href="${base}/"><style>${MODE_CSS[mode]}</style></head><body>${content}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => { win.print(); win.close() }, 400)
  return { ok: true }
}

// Shared receipt-printing helper used by the POS and Sales admin screens.
// Both "Print" (thermal) and "Save PDF" open the *same* physical page size —
// 80mm wide, auto height — so the output matches a real 80mm receipt-roll
// printer edge-to-edge (no A4 margins, no wasted paper), and matches the
// dimensions of an 80mm receipt PDF (e.g. SEL-87729896.pdf: 227.04pt ≈ 80mm wide).
//
// Printing goes through a hidden same-page <iframe> rather than window.open().
// window.open() is silently killed by popup blockers on a lot of mobile
// browsers (and increasingly desktop ones) with no error the app can catch —
// the button just does nothing. An iframe never triggers a popup blocker
// because no new window/tab is created.

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

const FRAME_ID = 'receipt-print-frame'

function getPrintFrame(): HTMLIFrameElement {
  let frame = document.getElementById(FRAME_ID) as HTMLIFrameElement | null
  if (!frame) {
    frame = document.createElement('iframe')
    frame.id = FRAME_ID
    // Off-screen but present in the DOM — required for print() to work in most browsers.
    Object.assign(frame.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0' })
    document.body.appendChild(frame)
  }
  return frame
}

/** Renders `node`'s current markup into a hidden iframe and sends it to print. */
export function printReceipt(mode: PrintMode, node: HTMLElement | null, title: string): PrintResult {
  const content = node?.innerHTML || ''
  if (!content) return { ok: false, error: 'Nothing to print' }

  const frame = getPrintFrame()
  const doc = frame.contentWindow?.document
  if (!doc) return { ok: false, error: 'Could not prepare receipt for printing' }

  doc.open()
  doc.write(`<html><head><title>${title}</title><style>${MODE_CSS[mode]}</style></head><body>${content}</body></html>`)
  doc.close()

  const win = frame.contentWindow as Window
  let printed = false
  const doPrint = () => { if (printed) return; printed = true; win.focus(); win.print() }

  // Wait for the logo image to finish loading inside the iframe before printing,
  // so it isn't cut from the printout — with a timeout fallback either way.
  const imgs = Array.from(doc.images)
  const pending = imgs.filter(img => !img.complete)
  if (pending.length) {
    let remaining = pending.length
    const settle = () => { if (--remaining <= 0) doPrint() }
    pending.forEach(img => { img.addEventListener('load', settle); img.addEventListener('error', settle) })
    setTimeout(doPrint, 1200)
  } else {
    setTimeout(doPrint, 150)
  }

  return { ok: true }
}

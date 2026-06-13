// Per-buyer PDF stamping: overlays "Licensed to <email>" on every page footer.
// Light anti-sharing measure; regenerates in ~1-2s from the master PDF.
import { promises as fs } from 'fs'
import path from 'path'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { KIT } from './config'

export async function stampedKitPdf(email: string, orderRef: string): Promise<Uint8Array> {
  const master = await fs.readFile(path.join(process.cwd(), KIT.pdfPath))
  const doc = await PDFDocument.load(master)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const text = `Licensed to ${email}  ·  Order ${orderRef}  ·  Personal use only`
  const size = 6.5
  const pages = doc.getPages()
  for (let i = 1; i < pages.length; i++) { // skip cover
    const p = pages[i]
    const w = p.getWidth()
    const tw = font.widthOfTextAtSize(text, size)
    p.drawText(text, {
      x: (w - tw) / 2,
      y: 14,
      size,
      font,
      color: rgb(0.55, 0.55, 0.55),
    })
  }
  doc.setTitle(KIT.name)
  doc.setAuthor('PAYE Calculator Kenya')
  doc.setSubject(`Licensed to ${email}`)
  return doc.save()
}

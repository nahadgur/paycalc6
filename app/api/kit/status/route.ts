// Polled by the checkout UI. When the provider confirms payment we mint a
// signed download token and (best-effort) send the delivery email.
import { NextRequest, NextResponse } from 'next/server'
import { KIT } from '@/lib/kit/config'
import { mintToken } from '@/lib/kit/token'
import { sendKitEmail } from '@/lib/kit/email'
import { paymentStatus } from '@/lib/kit/providers/intasend'
import { transactionStatus } from '@/lib/kit/providers/pesapal'

export const runtime = 'nodejs'

function emailFromRef(orderRef: string): string | null {
  const part = orderRef.split('-')[2]
  if (!part) return null
  try {
    return Buffer.from(part, 'base64url').toString()
  } catch {
    return null
  }
}

function deliver(email: string, orderRef: string) {
  const token = mintToken(email, orderRef, KIT.downloadValidDays)
  const url = `${KIT.siteUrl}/api/kit/download?token=${token}`
  // fire-and-forget; the success page shows the link regardless
  sendKitEmail(email, url).catch((e) => console.error('[kit] email failed', e))
  return url
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const invoiceId = sp.get('invoiceId')
  const trackingId = sp.get('trackingId')

  if (invoiceId) {
    const s = await paymentStatus(invoiceId)
    if (s.state === 'COMPLETE') {
      const email = s.email ?? (s.apiRef ? emailFromRef(s.apiRef) : null)
      if (!email) return NextResponse.json({ state: 'COMPLETE', error: 'missing email' }, { status: 500 })
      return NextResponse.json({ state: 'COMPLETE', downloadUrl: deliver(email, s.apiRef ?? invoiceId) })
    }
    return NextResponse.json({ state: s.state })
  }

  if (trackingId) {
    const s = await transactionStatus(trackingId)
    if (s.complete && s.email) {
      return NextResponse.json({ state: 'COMPLETE', downloadUrl: deliver(s.email, s.orderRef ?? trackingId) })
    }
    return NextResponse.json({ state: s.complete ? 'COMPLETE' : 'PENDING' })
  }

  return NextResponse.json({ error: 'invoiceId or trackingId required' }, { status: 400 })
}

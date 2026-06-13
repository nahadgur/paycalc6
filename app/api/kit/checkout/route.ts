import { NextRequest, NextResponse } from 'next/server'
import { KIT, ACTIVE_PROVIDER, normalisePhone, isValidEmail } from '@/lib/kit/config'
import { stkPush } from '@/lib/kit/providers/intasend'
import { submitOrder } from '@/lib/kit/providers/pesapal'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? '').trim().toLowerCase()
  const phone = normalisePhone(String(body?.phone ?? ''))

  if (!isValidEmail(email))
    return NextResponse.json({ error: 'Enter a valid email address — the kit is delivered there.' }, { status: 400 })
  if (!phone)
    return NextResponse.json({ error: 'Enter a valid Safaricom number, e.g. 0712 345 678.' }, { status: 400 })

  // Order ref encodes the buyer email so the webhook can mint a token statelessly.
  const orderRef = `KIT-${Date.now().toString(36)}-${Buffer.from(email).toString('base64url')}`

  if (ACTIVE_PROVIDER === 'pesapal') {
    const r = await submitOrder({
      orderRef,
      amount: KIT.priceKES,
      email,
      phone,
      callbackUrl: `${KIT.siteUrl}/kit/thanks`,
    })
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 })
    return NextResponse.json({ provider: 'pesapal', redirectUrl: r.redirectUrl, trackingId: r.trackingId })
  }

  const r = await stkPush({ phone, email, amount: KIT.priceKES, apiRef: orderRef })
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 })
  return NextResponse.json({ provider: 'intasend', invoiceId: r.invoiceId, orderRef })
}

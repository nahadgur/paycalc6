// IntaSend webhook — backup delivery path in case the buyer closed the tab
// before the status poll completed. Configure the same challenge string in
// the IntaSend dashboard and INTASEND_WEBHOOK_CHALLENGE.
import { NextRequest, NextResponse } from 'next/server'
import { KIT } from '@/lib/kit/config'
import { mintToken } from '@/lib/kit/token'
import { sendKitEmail } from '@/lib/kit/email'
import { verifyWebhook } from '@/lib/kit/providers/intasend'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  if (!verifyWebhook(body)) {
    return NextResponse.json({ error: 'bad challenge' }, { status: 401 })
  }
  const state = body?.state ?? body?.invoice?.state
  const apiRef: string | undefined = body?.api_ref ?? body?.invoice?.api_ref

  if (state === 'COMPLETE' && apiRef?.startsWith('KIT-')) {
    const part = apiRef.split('-')[2]
    let email: string | null = null
    try {
      email = part ? Buffer.from(part, 'base64url').toString() : null
    } catch {}
    if (email) {
      const token = mintToken(email, apiRef, KIT.downloadValidDays)
      await sendKitEmail(email, `${KIT.siteUrl}/api/kit/download?token=${token}`)
      console.log('[kit] sold + delivered via webhook:', apiRef)
    }
  }
  return NextResponse.json({ ok: true })
}

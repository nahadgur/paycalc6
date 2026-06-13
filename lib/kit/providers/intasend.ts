// IntaSend M-Pesa STK Push (Collection API).
// Docs: https://developers.intasend.com — set INTASEND_BASE_URL to
// https://sandbox.intasend.com for testing, https://payment.intasend.com for live.

const BASE = process.env.INTASEND_BASE_URL ?? 'https://payment.intasend.com'
const SECRET = process.env.INTASEND_SECRET_KEY ?? ''

type StkResult = { ok: true; invoiceId: string } | { ok: false; error: string }
export type PayState = 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED'

export async function stkPush(opts: {
  phone: string
  email: string
  amount: number
  apiRef: string
}): Promise<StkResult> {
  const res = await fetch(`${BASE}/api/v1/payment/mpesa-stk-push/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: opts.amount,
      phone_number: opts.phone,
      email: opts.email,
      api_ref: opts.apiRef,
      narrative: 'Broke After Payday Kit',
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data?.invoice?.invoice_id) {
    console.error('[kit] intasend stk error', res.status, data)
    return { ok: false, error: data?.detail ?? 'Could not start M-Pesa payment' }
  }
  return { ok: true, invoiceId: data.invoice.invoice_id }
}

export async function paymentStatus(invoiceId: string): Promise<{
  state: PayState
  email?: string
  apiRef?: string
}> {
  const res = await fetch(`${BASE}/api/v1/payment/status/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ invoice_id: invoiceId }),
  })
  const data = await res.json().catch(() => ({}))
  const state = (data?.invoice?.state ?? 'PENDING') as PayState
  return {
    state,
    email: data?.customer?.email ?? data?.invoice?.email,
    apiRef: data?.invoice?.api_ref,
  }
}

/** Webhook bodies carry a `challenge` you configure in the IntaSend dashboard. */
export function verifyWebhook(body: Record<string, unknown>): boolean {
  const expected = process.env.INTASEND_WEBHOOK_CHALLENGE
  return Boolean(expected) && body?.challenge === expected
}

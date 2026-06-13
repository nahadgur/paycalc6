// Pesapal API 3.0 — hosted-checkout fallback provider (card + M-Pesa).
// Flow: SubmitOrderRequest -> redirect buyer to redirect_url -> Pesapal calls
// our IPN + redirects back to /kit/thanks?OrderTrackingId=...
// Sandbox base: https://cybqa.pesapal.com/pesapalv3  Live: https://pay.pesapal.com/v3
// One-time setup: register the IPN URL (see docs/KIT-CHECKOUT.md) and set PESAPAL_IPN_ID.

const BASE = process.env.PESAPAL_BASE_URL ?? 'https://pay.pesapal.com/v3'

let cachedToken: { token: string; exp: number } | null = null

async function authToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.exp - 30_000) return cachedToken.token
  const res = await fetch(`${BASE}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      consumer_key: process.env.PESAPAL_CONSUMER_KEY,
      consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }),
  })
  const data = await res.json()
  if (!data?.token) throw new Error('Pesapal auth failed: ' + JSON.stringify(data))
  cachedToken = { token: data.token, exp: Date.now() + 4.5 * 60_000 }
  return data.token
}

export async function submitOrder(opts: {
  orderRef: string
  amount: number
  email: string
  phone: string
  callbackUrl: string
}): Promise<{ ok: true; redirectUrl: string; trackingId: string } | { ok: false; error: string }> {
  const token = await authToken()
  const res = await fetch(`${BASE}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: opts.orderRef,
      currency: 'KES',
      amount: opts.amount,
      description: 'Broke After Payday Kit (PDF)',
      callback_url: opts.callbackUrl,
      notification_id: process.env.PESAPAL_IPN_ID,
      billing_address: { email_address: opts.email, phone_number: opts.phone },
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!data?.redirect_url) {
    console.error('[kit] pesapal order error', res.status, data)
    return { ok: false, error: data?.error?.message ?? 'Could not start Pesapal payment' }
  }
  return { ok: true, redirectUrl: data.redirect_url, trackingId: data.order_tracking_id }
}

export async function transactionStatus(trackingId: string): Promise<{
  complete: boolean
  email?: string
  orderRef?: string
}> {
  const token = await authToken()
  const res = await fetch(
    `${BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(trackingId)}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
  )
  const data = await res.json().catch(() => ({}))
  return {
    complete: data?.payment_status_description === 'Completed',
    email: data?.billing_address?.email_address,
    orderRef: data?.merchant_reference,
  }
}

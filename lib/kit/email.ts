// Delivery email via Resend's REST API (plain fetch — no SDK dependency).
// If RESEND_API_KEY is unset we no-op so the success-page link still works.
import { KIT } from './config'

export async function sendKitEmail(to: string, downloadUrl: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[kit] RESEND_API_KEY not set — skipping delivery email for', to)
    return false
  }
  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1F2937">
    <div style="background:#F04C40;padding:14px 20px;border-radius:8px 8px 0 0">
      <strong style="color:#fff;font-size:16px">PAYE Calculator Kenya</strong>
    </div>
    <div style="border:1px solid #FFD9D3;border-top:0;padding:24px 20px;border-radius:0 0 8px 8px">
      <h2 style="color:#C73B2F;margin:0 0 12px">Your kit is ready 🎉</h2>
      <p>Thank you for buying <strong>${KIT.shortName}</strong>.</p>
      <p>Your personal copy (licensed to this email address) is here:</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${downloadUrl}"
           style="background:#F04C40;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold">
          Download the kit (PDF)
        </a>
      </p>
      <p style="font-size:13px;color:#666">The link works for ${KIT.downloadValidDays} days.
      Save the PDF to your phone or Google Drive. Rates change — as a buyer you get every
      updated edition free; we will email you when one ships.</p>
      <p style="font-size:13px;color:#666">Questions? Just reply to this email.</p>
    </div>
  </div>`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: KIT.fromEmail,
      to: [to],
      subject: 'Your Broke After Payday kit is ready to download',
      html,
    }),
  })
  if (!res.ok) console.error('[kit] Resend error', res.status, await res.text())
  return res.ok
}

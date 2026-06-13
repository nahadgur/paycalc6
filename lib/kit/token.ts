// Stateless, HMAC-signed download tokens. No database required:
// the webhook/status check mints a token only after the provider
// confirms payment, and the download route just verifies the signature.
import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.KIT_DOWNLOAD_SECRET ?? ''

type Payload = { e: string; x: number; r: string } // email, expiry(ms), order ref

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}
function sign(data: string): string {
  return b64url(createHmac('sha256', SECRET).update(data).digest())
}

export function mintToken(email: string, orderRef: string, validDays: number): string {
  const payload: Payload = {
    e: email.trim().toLowerCase(),
    x: Date.now() + validDays * 86_400_000,
    r: orderRef,
  }
  const body = b64url(Buffer.from(JSON.stringify(payload)))
  return `${body}.${sign(body)}`
}

export function verifyToken(token: string): Payload | null {
  if (!SECRET) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expect = sign(body)
  const a = Buffer.from(sig), b = Buffer.from(expect)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(fromB64url(body).toString()) as Payload
    if (typeof payload.x !== 'number' || Date.now() > payload.x) return null
    return payload
  } catch {
    return null
  }
}

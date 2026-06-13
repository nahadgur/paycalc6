'use client'

import { useEffect, useRef, useState } from 'react'
import { Smartphone, Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react'

type Phase = 'idle' | 'starting' | 'waiting' | 'paid' | 'failed'

const PRICE = 299 // display only; the server enforces the real price

export default function KitCheckout() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPhase('starting')
    try {
      const res = await fetch('/api/kit/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Something went wrong. Try again.')

      if (data.provider === 'pesapal' && data.redirectUrl) {
        window.location.href = data.redirectUrl // hosted checkout
        return
      }

      // IntaSend STK push: poll until the buyer enters their M-Pesa PIN
      setPhase('waiting')
      let tries = 0
      pollRef.current = setInterval(async () => {
        tries++
        if (tries > 40) { // ~2 minutes
          if (pollRef.current) clearInterval(pollRef.current)
          setPhase('failed')
          setError('We did not receive the payment in time. If you entered your PIN, check your email in a few minutes — otherwise try again.')
          return
        }
        try {
          const s = await fetch(`/api/kit/status?invoiceId=${data.invoiceId}`).then(r => r.json())
          if (s.state === 'COMPLETE' && s.downloadUrl) {
            if (pollRef.current) clearInterval(pollRef.current)
            setDownloadUrl(s.downloadUrl)
            setPhase('paid')
          } else if (s.state === 'FAILED') {
            if (pollRef.current) clearInterval(pollRef.current)
            setPhase('failed')
            setError('The M-Pesa payment was cancelled or failed. No money left your account? Just try again.')
          }
        } catch { /* transient poll error — keep going */ }
      }, 3000)
    } catch (err) {
      setPhase('failed')
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    }
  }

  if (phase === 'paid') {
    return (
      <div className="rounded-xl border-2 border-green-600 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">Payment received. Asante!</h3>
        <p className="mt-1 text-sm text-gray-600">
          Your copy is licensed to <strong>{email}</strong>. We have also emailed you this link.
        </p>
        <a
          href={downloadUrl}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-600"
        >
          <Download className="h-5 w-5" /> Download your kit (PDF)
        </a>
        <p className="mt-3 text-xs text-gray-500">Link valid for 7 days. Save the PDF to your phone or Drive.</p>
      </div>
    )
  }

  return (
    <form onSubmit={startCheckout} className="rounded-xl border border-brand-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-gray-900">KES {PRICE}</span>
        <span className="text-sm text-gray-500">one-time · free updates</span>
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700">Email (kit is delivered here)</label>
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-brand focus:outline-none"
      />

      <label className="mb-1 block text-sm font-medium text-gray-700">M-Pesa number</label>
      <input
        type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
        placeholder="0712 345 678"
        className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-brand focus:outline-none"
      />

      {error && (
        <p className="mb-3 flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={phase === 'starting' || phase === 'waiting'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-600 disabled:opacity-70"
      >
        {phase === 'starting' && <><Loader2 className="h-5 w-5 animate-spin" /> Starting M-Pesa…</>}
        {phase === 'waiting' && <><Smartphone className="h-5 w-5 animate-pulse" /> Check your phone — enter your M-Pesa PIN</>}
        {(phase === 'idle' || phase === 'failed') && <><Smartphone className="h-5 w-5" /> Pay KES {PRICE} with M-Pesa</>}
      </button>

      {phase === 'waiting' && (
        <p className="mt-3 text-center text-sm text-gray-500">
          We sent an STK prompt to your phone. This page updates automatically once you pay.
        </p>
      )}
      <p className="mt-4 text-center text-xs text-gray-400">
        Secure payment via IntaSend. Instant download + email delivery. No subscription.
      </p>
    </form>
  )
}

'use client'

// Pesapal callback landing: Pesapal redirects here with ?OrderTrackingId=...
// We poll our status endpoint until the transaction confirms, then show the
// download link (the email goes out from the same status check).
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react'

function ThanksInner() {
  const sp = useSearchParams()
  const trackingId = sp.get('OrderTrackingId') ?? sp.get('orderTrackingId') ?? ''
  const [state, setState] = useState<'checking' | 'paid' | 'failed'>('checking')
  const [downloadUrl, setDownloadUrl] = useState('')

  useEffect(() => {
    if (!trackingId) { setState('failed'); return }
    let tries = 0
    const t = setInterval(async () => {
      tries++
      if (tries > 30) { clearInterval(t); setState('failed'); return }
      try {
        const s = await fetch(`/api/kit/status?trackingId=${encodeURIComponent(trackingId)}`).then(r => r.json())
        if (s.state === 'COMPLETE' && s.downloadUrl) {
          clearInterval(t)
          setDownloadUrl(s.downloadUrl)
          setState('paid')
        }
      } catch { /* keep polling */ }
    }, 3000)
    return () => clearInterval(t)
  }, [trackingId])

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      {state === 'checking' && (
        <>
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand" />
          <h1 className="text-xl font-bold text-gray-900">Confirming your payment…</h1>
          <p className="mt-2 text-sm text-gray-600">This usually takes a few seconds. Do not close this page.</p>
        </>
      )}
      {state === 'paid' && (
        <>
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">Payment received. Asante!</h1>
          <p className="mt-2 text-sm text-gray-600">We have also emailed your download link.</p>
          <a href={downloadUrl}
             className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-600">
            <Download className="h-5 w-5" /> Download your kit (PDF)
          </a>
        </>
      )}
      {state === 'failed' && (
        <>
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-brand" />
          <h1 className="text-xl font-bold text-gray-900">We could not confirm this payment</h1>
          <p className="mt-2 text-sm text-gray-600">
            If money left your account, check your email in a few minutes — delivery is automatic.
            Otherwise, <Link href="/kit#buy" className="font-medium text-brand-600 underline">try again</Link>.
          </p>
        </>
      )}
    </main>
  )
}

export default function ThanksPage() {
  return (
    <Suspense fallback={null}>
      <ThanksInner />
    </Suspense>
  )
}

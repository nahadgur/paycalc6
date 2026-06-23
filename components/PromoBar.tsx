'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Slim site-wide promo for the Selar PDF. Dismissible, remembered in
// localStorage so returning visitors are not nagged. Bump the key version to
// re-show the bar after a change. Starts hidden on the server and appears after
// mount, which avoids a hydration mismatch for visitors who already dismissed it.
const DISMISS_KEY = 'paye_kit_promo_v1'
const SELAR_URL = 'https://selar.com/366117d092'

export default function PromoBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(DISMISS_KEY)) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div className="relative bg-brand text-white">
      <a
        href={SELAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-10 py-2 text-center text-[12px] sm:text-[13px] font-medium transition-colors hover:bg-brand-600"
      >
        <span className="opacity-90">New for 2026 ·</span>{' '}
        <span className="font-semibold">Broke After Payday</span>, the Kenya salary survival kit.{' '}
        <span className="underline underline-offset-2">Get the PDF →</span>
      </a>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          try {
            localStorage.setItem(DISMISS_KEY, '1')
          } catch {
            /* private mode: just hide for this session */
          }
          setShow(false)
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/80 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

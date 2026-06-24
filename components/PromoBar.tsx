'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Slim site-wide promo for the Selar PDF. Dismissible, remembered in
// localStorage so returning visitors are not nagged. Bump the key version to
// re-show the bar after a change. Starts hidden on the server and appears after
// mount, which avoids a hydration mismatch for visitors who already dismissed it.
const DISMISS_KEY = 'paye_kit_promo_v3'
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
    <div className="banner-shine relative overflow-hidden bg-[#1a1412] text-white">
      <a
        href={SELAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center gap-2.5 px-10 py-2.5 text-center text-[12px] font-medium transition-colors hover:bg-black sm:gap-3 sm:py-4 sm:text-[15px]"
      >
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
        </span>
        <span>
          <span className="opacity-80">Free for now ·</span>{' '}
          <span className="font-semibold">Broke After Payday</span>
          <span className="hidden sm:inline">, the 2026 Kenya salary survival kit</span>.{' '}
          <span className="whitespace-nowrap font-semibold text-brand-300 underline underline-offset-2">Download →</span>
        </span>
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
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-white/70 transition-colors hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

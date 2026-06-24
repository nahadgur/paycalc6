'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, Download } from 'lucide-react'

// Scroll-triggered promo for the kit. Slides in once after the visitor scrolls
// past a threshold, once per visitor (localStorage). Skipped on /kit and
// /thank-you, where it would be redundant. Links to /kit.
const DISMISS_KEY = 'paye_kit_popup_v1'

export default function KitPopup() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const path = (pathname || '').replace(/\/$/, '')
    // Fire on engagement pages where people read and click (guides, blog,
    // calculator sub-pages, FAQ, etc.). Skip the homepage landing, the kit and
    // thank-you pages, and privacy, where it is redundant or unwelcome.
    const SKIP = ['', '/kit', '/thank-you', '/privacy']
    if (SKIP.includes(path)) return
    try {
      if (localStorage.getItem(DISMISS_KEY)) return
    } catch {
      /* private mode: still allow the popup this session */
    }

    let fired = false
    const onScroll = () => {
      if (fired) return
      const threshold = Math.min(800, document.body.scrollHeight * 0.4)
      if (window.scrollY > threshold) {
        fired = true
        setShow(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (!show) return null

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  return (
    <div className="animate-fadeIn fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px]">
      <div className="banner-shine relative overflow-hidden rounded-2xl bg-[#1a1412] p-5 text-[#fff] shadow-2xl shadow-black/30 sm:p-7">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2.5 top-2.5 z-10 rounded p-1 text-white/60 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fff]">
          Free for now
        </span>
        <h3 className="editorial-h mt-3 pr-6 text-[20px] leading-tight sm:text-[24px]">
          Broke After Payday: the 2026 salary survival kit
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/70 sm:mt-2 sm:text-[14px]">
          A 53-page PDF to decode your payslip and stop the money leaks. Free while we are in launch.
        </p>
        <Link
          href="/kit"
          onClick={dismiss}
          className="relative z-10 mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-[#fff] transition-colors hover:bg-brand-600 sm:mt-5 sm:py-3.5 sm:text-[15px]"
        >
          <Download className="h-4 w-4" /> Get the kit
        </Link>
      </div>
    </div>
  )
}

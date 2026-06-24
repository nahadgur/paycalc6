'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LayoutGrid, X, Download } from 'lucide-react'
import { CALC_ITEMS } from './NavCalculators'

// Mobile-only menu. The grid button (four rounded squares) toggles a dropdown
// panel with the kit CTA, Guides, Blog and the calculator links. Hidden at sm+
// where the inline nav has room. Closes on link tap, click-outside and Escape.
export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="sm:hidden" ref={ref}>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e5e5] text-[#333] transition-colors hover:border-brand hover:text-brand"
      >
        {open ? <X className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-[#eee] bg-white shadow-lg shadow-black/5">
          <div className="mx-auto max-w-5xl px-5 py-4">
            <Link
              href="/kit"
              onClick={close}
              className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-[14px] font-bold text-white"
            >
              <Download className="h-4 w-4" /> Get the kit free
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Link href="/guides" onClick={close} className="rounded-lg bg-brand-50 px-3 py-2.5 text-center text-[14px] font-medium text-[#111] transition-colors hover:bg-brand-100">
                Guides
              </Link>
              <Link href="/blog" onClick={close} className="rounded-lg bg-brand-50 px-3 py-2.5 text-center text-[14px] font-medium text-[#111] transition-colors hover:bg-brand-100">
                Blog
              </Link>
            </div>

            <p className="mb-2 mt-5 text-[11px] font-medium uppercase tracking-wider text-[#999]">Calculators</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {CALC_ITEMS.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={close}
                  className="rounded-lg px-2 py-2 text-[13px] font-medium text-[#444] transition-colors hover:bg-brand-50 hover:text-brand"
                >
                  {it.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

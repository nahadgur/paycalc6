'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const ITEMS = [
  { href: '/', label: 'PAYE / net salary', desc: 'Full take-home breakdown' },
  { href: '/net-gross-calculator', label: 'Net to gross', desc: 'Gross for a target take-home' },
  { href: '/bonus-calculator', label: 'Bonus tax', desc: 'Tax and net on a bonus' },
  { href: '/raise-calculator', label: 'Pay rise', desc: 'What a raise adds after tax' },
  { href: '/employer-cost-calculator', label: 'Employer cost', desc: 'True cost to employ' },
  { href: '/salary-comparison', label: 'Salary comparison', desc: 'PAYE & net across bands' },
  { href: '/nssf-calculator', label: 'NSSF calculator', desc: 'Tier I & II deduction' },
  { href: '/mortgage-relief', label: 'Mortgage relief', desc: 'PAYE saving on interest' },
  { href: '/p9-generator', label: 'P9 generator', desc: 'Annual P9 certificate' },
]

export default function NavCalculators() {
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-[#555] hover:text-brand transition-colors text-[13px] font-medium"
      >
        Calculators
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-white border border-[#eee] rounded-2xl shadow-lg shadow-black/5 p-2 z-50">
          {ITEMS.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="flex flex-col px-3 py-2 rounded-xl hover:bg-brand-50 transition-colors group"
            >
              <span className="text-[13px] font-medium text-[#111] group-hover:text-brand transition-colors">{it.label}</span>
              <span className="text-[11px] text-[#888]">{it.desc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

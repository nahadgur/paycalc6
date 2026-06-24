'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Calculator, RefreshCw, Gift, TrendingUp, Building, BarChart3, Landmark, Home, FileText, Receipt } from 'lucide-react'

// Every calculator on the site, shown as the pill bar in each hero. `key` is
// matched against the current page so the active pill is highlighted.
export const TOOLS = [
  { key: 'calculator', href: '/', icon: Calculator, label: 'Calculator' },
  { key: 'reverse', href: '/net-gross-calculator', icon: RefreshCw, label: 'Net → Gross' },
  { key: 'bonus', href: '/bonus-calculator', icon: Gift, label: 'Bonus' },
  { key: 'raise', href: '/raise-calculator', icon: TrendingUp, label: 'Raise' },
  { key: 'employer', href: '/employer-cost-calculator', icon: Building, label: 'Employer Cost' },
  { key: 'compare', href: '/salary-comparison', icon: BarChart3, label: 'Compare' },
  { key: 'nssf', href: '/nssf-calculator', icon: Landmark, label: 'NSSF' },
  { key: 'mortgage', href: '/mortgage-relief', icon: Home, label: 'Mortgage' },
  { key: 'p9', href: '/p9-generator', icon: FileText, label: 'P9' },
  { key: 'payslip', href: '/payslip-generator', icon: Receipt, label: 'Payslip' },
]

export default function ToolTabs({ active }: { active: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: true })
  // Scroll-progress thumb (mobile only): width = visible fraction, pos = travel.
  const [bar, setBar] = useState({ show: true, thumb: 30, pos: 0 })

  const update = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const thumbFrac = clientWidth / scrollWidth
    const max = scrollWidth - clientWidth
    const posFrac = max > 4 ? scrollLeft / max : 0
    setEdges({ left: scrollLeft > 4, right: scrollLeft < max - 4 })
    setBar({
      show: scrollWidth > clientWidth + 4,
      thumb: thumbFrac * 100,
      pos: posFrac * (1 - thumbFrac) * 100,
    })
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="relative -mx-5 sm:mx-0">
      {/* Scroll row. Mobile: one swipeable line. Desktop: wraps, no indicators. */}
      <div
        ref={scrollRef}
        onScroll={update}
        className="flex gap-2 overflow-x-auto no-scrollbar px-5 sm:px-0 sm:flex-wrap sm:overflow-visible"
      >
        {TOOLS.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-[12px] whitespace-nowrap transition-all duration-200 ${
              active === t.key
                ? 'bg-white text-brand hover:bg-white/95'
                : 'bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/70'
            }`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </Link>
        ))}
      </div>

      {/* Edge fades hint there is more either side (mobile only). */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-brand to-transparent transition-opacity duration-200 sm:hidden ${
          edges.left ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-brand to-transparent transition-opacity duration-200 sm:hidden ${
          edges.right ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Scroll-progress track below the row — clear, never overlaps the pills. */}
      {bar.show && (
        <div className="mx-5 mt-3 h-1 rounded-full bg-white/25 sm:hidden">
          <div
            className="h-full rounded-full bg-white transition-[margin,width] duration-150"
            style={{ width: `${bar.thumb}%`, marginLeft: `${bar.pos}%` }}
          />
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Calculator, RefreshCw, Gift, TrendingUp, Building, BarChart3, Landmark, Home, FileText, Receipt, ChevronRight } from 'lucide-react'

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
  // Edge state drives the fade hints. Default: more to the right (mobile overflows).
  const [edges, setEdges] = useState({ left: false, right: true })

  const update = () => {
    const el = scrollRef.current
    if (!el) return
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    })
  }

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="relative -mx-5 sm:mx-0">
      {/* Scroll row. Mobile: one swipeable line. Desktop: wraps, no fades. */}
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

      {/* Left fade — appears once scrolled away from the start. */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-brand to-transparent transition-opacity duration-200 sm:hidden ${
          edges.left ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right fade + nudging chevron — signals there is more to swipe. */}
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end pr-1.5 w-14 bg-gradient-to-l from-brand to-transparent transition-opacity duration-200 sm:hidden ${
          edges.right ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronRight className="h-5 w-5 animate-pulse text-white" />
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const GUIDES = [
  { href: '/itax-2026',         label: 'KRA iTax 2026',          desc: 'Pre-filled returns & new filing' },
  { href: '/statutory-changes', label: 'SHIF & NSSF Changes',    desc: 'Rate changes explained' },
  { href: '/tax-relief',        label: 'Tax Relief Guide',        desc: 'Reduce your PAYE legally' },
  { href: '/employer-guide',    label: 'Employer Guide',          desc: 'Payroll compliance for HR & SMEs' },
  { href: '/faq',               label: 'PAYE FAQ',                desc: '22 common questions answered' },
  { href: '/kra-offices',       label: 'KRA Offices',             desc: 'Find your nearest service centre' },
  { href: '/budget-guide',      label: 'Budget Planner',          desc: 'Plan spending on your take-home' },
]

const TOOLS = [
  { href: '/',               label: 'PAYE Calculator',    desc: 'Net salary & all deductions' },
  { href: '/p9-generator',   label: 'P9 Form Generator',  desc: 'Annual tax certificate' },
  { href: '/tax-calendar',   label: 'Tax Calendar',       desc: 'KRA deadlines for 2026' },
  { href: '/salary/100000',  label: 'Salary Breakdowns',  desc: 'KES 30K–1M with full detail' },
]

export default function SiteNav() {
  const [guidesOpen, setGuidesOpen] = useState(false)
  const [toolsOpen,  setToolsOpen]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const guidesRef = useRef<HTMLDivElement>(null)
  const toolsRef  = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (guidesRef.current && !guidesRef.current.contains(e.target as Node)) setGuidesOpen(false)
      if (toolsRef.current  && !toolsRef.current.contains(e.target as Node))  setToolsOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function closeAll() {
    setGuidesOpen(false)
    setToolsOpen(false)
    setMobileOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" onClick={closeAll} className="flex items-center gap-2 shrink-0">
            <Image src="/logo-256.png" alt="PAYE Calculator" width={32} height={32} priority />
            <span className="font-bold text-lg hidden sm:inline text-white">PAYE Calculator</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">

            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => { setToolsOpen(!toolsOpen); setGuidesOpen(false) }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${toolsOpen ? 'text-white bg-white/10' : 'text-stone-300 hover:text-white hover:bg-white/5'}`}
              >
                Tools
                <svg className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-stone-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                  {TOOLS.map(item => (
                    <Link key={item.href} href={item.href} onClick={closeAll}
                      className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-white text-sm font-medium group-hover:text-amber-400 transition-colors">{item.label}</span>
                      <span className="text-stone-500 text-xs">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Guides dropdown */}
            <div ref={guidesRef} className="relative">
              <button
                onClick={() => { setGuidesOpen(!guidesOpen); setToolsOpen(false) }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${guidesOpen ? 'text-white bg-white/10' : 'text-stone-300 hover:text-white hover:bg-white/5'}`}
              >
                Guides
                <svg className={`w-3.5 h-3.5 transition-transform ${guidesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {guidesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-stone-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                  {GUIDES.map(item => (
                    <Link key={item.href} href={item.href} onClick={closeAll}
                      className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
                      <span className="text-white text-sm font-medium group-hover:text-emerald-400 transition-colors">{item.label}</span>
                      <span className="text-stone-500 text-xs">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/blog" onClick={closeAll}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors">
              Blog
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-stone-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-stone-950 px-4 py-4">
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2 px-2">Tools</p>
          <div className="mb-4 space-y-0.5">
            {TOOLS.map(item => (
              <Link key={item.href} href={item.href} onClick={closeAll}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <span className="text-stone-200 text-sm">{item.label}</span>
                <span className="text-stone-600 text-xs">{item.desc}</span>
              </Link>
            ))}
          </div>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2 px-2">Guides</p>
          <div className="mb-4 space-y-0.5">
            {GUIDES.map(item => (
              <Link key={item.href} href={item.href} onClick={closeAll}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <span className="text-stone-200 text-sm">{item.label}</span>
                <span className="text-stone-600 text-xs hidden sm:inline">{item.desc}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3">
            <Link href="/blog" onClick={closeAll}
              className="flex px-3 py-2.5 text-stone-200 text-sm hover:bg-white/5 rounded-lg transition-colors">
              Blog
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

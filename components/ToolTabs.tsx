import Link from 'next/link'
import { Calculator, RefreshCw, Gift, TrendingUp, Building, BarChart3, Landmark, Home, FileText } from 'lucide-react'

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
]

export default function ToolTabs({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {TOOLS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-[12px] transition-all duration-200 ${
            active === t.key
              ? 'bg-white text-brand hover:bg-white/95'
              : 'bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/70'
          }`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <t.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.label}</span>
        </Link>
      ))}
    </div>
  )
}

import Link from 'next/link'

const TOOLS = [
  { href: '/', label: 'PAYE / net salary calculator', desc: 'Full take-home with NSSF, SHIF & Housing Levy' },
  { href: '/net-gross-calculator', label: 'Net to gross calculator', desc: 'The gross needed for a target take-home' },
  { href: '/bonus-calculator', label: 'Bonus tax calculator', desc: 'Tax and net pay on a bonus' },
  { href: '/raise-calculator', label: 'Pay rise calculator', desc: 'What a raise adds after tax' },
  { href: '/employer-cost-calculator', label: 'Employer cost calculator', desc: 'The true monthly cost to employ' },
  { href: '/salary-comparison', label: 'Salary comparison', desc: 'PAYE and net across salary bands' },
]

// Cross-links between the calculator pages. `current` is the path to omit.
export default function ToolNav({ current }: { current: string }) {
  return (
    <section className="border-t border-[#eee] pt-10">
      <h2 className="text-lg font-bold text-[#111] mb-5">Other calculators</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {TOOLS.filter((t) => t.href !== current).map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-col gap-1 bg-white border border-[#eee] hover:border-brand rounded-xl p-4 transition-all group"
          >
            <span className="font-semibold text-[#111] text-sm group-hover:text-brand transition-colors">{t.label}</span>
            <span className="text-[#888] text-xs">{t.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

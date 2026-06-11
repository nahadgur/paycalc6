import type { Metadata } from 'next'
import { SpokeGrid } from '@/components/SpokeGrid'
import Link from 'next/link'
import { PiggyBank, Home, Shield, GraduationCap, AlertTriangle, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya Tax Reliefs 2026 | Reduce Your PAYE — Complete Guide',
  description: 'All available PAYE tax reliefs in Kenya 2026: personal relief, mortgage interest, pension contributions, insurance relief, and disability relief. How to claim each and how much you save.',
  keywords: ['Kenya tax relief 2026','mortgage interest relief Kenya','pension tax relief Kenya','PAYE reduction Kenya','KES 30000 mortgage relief'],
  alternates: { canonical: 'https://payecalculator.co.ke/guides/tax-relief' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)

type Relief = {
  name: string
  icon: typeof PiggyBank
  iconColor: string
  maxMonthly: number
  mechanism: string
  howItWorks: string
  requirement: string
  example: string
  howToClaim: string[]
  isAutomatic: boolean
}

const RELIEFS: Relief[] = [
  {
    name: 'Personal Relief',
    icon: Shield,
    iconColor: 'text-emerald-400',
    maxMonthly: 2400,
    mechanism: 'Direct reduction of tax payable',
    howItWorks: 'KES 2,400 per month is automatically deducted from your calculated PAYE tax — not from your income. Every Kenyan taxpayer gets this regardless of salary level.',
    requirement: 'Automatic for all registered taxpayers with a KRA PIN',
    example: 'If your calculated PAYE is KES 8,000, personal relief reduces it to KES 5,600.',
    howToClaim: ['Automatically applied by your employer', 'No action required', 'Visible on your payslip as "Personal Relief"'],
    isAutomatic: true,
  },
  {
    name: 'Mortgage Interest Relief',
    icon: Home,
    iconColor: 'text-blue-400',
    maxMonthly: 30000,
    mechanism: 'Deduction from taxable income (before PAYE is calculated)',
    howItWorks: 'Monthly mortgage interest payments on a qualifying home loan reduce your taxable income by up to KES 30,000 per month. At 30% PAYE rate, this saves up to KES 9,000 in tax per month.',
    requirement: 'The property must be your primary residence. The loan must be from a licenced financial institution. You must not have used this relief on another property.',
    example: 'If you pay KES 25,000/month in mortgage interest, your taxable income is reduced by KES 25,000 — saving approximately KES 7,500 in PAYE per month at the 30% band.',
    howToClaim: [
      'Submit your mortgage statement to your employer\'s HR/payroll department',
      'Employer applies the deduction monthly from the date of submission',
      'From 2026, employers are required to apply this automatically — not wait for year-end',
      'Declare any unapplied relief on your annual iTax return to get a refund',
    ],
    isAutomatic: false,
  },
  {
    name: 'Pension Contribution Relief',
    icon: PiggyBank,
    iconColor: 'text-amber-400',
    maxMonthly: 30000,
    mechanism: 'Deduction from taxable income',
    howItWorks: 'Contributions to a KRA-approved pension or provident fund reduce your taxable income by up to KES 30,000 per month. This is in addition to your mandatory NSSF deduction.',
    requirement: 'Must be to a registered and KRA-approved pension scheme (RBA-registered). Your employer\'s occupational scheme or personal pension like LAPF or Jubilee Life qualifies.',
    example: 'Contributing KES 20,000/month to an approved pension saves approximately KES 6,000 in PAYE per month (at 30% rate). Your pension grows while reducing your tax bill.',
    howToClaim: [
      'Enrol in an approved pension scheme — ask HR for your employer\'s occupational fund',
      'For personal pensions, submit proof of contributions to HR',
      'Employer applies the deduction in monthly payroll',
      'Declare on annual iTax return with pension fund certificate',
    ],
    isAutomatic: false,
  },
  {
    name: 'Insurance Premium Relief',
    icon: Shield,
    iconColor: 'text-purple-400',
    maxMonthly: 5000,
    mechanism: 'Direct reduction of tax payable (15% of premium)',
    howItWorks: 'You receive a tax credit of 15% of qualifying insurance premiums paid, up to a maximum credit of KES 5,000 per month. This reduces your PAYE — not your income.',
    requirement: 'Must be for life insurance, education insurance, or health insurance for yourself, spouse, or children. Must be paid to a KRA-approved insurance company.',
    example: 'Paying KES 20,000/month in qualifying insurance premiums gives a tax credit of KES 3,000 (15% × 20,000). Paying KES 40,000+ gives the maximum credit of KES 5,000.',
    howToClaim: [
      'Submit insurance policy certificate and premium payment schedule to HR',
      'HR applies the 15% credit in monthly payroll up to the KES 5,000 cap',
      'Alternatively, declare premiums on your annual iTax return for a year-end refund',
    ],
    isAutomatic: false,
  },
  {
    name: 'Disability Relief',
    icon: Shield,
    iconColor: 'text-red-400',
    maxMonthly: 150000,
    mechanism: 'Additional deduction from taxable income',
    howItWorks: 'Registered Persons with Disability (NCPWD card holders) receive an additional tax exemption of KES 150,000 per month on taxable income, effectively making income up to this amount tax-free.',
    requirement: 'Must hold a valid National Council for Persons with Disabilities (NCPWD) registration card. Submit the card number and a copy to your employer.',
    example: 'On a KES 100,000 salary, a registered PWD pays zero PAYE as all taxable income is covered by the disability relief exemption plus personal relief.',
    howToClaim: [
      'Register with NCPWD at ncpwd.go.ke',
      'Submit your NCPWD card to HR and mark the checkbox on KRA employer forms',
      'Employer applies full relief in monthly payroll',
    ],
    isAutomatic: false,
  },
  {
    name: 'HELB Loan Repayment Deduction',
    icon: GraduationCap,
    iconColor: 'text-cyan-400',
    maxMonthly: 5000,
    mechanism: 'Deduction from taxable income',
    howItWorks: 'Higher Education Loans Board (HELB) loan repayments are deductible from your taxable income, reducing PAYE. However, the primary impact is reducing take-home pay — the tax benefit is limited.',
    requirement: 'Must be repaying an active HELB loan. Deductions are typically handled through salary-based enforcement by HELB.',
    example: 'KES 5,000/month HELB repayment reduces taxable income by KES 5,000, saving approximately KES 1,500 in PAYE (at 30% rate).',
    howToClaim: [
      'HELB sends garnishment orders directly to your employer',
      'Employer must comply and deduct from payroll',
      'No separate action required — it is automatic once HELB initiates',
    ],
    isAutomatic: true,
  },
]

const SAVINGS_TABLE = [
  { salary: 50000,  mortgage: 0, pension: 10000, insurance: 5000, savingsPM: 4500 },
  { salary: 100000, mortgage: 25000, pension: 20000, insurance: 15000, savingsPM: 17250 },
  { salary: 200000, mortgage: 30000, pension: 30000, insurance: 20000, savingsPM: 21500 },
  { salary: 300000, mortgage: 30000, pension: 30000, insurance: 30000, savingsPM: 22500 },
]

export default function TaxReliefPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Kenya Tax Reliefs 2026 — Complete Guide to Reducing Your PAYE',
    description: 'All PAYE tax reliefs available in Kenya 2026: personal relief, mortgage, pension, insurance, and disability relief.',
    url: 'https://payecalculator.co.ke/guides/tax-relief',
    dateModified: '2026-04-06',
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Kenya Tax Reliefs 2026 — Reduce Your PAYE Legally</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            Most Kenyan employees pay more tax than they need to. There are six legal reliefs that can reduce your monthly PAYE — some by up to KES 20,000 per month. Here is every one, explained clearly.
          </p>
        </div>

        {/* Relief summary cards */}
        <section className="mb-10">
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Max monthly savings', value: 'KES 44,400+', sub: 'Using all available reliefs' },
              { label: 'Personal relief', value: 'KES 2,400/mo', sub: 'Automatic — no action needed' },
              { label: 'Mortgage relief max', value: 'KES 9,000/mo', sub: 'At 30% rate on KES 30K interest' },
            ].map(card => (
              <div key={card.label} className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-stone-400 text-xs mb-1">{card.label}</p>
                <p className="text-emerald-400 text-xl font-black">{card.value}</p>
                <p className="text-stone-500 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Individual reliefs */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">All Available Tax Reliefs — 2026</h2>
          <div className="space-y-5">
            {RELIEFS.map(relief => (
              <div key={relief.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 shrink-0`}>
                    <relief.icon className={`w-5 h-5 ${relief.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{relief.name}</h3>
                      {relief.isAutomatic && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">✓ Auto-applied</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-stone-500">
                      <span>Max: <strong className="text-stone-300">{fmt(relief.maxMonthly)}/month</strong></span>
                      <span>Via: <strong className="text-stone-300">{relief.mechanism}</strong></span>
                    </div>
                  </div>
                </div>

                <p className="text-stone-400 text-sm leading-relaxed mb-3">{relief.howItWorks}</p>

                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 mb-3">
                  <p className="text-emerald-400 text-xs font-semibold mb-0.5">Example</p>
                  <p className="text-stone-300 text-xs leading-relaxed">{relief.example}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-stone-600 mb-2">Requirements</p>
                  <p className="text-stone-400 text-xs leading-relaxed">{relief.requirement}</p>
                </div>

                {!relief.isAutomatic && (
                  <div>
                    <p className="text-xs font-semibold text-stone-600 mb-2">How to Claim</p>
                    <div className="space-y-1">
                      {relief.howToClaim.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-400">
                          <span className="text-stone-600">{i + 1}.</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Potential savings table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Potential Monthly Tax Savings by Salary Level</h2>
          <p className="text-stone-400 text-sm mb-5">
            Below are indicative savings when claiming mortgage interest, pension contributions, and insurance reliefs at different salary levels.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 px-4 text-stone-400">Gross Salary</th>
                  <th className="text-right py-3 px-4 text-stone-400">Mortgage Interest</th>
                  <th className="text-right py-3 px-4 text-stone-400">Pension</th>
                  <th className="text-right py-3 px-4 text-stone-400">Insurance</th>
                  <th className="text-right py-3 px-4 text-emerald-400">Est. PAYE Saved</th>
                </tr>
              </thead>
              <tbody>
                {SAVINGS_TABLE.map(row => (
                  <tr key={row.salary} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{fmt(row.salary)}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(row.mortgage)}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(row.pension)}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(row.insurance)}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold">{fmt(row.savingsPM)}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-600 mt-2">Estimates only. Actual savings depend on your marginal tax rate. Use the full calculator for exact figures.</p>
        </section>

        {/* Key tip */}
        <section className="mb-10">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Most Missed Relief: Mortgage Interest
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-3">
              The mortgage interest relief is the single biggest tax-saving opportunity for most middle-income Kenyans — worth up to <strong className="text-white">KES 9,000 per month</strong> in PAYE savings — yet thousands fail to claim it.
              From 2026, employers must apply it automatically once you submit your mortgage statement. Many still do not know this. If you have a home loan, submit your bank statement to HR today.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
              Calculate your savings with mortgage relief <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-all">
            Open Full Calculator with All Relief Options →
          </Link>
        </div>

        <SpokeGrid siloKey="tax-savings" />

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🧮</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">PAYE Calculator</span>
              <span className="text-stone-500 text-xs">Apply reliefs and see savings</span>
            </Link>
            <Link href="/guides/statutory-changes" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📊</span>
              <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">Statutory Changes</span>
              <span className="text-stone-500 text-xs">SHIF & NSSF 2026 rates</span>
            </Link>
            <Link href="/guides/employer-guide" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🏢</span>
              <span className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">Employer Guide</span>
              <span className="text-stone-500 text-xs">Applying reliefs in payroll</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">FAQ</span>
              <span className="text-stone-500 text-xs">Relief questions answered</span>
            </Link>
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar</span>
              <span className="text-stone-500 text-xs">When to claim reliefs</span>
            </Link>
            <Link href="/p9-generator" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📄</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">P9 Generator</span>
              <span className="text-stone-500 text-xs">Check reliefs on your P9</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Apply these reliefs now</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🧮</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE Calculator</p>
                <p className="text-stone-500 text-xs mt-0.5">Enter your reliefs and see the saving instantly</p>
              </div>
            </Link>
            <Link href="/p9-generator" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📄</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">P9 Generator</p>
                <p className="text-stone-500 text-xs mt-0.5">Verify reliefs were applied on your P9 form</p>
              </div>
            </Link>
            <Link href="/guides/statutory-changes" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📊</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">SHIF & NSSF Changes</p>
                <p className="text-stone-500 text-xs mt-0.5">How rate changes interact with relief calculations</p>
              </div>
            </Link>
            <Link href="/budget-guide" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📐</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Budget Planner</p>
                <p className="text-stone-500 text-xs mt-0.5">Plan spending on your higher take-home</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

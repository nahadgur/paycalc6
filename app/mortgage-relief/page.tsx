import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mortgage Relief Calculator Kenya 2026 | Save up to KES 9,000/mo',
  description:
    'How much can mortgage interest relief save you in Kenya? See the KES 30,000/month deduction, your PAYE saving by salary band, who qualifies, and how to claim it — updated for 2026.',
  keywords: [
    'mortgage relief calculator Kenya', 'mortgage relief Kenya', 'mortgage interest relief Kenya 2026',
    'mortgage relief in Kenya', 'KES 30000 mortgage relief', 'home loan tax relief Kenya',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/mortgage-relief' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)

const CAP = 30000 // max monthly mortgage interest deduction (Tax Laws (Amendment) Act 2024)

// Est. PAYE saved at the 30% marginal band (most middle-income earners)
const ROWS = [10000, 15000, 20000, 25000, 30000, 40000].map(interest => {
  const allowed = Math.min(interest, CAP)
  return { interest, allowed, saved: allowed * 0.30 }
})

export default function MortgageReliefPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Mortgage Relief Calculator Kenya 2026',
        url: 'https://payecalculator.co.ke/mortgage-relief',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Work out how much mortgage interest relief reduces your PAYE in Kenya, up to KES 30,000 of interest a month.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much is mortgage interest relief in Kenya?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can deduct mortgage interest of up to KES 30,000 per month (KES 360,000 a year) from your taxable income. At the 30% PAYE band that is worth up to KES 9,000 a month in tax saved.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who qualifies for mortgage interest relief?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The loan must be from a specified financial institution and used to buy or improve a home you occupy as your primary residence. You can claim on only one property at a time.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is mortgage relief a deduction or a tax credit?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It is a deduction from taxable income, not a tax credit. The interest you pay (up to the cap) is removed from your chargeable pay before PAYE is calculated.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="paye-calc-body min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-5">
            <Home className="w-4 h-4 text-brand-700" />
            <span className="text-brand-700 text-sm font-medium">Updated 2026 · KES 30,000/month</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Mortgage Relief Calculator Kenya 2026</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            If you have a home loan, mortgage interest relief is one of the biggest PAYE savings available — up to
            KES 30,000 of interest a month comes off your taxable income, worth up to KES 9,000 in tax saved.
            See your saving below.
          </p>
        </div>

        {/* Key figures */}
        <section className="mb-10">
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Max interest deductible', value: 'KES 30,000/mo', sub: 'KES 360,000 a year' },
              { label: 'Max PAYE saved', value: 'KES 9,000/mo', sub: 'At the 30% tax band' },
              { label: 'Mechanism', value: 'Deduction', sub: 'Reduces taxable income' },
            ].map(card => (
              <div key={card.label} className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-center">
                <p className="text-stone-400 text-xs mb-1">{card.label}</p>
                <p className="text-brand-700 text-xl font-black">{card.value}</p>
                <p className="text-stone-500 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Savings table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">What you save by mortgage interest paid</h2>
          <p className="text-stone-400 text-sm mb-5">
            Your saving is the allowable interest multiplied by your marginal PAYE rate. The figures below assume the
            30% band, which applies to most middle-income earners.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 px-4 text-stone-400">Monthly interest paid</th>
                  <th className="text-right py-3 px-4 text-stone-400">Allowable deduction</th>
                  <th className="text-right py-3 px-4 text-brand-700">Est. PAYE saved (30%)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(r => (
                  <tr key={r.interest} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{fmt(r.interest)}{r.interest > CAP && <span className="text-stone-500 text-xs"> (capped)</span>}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(r.allowed)}</td>
                    <td className="py-3 px-4 text-right text-brand-700 font-bold">{fmt(r.saved)}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            If you pay tax in the 25% band your saving is lower; in the 32.5% or 35% bands it is higher. Use the full
            calculator for your exact figure.
          </p>
        </section>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Who qualifies</h2>
          <div className="space-y-3">
            {[
              'The loan is from a specified financial institution (a bank, building society or similar listed in the Income Tax Act).',
              'The money was used to buy or improve a home that you occupy as your primary residence.',
              'You claim on only one property at a time.',
              'You hold the mortgage statement showing the interest portion of your repayments.',
            ].map((req, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <p className="text-stone-300 text-sm leading-relaxed">{req}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to claim */}
        <section className="mb-10">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              How to claim it (and why most people miss out)
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-3">
              Submit your annual mortgage interest certificate to your employer's HR/payroll team. From 2026 employers
              are expected to apply the relief monthly rather than at year-end. If it was not applied during the year,
              you can claim it on your annual iTax return for a refund. Thousands of borrowers never submit the
              statement and lose up to KES 9,000 a month — if you have a home loan, send it to HR today.
            </p>
            <Link href="/guides/tax-relief" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
              See all Kenya tax reliefs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-brand-600 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-all">
            Calculate your net pay with mortgage relief →
          </Link>
        </div>

        {/* Related */}
        <section className="border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related tools &amp; guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="font-semibold text-white text-sm group-hover:text-brand-700 transition-colors flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> PAYE Calculator</span>
              <span className="text-stone-500 text-xs">Add mortgage relief and see net pay</span>
            </Link>
            <Link href="/guides/tax-relief" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="font-semibold text-white text-sm group-hover:text-brand-700 transition-colors">All Tax Reliefs</span>
              <span className="text-stone-500 text-xs">Pension, insurance, disability &amp; more</span>
            </Link>
            <Link href="/blog/claiming-mortgage-interest-relief-on-your-kenyan-tax-return" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="font-semibold text-white text-sm group-hover:text-brand-700 transition-colors">Claiming Guide</span>
              <span className="text-stone-500 text-xs">Step-by-step on your tax return</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

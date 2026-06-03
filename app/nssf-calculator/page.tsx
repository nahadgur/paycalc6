import type { Metadata } from 'next'
import Link from 'next/link'
import { Landmark, TrendingUp, CheckCircle2, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'NSSF Calculator Kenya 2026 | New Tier I & II Rates (Max KES 6,480)',
  description:
    'Free NSSF calculator for Kenya 2026. See your new Tier I and Tier II deduction at any salary under the February 2026 rates — 6% up to the KES 108,000 upper limit, max KES 6,480/month.',
  keywords: [
    'NSSF calculator Kenya', 'new NSSF rates calculator 2026', 'NSSF Tier 1 Tier 2 calculator',
    'NSSF 2026 Kenya', 'NSSF deduction calculator', 'NSSF upper limit 108000',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/nssf-calculator' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)

// 2026 NSSF Phase 4 constants (effective 1 Feb 2026)
const RATE = 0.06
const LEL = 9000      // Lower Earnings Limit (Tier I ceiling)
const UEL = 108000    // Upper Earnings Limit (Tier II ceiling)

function nssf(gross: number) {
  const tier1 = Math.min(gross, LEL) * RATE
  const tier2 = Math.max(0, Math.min(gross, UEL) - LEL) * RATE
  const employee = tier1 + tier2
  return { tier1, tier2, employee, employer: employee, combined: employee * 2 }
}

const SALARIES = [10000, 20000, 30000, 40000, 50000, 60000, 75000, 100000, 108000, 150000, 250000]

export default function NSSFCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'NSSF Calculator Kenya 2026',
        url: 'https://payecalculator.co.ke/nssf-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Calculate your NSSF deduction in Kenya under the February 2026 Phase 4 rates, with the Tier I and Tier II breakdown.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the maximum NSSF deduction in 2026?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'KES 6,480 per month for the employee (KES 540 Tier I + KES 5,940 Tier II), matched by the employer for a combined KES 12,960. You reach the maximum once pensionable pay is KES 108,000 or more.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is NSSF calculated in Kenya?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'NSSF is 6% of your pensionable pay up to an upper limit of KES 108,000. Tier I covers the first KES 9,000 and Tier II covers the balance up to KES 108,000, both at 6%.',
            },
          },
          {
            '@type': 'Question',
            name: 'When did the new NSSF rates start?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The new (Phase 4) NSSF limits took effect from the February 2026 payroll period, i.e. 1 February 2026.',
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5">
            <Landmark className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">New rates · effective 1 Feb 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">NSSF Calculator Kenya 2026 — Tier I &amp; Tier II</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            From February 2026, NSSF is 6% of your pay up to a new upper limit of KES 108,000 — a maximum of
            KES 6,480 a month. Find your exact deduction below, then open the full calculator to see your net pay.
          </p>
        </div>

        {/* Key figures */}
        <section className="mb-10">
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'Contribution rate', value: '6%', sub: 'Employee + 6% employer' },
              { label: 'Upper earnings limit', value: 'KES 108,000', sub: 'Up from KES 72,000' },
              { label: 'Max employee NSSF', value: 'KES 6,480/mo', sub: 'Up from KES 4,320' },
            ].map(card => (
              <div key={card.label} className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <p className="text-stone-400 text-xs mb-1">{card.label}</p>
                <p className="text-blue-400 text-xl font-black">{card.value}</p>
                <p className="text-stone-500 text-xs mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tier structure */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">How the two tiers work</h2>
          <p className="text-stone-400 text-sm mb-5 leading-relaxed">
            Your contribution is split into two tiers, both charged at 6%. Tier I covers the first KES 9,000 of
            pensionable pay; Tier II covers the rest up to the KES 108,000 ceiling.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 px-4 text-stone-400">Tier</th>
                  <th className="text-left py-3 px-4 text-stone-400">Pensionable pay band</th>
                  <th className="text-right py-3 px-4 text-stone-400">Rate</th>
                  <th className="text-right py-3 px-4 text-blue-400">Max employee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5"><td className="py-3 px-4 text-white">Tier I</td><td className="py-3 px-4 text-stone-400">First KES 9,000</td><td className="py-3 px-4 text-right text-stone-400">6%</td><td className="py-3 px-4 text-right text-stone-300">KES 540</td></tr>
                <tr className="border-b border-white/5"><td className="py-3 px-4 text-white">Tier II</td><td className="py-3 px-4 text-stone-400">KES 9,001 – 108,000</td><td className="py-3 px-4 text-right text-stone-400">6%</td><td className="py-3 px-4 text-right text-stone-300">KES 5,940</td></tr>
                <tr className="bg-white/5"><td className="py-3 px-4 text-white font-bold">Total</td><td className="py-3 px-4 text-stone-300">Up to KES 108,000</td><td className="py-3 px-4 text-right text-stone-300 font-bold">6%</td><td className="py-3 px-4 text-right text-blue-400 font-bold">KES 6,480</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Deduction by salary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">Your NSSF deduction by salary (2026)</h2>
          <p className="text-stone-400 text-sm mb-5">Monthly employee deduction at common salary levels, with the Tier I / Tier II split.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 px-4 text-stone-400">Monthly gross</th>
                  <th className="text-right py-3 px-4 text-stone-400">Tier I</th>
                  <th className="text-right py-3 px-4 text-stone-400">Tier II</th>
                  <th className="text-right py-3 px-4 text-blue-400">Employee NSSF</th>
                  <th className="text-right py-3 px-4 text-stone-400">+ Employer</th>
                </tr>
              </thead>
              <tbody>
                {SALARIES.map(s => {
                  const c = nssf(s)
                  return (
                    <tr key={s} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{fmt(s)}{s >= UEL && <span className="text-stone-500 text-xs"> +</span>}</td>
                      <td className="py-3 px-4 text-right text-stone-400">{fmt(c.tier1)}</td>
                      <td className="py-3 px-4 text-right text-stone-400">{fmt(c.tier2)}</td>
                      <td className="py-3 px-4 text-right text-blue-400 font-bold">{fmt(c.employee)}</td>
                      <td className="py-3 px-4 text-right text-stone-500">{fmt(c.employer)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-600 mt-2">At KES 108,000 and above the employee deduction is capped at KES 6,480/month.</p>
        </section>

        {/* What changed */}
        <section className="mb-10">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              What changed in February 2026
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-3">
              The rate did not change — it is still 6%. What changed is the <strong className="text-white">upper earnings limit, which rose from KES 72,000 to KES 108,000</strong>,
              and the lower limit, from KES 8,000 to KES 9,000. The result: the maximum employee deduction increased from KES 4,320 to KES 6,480 a month.
              NSSF is an allowable deduction for PAYE, so part of the increase is offset by slightly lower income tax.
            </p>
            <Link href="/statutory-changes" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
              Read the full SHIF &amp; NSSF 2026 changes <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-red-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-all">
            See your full net pay with the PAYE calculator →
          </Link>
        </div>

        {/* Related */}
        <section className="border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related tools &amp; guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> PAYE Calculator</span>
              <span className="text-stone-500 text-xs">Net salary with NSSF, SHIF &amp; levy</span>
            </Link>
            <Link href="/blog/the-complete-guide-to-nssf-contributions-in-kenya-for-2026" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">NSSF 2026 Guide</span>
              <span className="text-stone-500 text-xs">Rates, tiers, benefits &amp; rules</span>
            </Link>
            <Link href="/statutory-changes" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Statutory Changes</span>
              <span className="text-stone-500 text-xs">All 2026 SHIF &amp; NSSF updates</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

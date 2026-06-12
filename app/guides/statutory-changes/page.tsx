import type { Metadata } from 'next'
import { SpokeGrid } from '@/components/SpokeGrid'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import Hero from '@/components/Hero'

export const metadata: Metadata = {
  title: 'SHIF & NSSF 2026 Changes Kenya | Complete Statutory Transition Guide',
  description: 'Everything you need to know about SHIF replacing NHIF and the February 2026 NSSF limit increases. Rates, deductions, payroll impact, and what changed for employers and employees.',
  keywords: ['SHIF Kenya 2026','NSSF changes 2026','NHIF replaced by SHIF','NSSF new rates Kenya','statutory deductions Kenya 2026'],
  alternates: { canonical: 'https://payecalculator.co.ke/guides/statutory-changes' },
}

const SHIF_COMPARISON = [
  { feature: 'Rate structure',       nhif: 'Fixed tiered (KES 150–1,700/month)', shif: '2.75% of gross salary' },
  { feature: 'Minimum deduction',    nhif: 'KES 150 (low earners)',              shif: 'KES 300/month' },
  { feature: 'High earner impact',   nhif: 'KES 1,700 (max)',                   shif: 'No cap — scales with salary' },
  { feature: 'Who pays',             nhif: 'Employee only',                      shif: 'Employee only (2.75%, no employer match)' },
  { feature: 'Informal sector',      nhif: 'Limited coverage',                   shif: 'Voluntary KES 300 minimum' },
  { feature: 'Hospital network',     nhif: '~1,200 hospitals',                   shif: '3,000+ empaneled facilities' },
  { feature: 'Coverage',             nhif: '22% of population',                  shif: '99% target' },
  { feature: 'Tax relief',           nhif: 'Limited',                            shif: 'Up to 15% of premium on employee share' },
]

// NSSF is 6% of pensionable pay on both tiers, so the employee deduction is
// simply 6% of pay up to the upper limit. Only the upper limit changed (Feb 2026):
// KES 72,000 -> 108,000, so the max employee contribution rose 4,320 -> 6,480.
// Earners below KES 72,000 see no change.
const NSSF_COMPARISON = [
  { band: 'Up to KES 72,000',      old2024: '6% of pay (max KES 4,320)', new2026: '6% of pay (unchanged)', change: 'No change' },
  { band: 'KES 90,000',            old2024: 'KES 4,320 (old cap)',       new2026: 'KES 5,400',            change: '+KES 1,080/mo' },
  { band: 'KES 108,000 and above', old2024: 'KES 4,320 (old cap)',       new2026: 'KES 6,480 (new cap)',  change: '+KES 2,160/mo' },
]

// SHIF is 2.75% of gross (employee only). NSSF figures use the 6% / tier rules:
// at KES 50,000 the salary is below the old 72,000 cap, so NSSF is unchanged.
const PAYROLL_EXAMPLES = [
  {
    gross: 50000,
    label: 'KES 50,000 salary',
    nhif: 1000,
    shif: 1375,
    nssfOld: 3000,
    nssfNew: 3000,
    impact: '+KES 375/month more in deductions',
  },
  {
    gross: 100000,
    label: 'KES 100,000 salary',
    nhif: 1700,
    shif: 2750,
    nssfOld: 4320,
    nssfNew: 6000,
    impact: '+KES 2,730/month more in deductions',
  },
  {
    gross: 200000,
    label: 'KES 200,000 salary',
    nhif: 1700,
    shif: 5500,
    nssfOld: 4320,
    nssfNew: 6480,
    impact: '+KES 5,960/month more in deductions',
  },
]

const EMPLOYER_CHECKLIST = [
  'Update payroll software to use the 2.75% SHIF rate instead of the old NHIF tiered table',
  'Deduct SHIF at 2.75% of gross from each employee (employee-only — there is no matching employer SHIF contribution) and remit to SHA',
  'Register employees with SHA (Social Health Authority) if not already done via eCitizen',
  'Update monthly P10 remittance to include SHIF separately from PAYE',
  'Ensure SHIF and NSSF remittances are reconciled before the 9th (SHIF) and 15th (NSSF) monthly deadlines',
  'Issue updated payslip format showing SHIF (not NHIF) as the health deduction line item',
  'Apply the higher NSSF upper limit of KES 108,000 from February 2026 — max employee deduction is now KES 6,480',
  'Remember the employer still matches NSSF (6%) and the Housing Levy (1.5%), but not SHIF',
]

const TIMELINE = [
  { date: 'Oct 2024', event: 'SHIF deductions officially begin', status: 'done' },
  { date: 'Dec 2024', event: 'Mortgage interest relief raised to KES 30,000/month', status: 'done' },
  { date: 'Jun 2025', event: 'Full NHIF dissolution — all records transferred to SHA', status: 'done' },
  { date: 'Jan 2026', event: 'SHIF 2.75% flat rate fully operational', status: 'done' },
  { date: 'Feb 2026', event: 'NSSF upper limit raised from KES 72,000 to KES 108,000 (max employee KES 6,480)', status: 'done' },
  { date: 'Jun 2026', event: 'Annual review of SHIF rates by the SHA board', status: 'upcoming' },
]

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)

export default function StatutoryChangesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'SHIF and NSSF 2026 Changes — Complete Kenya Statutory Transition Guide',
    description: 'Full guide to SHIF replacing NHIF and the NSSF rate changes in 2026 for Kenyan employers and employees.',
    url: 'https://payecalculator.co.ke/guides/statutory-changes',
    dateModified: '2026-04-06',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <Hero
        h1="SHIF & NSSF 2026 — What Changed and What It Costs You"
        desc="The biggest overhaul to Kenyan statutory deductions in a decade. NHIF is gone, SHIF is here, and the NSSF limits have risen. Here is the definitive guide for employees and employers."
        cta={{ href: '/nssf-calculator', label: 'NSSF calculator →' }}
      />

      <div className="paye-calc-body min-h-screen pt-8 pb-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Quick impact summary */}
        <section className="mb-10">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Bottom Line: How Much More Are You Paying?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-stone-400">Salary</th>
                    <th className="text-right py-2 px-3 text-stone-400">Old NHIF</th>
                    <th className="text-right py-2 px-3 text-stone-400">New SHIF</th>
                    <th className="text-right py-2 px-3 text-stone-400">Old NSSF</th>
                    <th className="text-right py-2 px-3 text-stone-400">New NSSF</th>
                    <th className="text-right py-2 px-3 text-amber-400 font-semibold">Net Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYROLL_EXAMPLES.map(ex => (
                    <tr key={ex.label} className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-white font-medium">{ex.label}</td>
                      <td className="py-2.5 px-3 text-right text-stone-400">{fmt(ex.nhif)}</td>
                      <td className="py-2.5 px-3 text-right text-red-400">{fmt(ex.shif)}</td>
                      <td className="py-2.5 px-3 text-right text-stone-400">{fmt(ex.nssfOld)}</td>
                      <td className="py-2.5 px-3 text-right text-amber-400">{fmt(ex.nssfNew)}</td>
                      <td className="py-2.5 px-3 text-right text-amber-400 font-semibold">{ex.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone-500 mt-3">Note: SHIF is 2.75% of gross, paid entirely by the employee. Unlike NSSF and the Housing Levy, there is no matching employer SHIF contribution; the employer only deducts and remits it.</p>
          </div>
        </section>

        {/* SHIF vs NHIF comparison */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">SHIF vs NHIF — Side by Side</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-3 px-4 text-stone-400">Feature</th>
                  <th className="text-left py-3 px-4 text-stone-500 line-through">NHIF (Old)</th>
                  <th className="text-left py-3 px-4 text-emerald-400">SHIF (2026)</th>
                </tr>
              </thead>
              <tbody>
                {SHIF_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-stone-300 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-stone-500">{row.nhif}</td>
                    <td className="py-3 px-4 text-emerald-400">{row.shif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SHIF calculation examples */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">SHIF Calculation Examples (2026)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { gross: 20000,  label: 'KES 20,000' },
              { gross: 50000,  label: 'KES 50,000' },
              { gross: 100000, label: 'KES 100,000' },
              { gross: 300000, label: 'KES 300,000' },
            ].map(ex => {
              const raw  = ex.gross * 0.0275
              const shif = Math.max(raw, 300)
              return (
                <div key={ex.gross} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="font-bold text-white mb-3">{ex.label} gross salary</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-stone-400">2.75% × {ex.label}</span><span className="text-white">{fmt(raw)}</span></div>
                    <div className="flex justify-between"><span className="text-stone-400">Minimum (KES 300)</span><span className="text-stone-400">{raw < 300 ? 'applies' : 'not reached'}</span></div>
                    <div className="flex justify-between border-t border-white/10 pt-1.5 font-semibold"><span className="text-stone-300">Employee pays (no employer match)</span><span className="text-red-400">{fmt(shif)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* NSSF changes */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-2">NSSF 2026 — Rate Changes</h2>
          <p className="text-stone-400 text-sm mb-5">
            From 1 February 2026 the NSSF upper earnings limit rose from KES 72,000 to KES 108,000, and the lower limit from KES 8,000 to KES 9,000. The 6% rate is unchanged, so the maximum employee contribution increased from KES 4,320 to KES 6,480 a month, matched by the employer for a combined KES 12,960. Earners below KES 72,000 are unaffected.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-3 px-4 text-stone-400">Monthly gross</th>
                  <th className="text-left py-3 px-4 text-stone-500">Employee NSSF (until Jan 2026)</th>
                  <th className="text-left py-3 px-4 text-emerald-400">From Feb 2026</th>
                  <th className="text-right py-3 px-4 text-amber-400">Change</th>
                </tr>
              </thead>
              <tbody>
                {NSSF_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{row.band}</td>
                    <td className="py-3 px-4 text-stone-400">{row.old2024}</td>
                    <td className="py-3 px-4 text-emerald-400">{row.new2026}</td>
                    <td className="py-3 px-4 text-right text-amber-400">{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-500 mt-2">NSSF rates shown are indicative based on the phased implementation schedule. Verify current rates at nssf.or.ke.</p>
        </section>

        {/* Employer checklist */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Employer Compliance Checklist — SHIF &amp; NSSF 2026</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="space-y-3">
              {EMPLOYER_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Timeline of Changes</h2>
          <div className="space-y-3">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${
                item.status === 'active'   ? 'border-emerald-500/30 bg-emerald-500/5' :
                item.status === 'upcoming' ? 'border-amber-500/20 bg-amber-500/5' :
                                            'border-white/10 bg-white/5 opacity-70'
              }`}>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${
                  item.status === 'active'   ? 'bg-emerald-500/20 text-emerald-400' :
                  item.status === 'upcoming' ? 'bg-amber-500/20 text-amber-400' :
                                              'bg-stone-700 text-stone-400'
                }`}>{item.date}</span>
                <p className={`text-sm ${item.status === 'done' ? 'text-stone-400' : 'text-stone-300'}`}>{item.event}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/" className="flex items-center justify-between bg-gradient-to-r from-red-500/20 to-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl p-5 transition-all group">
            <div>
              <p className="font-bold text-white">Recalculate with New Rates</p>
              <p className="text-stone-400 text-xs mt-1">See your updated take-home with SHIF &amp; NSSF 2026</p>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </Link>
          <Link href="/guides/employer-guide" className="flex items-center justify-between bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-xl p-5 transition-all group">
            <div>
              <p className="font-bold text-white">Employer Compliance Guide</p>
              <p className="text-stone-400 text-xs mt-1">Full payroll compliance checklist for HR and finance</p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-500 group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>

        <SpokeGrid siloKey="news-updates" />

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🧮</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">PAYE Calculator</span>
              <span className="text-stone-500 text-xs">See your updated take-home</span>
            </Link>
            <Link href="/guides/tax-relief" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">💰</span>
              <span className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">Tax Relief Guide</span>
              <span className="text-stone-500 text-xs">Legally reduce your PAYE</span>
            </Link>
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar</span>
              <span className="text-stone-500 text-xs">SHIF & NSSF remittance dates</span>
            </Link>
            <Link href="/guides/employer-guide" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🏢</span>
              <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">Employer Guide</span>
              <span className="text-stone-500 text-xs">Payroll compliance obligations</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">PAYE FAQ</span>
              <span className="text-stone-500 text-xs">SHIF & NSSF questions answered</span>
            </Link>
            <Link href="/p9-generator" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📄</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">P9 Form Generator</span>
              <span className="text-stone-500 text-xs">Create updated P9 certificates</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Related tools and guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🧮</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE Calculator</p>
                <p className="text-stone-500 text-xs mt-0.5">See your updated take-home with 2026 SHIF & NSSF</p>
              </div>
            </Link>
            <Link href="/guides/tax-relief" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">💰</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Relief Hub</p>
                <p className="text-stone-500 text-xs mt-0.5">Offset higher deductions with legal reliefs</p>
              </div>
            </Link>
            <Link href="/guides/employer-guide" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🏢</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Employer Compliance</p>
                <p className="text-stone-500 text-xs mt-0.5">Update payroll for SHIF — full checklist</p>
              </div>
            </Link>
            <Link href="/faq" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">❓</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">SHIF FAQs</p>
                <p className="text-stone-500 text-xs mt-0.5">Is SHIF mandatory? Does my employer pay too?</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
      </div>
    </>
  )
}

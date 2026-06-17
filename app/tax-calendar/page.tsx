import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, AlertTriangle, FileText } from 'lucide-react'
import { SpokeGrid } from '@/components/SpokeGrid'

export const metadata: Metadata = {
  title: { absolute: 'KRA Tax Calendar 2026 | PAYE, NSSF, SHIF & iTax Dates' },
  description: 'The 2026 KRA tax calendar for Kenya: monthly PAYE, NSSF, SHIF and Housing Levy dates plus annual iTax return deadlines for employers and staff.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/tax-calendar' },
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

type Deadline = {
  day: number
  label: string
  type: 'employer' | 'employee' | 'both'
  description: string
  penalty?: string
}

const MONTHLY_DEADLINES: Deadline[] = [
  {
    day: 9,
    label: 'PAYE Remittance',
    type: 'employer',
    description: 'Employers must remit all PAYE deducted from employee salaries for the previous month via KRA iTax. File P10 return and pay.',
    penalty: '5% of unpaid tax + 1% per month interest',
  },
  {
    day: 9,
    label: 'SHIF Contribution',
    type: 'employer',
    description: 'Social Health Insurance Fund contributions (2.75% employee share + employer match) remitted to SHA via payroll integration.',
    penalty: '2% monthly on outstanding balance',
  },
  {
    day: 9,
    label: 'Housing Levy',
    type: 'employer',
    description: 'Affordable Housing Levy — 1.5% employee + 1.5% employer of gross salary — remitted to KRA alongside PAYE.',
    penalty: '5% + 1% per month',
  },
  {
    day: 15,
    label: 'NSSF Remittance',
    type: 'employer',
    description: 'NSSF contributions (employee 6% + employer 6%, capped at KES 108,000 pensionable pay from Feb 2026, max KES 6,480 each) remitted to NSSF portal or M-Pesa Paybill 333300.',
    penalty: '5% initial + 1% monthly interest',
  },
]

const ANNUAL_DEADLINES = [
  { date: 'January 31', label: 'P9 Forms Due to Employees', type: 'employer' as const, description: 'Employers must issue P9 tax deduction certificates to all employees by January 31 for the previous tax year. Failure is a violation of the Income Tax Act.' },
  { date: 'February 28', label: 'NSSF Annual Return', type: 'employer' as const, description: 'Annual NSSF return submission for the previous year. Employers with 5+ employees must submit audited contribution schedules.' },
  { date: 'March 31', label: 'Employer Annual Return (IT2C)', type: 'employer' as const, description: 'Annual return of income for employers showing aggregate PAYE collected. Filed via iTax portal.' },
  { date: 'April 30', label: 'Instalment Tax (1st Quarter)', type: 'both' as const, description: 'First instalment tax payment for individuals and companies with business income outside PAYE. 25% of estimated annual tax liability.' },
  { date: 'June 30', label: 'Individual Income Tax Return', type: 'employee' as const, description: 'Annual iTax income tax return deadline for all resident individuals. Salaried employees with only PAYE income may qualify for a simplified return using just their KRA PIN and national ID.' },
  { date: 'June 30', label: 'Capital Gains Tax (2nd Quarter)', type: 'both' as const, description: 'Second instalment tax payment (50% cumulative). Also the deadline for capital gains tax on property disposals.' },
  { date: 'September 30', label: 'Instalment Tax (3rd Quarter)', type: 'both' as const, description: 'Third instalment tax payment (75% cumulative of estimated annual liability).' },
  { date: 'November 30', label: 'PAYE Annual Reconciliation', type: 'employer' as const, description: 'Employers must reconcile total PAYE remitted against the sum of all P9 certificates issued. Discrepancies must be resolved before year-end.' },
  { date: 'December 20', label: 'Final Instalment Tax', type: 'both' as const, description: 'Fourth and final instalment tax payment (100% of estimated annual liability). No penalties for minor underpayments if within threshold.' },
]

const PENALTY_GUIDE = [
  { item: 'Late PAYE Filing', penalty: '5% of the tax due, minimum KES 10,000', interest: '1% per month on outstanding' },
  { item: 'Failure to File Return', penalty: 'KES 20,000 per return for individuals; KES 50,000 for companies', interest: '1% per month' },
  { item: 'Late NSSF Payment', penalty: '5% of contribution due', interest: '1% per month compound' },
  { item: 'Late SHIF Payment', penalty: '2% of outstanding amount per month', interest: 'Compounded monthly' },
  { item: 'False P9 Information', penalty: 'Criminal prosecution under Income Tax Act Cap 470', interest: 'N/A' },
  { item: 'Late Housing Levy', penalty: '5% + 1% per month', interest: 'KRA discretionary waiver available' },
]

const typeConfig = {
  employer: { label: 'Employer', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  employee: { label: 'Employee', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  both:     { label: 'Both',    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
}

export default function TaxCalendarPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'KRA Tax Calendar 2026 — All PAYE, NSSF, SHIF & iTax Deadlines',
    description: 'Complete calendar of KRA tax deadlines for 2026 including monthly PAYE remittance, NSSF, SHIF, and annual iTax filing dates.',
    url: 'https://www.payecalculator.co.ke/tax-calendar',
    dateModified: '2026-04-06',
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">KRA Tax Calendar 2026</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            Every PAYE, NSSF, SHIF, Housing Levy, and iTax filing deadline for Kenyan employers and employees.
            Missing a deadline can trigger penalties of 5% + 1% per month.
          </p>
        </div>

        {/* Monthly recurring deadlines */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            Monthly Recurring Deadlines (Every Month)
          </h2>
          <div className="space-y-3">
            {MONTHLY_DEADLINES.map(d => {
              const tc = typeConfig[d.type]
              return (
                <div key={d.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-500/20 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-red-400 font-black text-lg leading-none">{d.day}</span>
                      <span className="text-red-400/60 text-xs">of month</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{d.label}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${tc.color}`}>{tc.label}</span>
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed mb-2">{d.description}</p>
                      {d.penalty && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>Late penalty: {d.penalty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Monthly calendar grid */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            2026 Monthly Remittance Calendar
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MONTHS.map((month, i) => {
              const payeDate   = `${month.slice(0,3)} 9`
              const nssfDate   = `${month.slice(0,3)} 15`
              return (
                <div key={month} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="font-bold text-white text-sm mb-3">{month} 2026</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">PAYE + SHIF + Housing</span>
                      <span className="text-red-400 font-semibold">{payeDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">NSSF</span>
                      <span className="text-blue-400 font-semibold">{nssfDate}</span>
                    </div>
                    {i === 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-amber-400/80">
                        ⚡ P9 forms due Jan 31
                      </div>
                    )}
                    {i === 1 && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-amber-400/80">
                        ⚡ NSSF annual return Feb 28
                      </div>
                    )}
                    {i === 5 && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-emerald-400/80">
                        🔴 iTax return Jun 30
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Annual deadlines */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Annual Key Dates 2026
          </h2>
          <div className="space-y-3">
            {ANNUAL_DEADLINES.map(d => {
              const tc = typeConfig[d.type]
              const isITax = d.label.includes('Individual')
              return (
                <div key={d.label} className={`border rounded-xl p-5 ${isITax ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`px-3 py-2 rounded-xl text-center shrink-0 ${isITax ? 'bg-emerald-500/20' : 'bg-amber-500/10'}`}>
                      <span className={`text-sm font-black ${isITax ? 'text-emerald-400' : 'text-amber-400'}`}>{d.date}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-sm">{d.label}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${tc.color}`}>{tc.label}</span>
                        {isITax && <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">⭐ Key deadline</span>}
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed">{d.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* iTax June 30 spotlight */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-2">June 30 — The Most Important Date for Employees</h2>
                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                  Every Kenyan with a KRA PIN must file an income tax return by June 30 each year. In 2026,
                  salaried employees can file in minutes — the iTax system now pulls payroll data automatically
                  from employer submissions. You will need your KRA PIN and national ID.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  {[
                    { title: 'Nil return', desc: 'If you earned below the tax threshold — file a nil return to avoid penalties' },
                    { title: 'PAYE only', desc: 'Salaried employees can use simplified pre-filled return from 2026' },
                    { title: 'Other income', desc: 'Business income, rental, or dividends require a full self-assessment return' },
                  ].map(item => (
                    <div key={item.title} className="bg-white/5 rounded-xl p-3">
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-stone-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Penalty guide */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Late Filing Penalties Quick Reference
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 px-4 text-stone-400 font-medium">Obligation</th>
                  <th className="text-left py-3 px-4 text-stone-400 font-medium">Penalty</th>
                  <th className="text-left py-3 px-4 text-stone-400 font-medium">Interest</th>
                </tr>
              </thead>
              <tbody>
                {PENALTY_GUIDE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-medium">{row.item}</td>
                    <td className="py-3 px-4 text-red-400">{row.penalty}</td>
                    <td className="py-3 px-4 text-amber-400">{row.interest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            KRA may issue penalty waivers on application for first-time offenders in genuine hardship cases. Contact KRA on 0800 722 226 (toll-free).
          </p>
        </section>

        {/* CTA */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div>
            <h2 className="font-bold text-white mb-1">Ready to file?</h2>
            <p className="text-stone-400 text-sm">Use our calculators to prepare your figures before logging into iTax.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/" className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90">
              PAYE Calculator
            </Link>
            <Link href="/p9-generator" className="px-5 py-2.5 border border-white/20 text-white rounded-xl text-sm hover:border-amber-500/50 transition-colors">
              P9 Generator
            </Link>
          </div>
        </div>


        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/p9-generator" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📄</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">P9 Form Generator</span>
              <span className="text-stone-500 text-xs">Create certificates before Jan 31</span>
            </Link>
            <Link href="/itax-2026" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🖥️</span>
              <span className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">KRA iTax 2026</span>
              <span className="text-stone-500 text-xs">How pre-filled returns work in 2026</span>
            </Link>
            <Link href="/guides/employer-guide" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🏢</span>
              <span className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">Employer Guide</span>
              <span className="text-stone-500 text-xs">Full remittance obligations</span>
            </Link>
            <Link href="/kra-offices" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🗺️</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">KRA Offices</span>
              <span className="text-stone-500 text-xs">In-person help near you</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">PAYE FAQ</span>
              <span className="text-stone-500 text-xs">Deadline penalty questions</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Prepare for the deadlines</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/p9-generator" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📄</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Generate P9 Forms</p>
                <p className="text-stone-500 text-xs mt-0.5">Due to employees by 31 January</p>
              </div>
            </Link>
            <Link href="/itax-2026" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">💻</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">iTax 2026 Guide</p>
                <p className="text-stone-500 text-xs mt-0.5">How to file your June 30 return</p>
              </div>
            </Link>
            <Link href="/guides/employer-guide" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🏢</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Employer Compliance</p>
                <p className="text-stone-500 text-xs mt-0.5">Monthly P10 obligations and penalties</p>
              </div>
            </Link>
            <Link href="/" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🧮</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE Calculator</p>
                <p className="text-stone-500 text-xs mt-0.5">Verify your figures before filing</p>
              </div>
            </Link>
          </div>
        </section>

        <SpokeGrid siloKey="news-updates" heading="Payroll news & updates" />
      </div>
    </div>
  )
}

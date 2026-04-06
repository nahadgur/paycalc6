import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, CheckCircle2, AlertTriangle, TrendingUp, Clock, FileText, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kenya Employer Payroll Compliance Guide 2026 | PAYE, NSSF, SHIF & Housing Levy',
  description: 'Complete payroll compliance guide for Kenyan employers and HR managers 2026. True cost of hiring, P10 filing, PAYE remittance, SHIF, NSSF, and Housing Levy obligations explained.',
  keywords: ['employer PAYE Kenya','payroll compliance Kenya 2026','true cost hiring Kenya','P10 return Kenya','NSSF employer contribution'],
  alternates: { canonical: 'https://payecalculator.co.ke/employer-guide' },
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)

function calcEmployerCost(gross: number) {
  const nssf        = Math.min(gross, 72000) * 0.06
  const housing     = gross * 0.015
  const shif        = Math.max(gross * 0.01375, 150)
  const total       = gross + nssf + housing + shif
  const overhead    = ((total - gross) / gross) * 100
  return { nssf, housing, shif, total, overhead }
}

const HIRING_COSTS = [50000, 100000, 150000, 250000].map(gross => ({
  gross,
  ...calcEmployerCost(gross),
}))

const MONTHLY_OBLIGATIONS = [
  {
    deadline: '9th',
    title: 'File and Pay PAYE (P10 Return)',
    detail: 'Monthly PAYE return (P10) filed via iTax showing each employee\'s gross pay, PAYE deducted, and cumulative year-to-date figures. Payment via KRA paybill or bank transfer.',
    penalty: '5% of tax due + 1% per month interest',
    platform: 'itax.kra.go.ke',
  },
  {
    deadline: '9th',
    title: 'Remit SHIF Contributions',
    detail: 'Social Health Insurance Fund: 1.375% employee + 1.375% employer of each employee\'s gross salary. Remit via SHA portal or through KRA payroll integration.',
    penalty: '2% monthly on outstanding balance',
    platform: 'sha.go.ke / itax.kra.go.ke',
  },
  {
    deadline: '9th',
    title: 'Remit Housing Levy',
    detail: 'Affordable Housing Levy: 1.5% employee + 1.5% employer of gross salary for every employee. Remitted via KRA iTax alongside PAYE.',
    penalty: '5% + 1% per month',
    platform: 'itax.kra.go.ke',
  },
  {
    deadline: '15th',
    title: 'Remit NSSF Contributions',
    detail: 'Employee NSSF (6% of pensionable pay, max KES 72,000) plus matching employer contribution. File via NSSF employer portal or M-Pesa Paybill 333300.',
    penalty: '5% of contribution + 1% monthly interest',
    platform: 'nssf.or.ke',
  },
]

const ANNUAL_OBLIGATIONS = [
  { date: 'January 31', obligation: 'Issue P9 certificates to all employees', priority: 'high' },
  { date: 'February 28', obligation: 'File NSSF annual return', priority: 'medium' },
  { date: 'March 31', obligation: 'File employer annual IT2C return via iTax', priority: 'high' },
  { date: 'Ongoing', obligation: 'E-TIMS receipts for all business expenses', priority: 'high' },
  { date: 'November 30', obligation: 'PAYE annual reconciliation — resolve discrepancies before year-end', priority: 'medium' },
]

const NEW_EMPLOYEE_CHECKLIST = [
  'Request KRA PIN from employee on day 1 — file their PAYE from first salary',
  'Register employee with NSSF portal within 30 days of employment',
  'Register with SHA for SHIF coverage',
  'Collect mortgage, pension, and insurance documentation to apply applicable reliefs from day 1',
  'Verify national ID for PAYE records',
  'Add to P10 return from the month employment begins',
  'Inform employee of their right to a P9 form at year-end',
  'If hiring a Person with Disability (PWD), collect NCPWD card for KES 150,000 monthly relief',
]

const COMMON_MISTAKES = [
  {
    mistake: 'Not applying reliefs employees have submitted',
    consequence: 'Employee overpays PAYE — files for a refund at year-end. You may face employee complaints and audit queries.',
    fix: 'Set up a document collection process. Collect mortgage statements, pension certificates, and insurance policies at hire and at the start of each year.',
  },
  {
    mistake: 'Late P10 filing even when PAYE is zero',
    consequence: 'KES 20,000 penalty per late return, even if you owe no tax. The return itself is mandatory regardless of tax position.',
    fix: 'File P10 by the 9th every month without exception. Set an automated reminder. Use payroll software that auto-generates the P10.',
  },
  {
    mistake: 'Forgetting employer SHIF is now mandatory',
    consequence: 'Unlike NHIF (employee-only), SHIF requires an equal employer contribution. Omitting this understates your payroll cost and creates a compliance liability.',
    fix: 'Budget 1.375% of each employee\'s gross salary as an additional employer cost when hiring.',
  },
  {
    mistake: 'Not collecting E-TIMS receipts for expense claims',
    consequence: 'Employee expense reimbursements without E-TIMS receipts may not be tax-deductible for the business from 2026, increasing your corporate tax burden.',
    fix: 'Update your expense policy: all claims above KES 1,000 require an E-TIMS receipt. Educate employees on requesting E-TIMS invoices from suppliers.',
  },
  {
    mistake: 'NSSF contribution calculation error at upper limit',
    consequence: 'Calculating NSSF on full salary above KES 72,000 pensionable pay ceiling results in over-deduction from employee and employer.',
    fix: 'Cap NSSF calculation at KES 72,000 pensionable pay. Verify your payroll software applies the ceiling correctly.',
  },
]

const PAYSLIP_ELEMENTS = [
  'Employee name and KRA PIN',
  'Employer name and KRA PIN',
  'Month and year of pay',
  'Gross salary (basic + all allowances itemised)',
  'PAYE tax deducted',
  'NSSF employee contribution',
  'SHIF employee contribution',
  'Housing Levy (employee share)',
  'Any voluntary deductions (HELB, SACCO, union dues)',
  'Total deductions',
  'Net pay',
  'Reliefs applied (mortgage, pension, insurance) — if any',
]

export default function EmployerGuidePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Kenya Employer Payroll Compliance Guide 2026',
    description: 'Complete payroll compliance obligations for Kenyan employers: PAYE, NSSF, SHIF, Housing Levy, P10 filing, and true cost of hiring.',
    url: 'https://payecalculator.co.ke/employer-guide',
    dateModified: '2026-04-06',
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Employer Guide — 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Kenya Employer Payroll Compliance 2026</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            For HR managers, SME owners, and finance teams. Everything you need to know about PAYE, NSSF, SHIF, Housing Levy obligations, the true cost of hiring, and the 2026 changes that affect your payroll.
          </p>
        </div>

        {/* True cost of hiring */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-3">The True Cost of Hiring — Beyond Gross Salary</h2>
          <p className="text-stone-400 text-sm mb-5">
            When you agree to pay someone KES 100,000 gross, you are actually committing to more. Here is what each hire actually costs:
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left py-3 px-4 text-stone-400">Gross Salary</th>
                  <th className="text-right py-3 px-4 text-stone-400">+Employer NSSF</th>
                  <th className="text-right py-3 px-4 text-stone-400">+Employer Housing</th>
                  <th className="text-right py-3 px-4 text-stone-400">+Employer SHIF</th>
                  <th className="text-right py-3 px-4 text-blue-400">Total Cost</th>
                  <th className="text-right py-3 px-4 text-amber-400">Overhead %</th>
                </tr>
              </thead>
              <tbody>
                {HIRING_COSTS.map(row => (
                  <tr key={row.gross} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white font-bold">{fmt(row.gross)}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(row.nssf)}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(row.housing)}</td>
                    <td className="py-3 px-4 text-right text-stone-400">{fmt(row.shif)}</td>
                    <td className="py-3 px-4 text-right text-blue-400 font-bold">{fmt(row.total)}</td>
                    <td className="py-3 px-4 text-right text-amber-400">+{row.overhead.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Every Kenyan employer pays approximately 9.5–10.5% above gross salary in mandatory employer contributions. Budget for this in your headcount planning.
          </p>
        </section>

        {/* Monthly obligations */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-400" />
            Monthly Payroll Obligations
          </h2>
          <div className="space-y-4">
            {MONTHLY_OBLIGATIONS.map(ob => (
              <div key={ob.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-red-500/20 rounded-xl px-3 py-2 text-center shrink-0">
                    <span className="text-red-400 font-black text-base leading-none block">{ob.deadline}</span>
                    <span className="text-red-400/60 text-xs">of month</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1.5">{ob.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed mb-2">{ob.detail}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="text-amber-400/80">⚠️ Late: {ob.penalty}</span>
                      <span className="text-stone-500">Platform: {ob.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Annual obligations */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Annual Obligations
          </h2>
          <div className="space-y-3">
            {ANNUAL_OBLIGATIONS.map((ob, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                  ob.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>{ob.date}</span>
                <p className="text-stone-300 text-sm">{ob.obligation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* New employee checklist */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">New Employee Payroll Checklist</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="space-y-3">
              {NEW_EMPLOYEE_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common mistakes */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            5 Most Expensive Payroll Mistakes in Kenya
          </h2>
          <div className="space-y-4">
            {COMMON_MISTAKES.map((item, i) => (
              <div key={i} className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
                <h3 className="font-bold text-white text-sm mb-2">❌ {item.mistake}</h3>
                <p className="text-red-400/80 text-xs mb-2.5"><strong>Consequence:</strong> {item.consequence}</p>
                <p className="text-emerald-400/80 text-xs"><strong>Fix:</strong> {item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payslip elements */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Legal Payslip Requirements</h2>
          <p className="text-stone-400 text-sm mb-4">
            The Employment Act requires employers to provide a written payslip with each salary payment. A compliant payslip must include:
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid sm:grid-cols-2 gap-2">
            {PAYSLIP_ELEMENTS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/p9-generator',      label: 'P9 Form Generator', desc: 'Create P9 certificates instantly',      icon: '📄' },
            { href: '/tax-calendar',      label: 'Filing Deadlines',  desc: 'All monthly and annual dates',          icon: '📅' },
            { href: '/statutory-changes', label: 'SHIF & NSSF 2026', desc: 'Complete rate change breakdown',        icon: '📊' },
          ].map(cta => (
            <Link key={cta.href} href={cta.href}
              className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-xl p-4 transition-all group">
              <span className="text-2xl">{cta.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">{cta.label}</p>
                <p className="text-stone-500 text-xs mt-0.5">{cta.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/p9-generator" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📄</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">P9 Form Generator</span>
              <span className="text-stone-500 text-xs">Create P9 certificates instantly</span>
            </Link>
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar</span>
              <span className="text-stone-500 text-xs">Every employer deadline for 2026</span>
            </Link>
            <Link href="/statutory-changes" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📊</span>
              <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">SHIF & NSSF Changes</span>
              <span className="text-stone-500 text-xs">Updated rate obligations</span>
            </Link>
            <Link href="/tax-relief" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">💰</span>
              <span className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">Tax Relief Guide</span>
              <span className="text-stone-500 text-xs">Reliefs employers must apply</span>
            </Link>
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🧮</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">PAYE Calculator</span>
              <span className="text-stone-500 text-xs">Verify payroll calculations</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">PAYE FAQ</span>
              <span className="text-stone-500 text-xs">Common employer questions</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Tools for your payroll workflow</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/p9-generator" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📄</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">P9 Form Generator</p>
                <p className="text-stone-500 text-xs mt-0.5">Create employee certificates in bulk</p>
              </div>
            </Link>
            <Link href="/tax-calendar" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📅</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Filing Deadline Calendar</p>
                <p className="text-stone-500 text-xs mt-0.5">Monthly P10, annual P9, NSSF — all deadlines</p>
              </div>
            </Link>
            <Link href="/statutory-changes" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📊</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">SHIF & NSSF 2026 Rates</p>
                <p className="text-stone-500 text-xs mt-0.5">Updated employer contribution amounts</p>
              </div>
            </Link>
            <Link href="/" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🧮</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE Calculator</p>
                <p className="text-stone-500 text-xs mt-0.5">Verify deductions for any employee salary</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

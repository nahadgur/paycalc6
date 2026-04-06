import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, CheckCircle2, ArrowRight, AlertTriangle, Clock, Shield, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'KRA iTax 2026 Guide | Pre-Filled Returns, How to File & New Features',
  description: 'Complete guide to KRA iTax 2026 changes. Learn how pre-filled tax returns work, how salaried employees can file in minutes using just their KRA PIN, and what changed for employers.',
  keywords: ['KRA iTax 2026','iTax pre-filled returns Kenya','KRA tax return 2026','how to file iTax Kenya','KRA PIN tax filing'],
  alternates: { canonical: 'https://payecalculator.co.ke/itax-2026' },
}

const STEPS_EMPLOYEE = [
  { step: '1', title: 'Log into iTax', desc: 'Go to itax.kra.go.ke and sign in with your KRA PIN and password. If you forgot your password, click "Forgot Password" — you will receive a reset link via email.', ussd: 'USSD: Dial *572# on Safaricom for basic filing' },
  { step: '2', title: 'Select "File Return"', desc: 'Under the "Returns" menu, select "File Return" → "Income Tax" → "Individual". For tax year 2025 (filed in 2026), select "IT1" (Individual Tax Return).' },
  { step: '3', title: 'Accept Pre-Filled Data', desc: 'From 2026, iTax automatically pulls your PAYE data from employer submissions. Review the pre-filled gross pay, PAYE deducted, and statutory contributions. If the figures match your P9 form, accept them.', highlight: true },
  { step: '4', title: 'Declare Other Income', desc: 'If you have rental income, business income, dividends, or sold property, declare these separately. Salaried employees with only PAYE income can skip this step.' },
  { step: '5', title: 'Claim Any Missing Reliefs', desc: 'If your employer did not apply all your reliefs (mortgage interest, insurance premium, pension), declare them here to get a tax refund or reduce any tax payable.' },
  { step: '6', title: 'Submit and Pay (if applicable)', desc: 'Submit the return. If you owe additional tax, pay via M-Pesa (Paybill 572572) or bank transfer. If you overpaid PAYE, file for a refund — KRA processes refunds within 30 working days.' },
]

const CHANGES_2026 = [
  { icon: '⚡', title: 'Pre-Filled Returns for PAYE Employees', description: 'The biggest 2026 change: iTax now automatically pulls your employment income data from your employer\'s P10 submissions. Most salaried employees can file their annual return in under 5 minutes.', impact: 'High — affects all salaried employees' },
  { icon: '🆔', title: 'KRA PIN + National ID Filing', description: 'From 2026, employees with only PAYE income can file using just their KRA PIN and national ID number — no P9 form required for basic filing. The system retrieves your data automatically.', impact: 'High — simplifies compliance' },
  { icon: '🤖', title: 'AI-Led Digital Monitoring', description: 'KRA has deployed machine learning systems that cross-reference employer payroll submissions against employee returns. Discrepancies are flagged automatically for audit. Accuracy is now more important than ever.', impact: 'Medium — tighter enforcement' },
  { icon: '📊', title: 'E-TIMS Integration for Employers', description: 'The Electronic Tax Invoice Management System (E-TIMS) is now mandatory for all VAT-registered businesses. This affects payroll by ensuring all employee expense claims must be backed by E-TIMS invoices.', impact: 'Medium — HR/Finance teams' },
  { icon: '🏠', title: 'Mortgage Relief Now Auto-Applied', description: 'Employers are now required to automatically apply mortgage interest relief during payroll for employees who have submitted qualifying home loan documentation. Previously this required self-declaration at year-end.', impact: 'High — homeowners with mortgages' },
  { icon: '📱', title: 'iTax Mobile App Improvements', description: 'The KRA iTax mobile app (available on Android and iOS) now supports full return filing, payment, and status checking. Push notifications remind you of upcoming deadlines.', impact: 'Low — convenience improvement' },
]

const EMPLOYER_OBLIGATIONS = [
  { title: 'Monthly P10 Filing', deadline: '9th of each month', desc: 'Employers must file the P10 return (employee PAYE summary) by the 9th of each month for the previous month\'s payroll. This feeds the pre-filled employee return system.' },
  { title: 'Annual P9 Issuance', deadline: 'January 31 each year', desc: 'All employees must receive their P9 tax deduction certificate by January 31. Use our P9 Generator tool to create these quickly.' },
  { title: 'E-TIMS Invoices', deadline: 'Real-time from 2026', desc: 'All business expense invoices paid by the employer must be backed by E-TIMS electronic receipts. Cash payments without E-TIMS receipts are no longer tax-deductible.' },
  { title: 'NSSF/SHIF Reconciliation', deadline: 'Monthly by 9th (PAYE) and 15th (NSSF)', desc: 'Statutory contribution filings must reconcile exactly with payroll. iTax cross-checks PAYE submissions against NSSF and SHIF remittances automatically.' },
]

const COMMON_ERRORS = [
  { error: 'Wrong KRA PIN format', fix: 'KRA PINs are exactly 11 characters: letter, 9 digits, letter (e.g. A123456789B). Double-check with KRA\'s PIN Checker at kra.go.ke.' },
  { error: 'Pre-filled data doesn\'t match P9', fix: 'If your P9 shows different figures from the pre-filled data, it means your employer\'s P10 submissions may be incorrect. Ask HR to verify and refile the P10 if needed.' },
  { error: 'Filing a nil return when you have income', fix: 'If you earned any income — even from casual work — you cannot file a nil return. Nil returns are only for those with zero income in the year.' },
  { error: 'Missing rental income declaration', fix: 'Rental income is taxable in Kenya at 10% for monthly rent above KES 24,000. Even small-scale landlords must declare it. Non-declaration is now flagged by KRA\'s data systems.' },
  { error: 'Not claiming available reliefs', fix: 'Many employees leave money on the table by not claiming mortgage interest relief, insurance premium relief, or pension contribution relief. These can significantly reduce your PAYE.' },
]

export default function ITax2026Page() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'KRA iTax 2026 Guide — Pre-Filled Returns and New Filing Features',
    description: 'How KRA\'s iTax 2026 changes affect salaried employees and employers in Kenya.',
    url: 'https://payecalculator.co.ke/itax-2026',
    dateModified: '2026-04-06',
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Updated for 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">KRA iTax 2026 — Complete Guide</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            In 2026, KRA&apos;s iTax system introduced pre-filled tax returns for salaried employees. Most Kenyans can now file in under 5 minutes using just their PIN and national ID. Here is everything you need to know.
          </p>
        </div>

        {/* Key headline: pre-filled returns */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              The Biggest 2026 Change: Pre-Filled Returns
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              KRA now automatically pulls your payroll data from employer P10 submissions directly into your iTax return. If you are a salaried employee with only PAYE income, your return is essentially pre-completed — you just verify it, add any additional income or unclaimed reliefs, and submit.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              {[
                { icon: '⏱️', stat: '< 5 minutes', label: 'Filing time for most salaried employees' },
                { icon: '🆔', stat: 'PIN + ID only', label: 'What you need to log in and file' },
                { icon: '📅', stat: '30 June 2026', label: 'Deadline for 2025 tax year return' },
              ].map(item => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-white font-bold">{item.stat}</div>
                  <div className="text-stone-400 text-xs mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-step filing */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Step-by-Step: How to File Your 2026 iTax Return</h2>
          <div className="space-y-4">
            {STEPS_EMPLOYEE.map(s => (
              <div key={s.step} className={`border rounded-xl p-5 ${s.highlight ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-start gap-4">
                  <span className={`w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${s.highlight ? 'bg-emerald-500 text-white' : 'bg-white/10 text-stone-300'}`}>
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{s.desc}</p>
                    {s.ussd && (
                      <p className="text-emerald-400/70 text-xs mt-2">{s.ussd}</p>
                    )}
                    {s.highlight && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> New in 2026 — auto-populated from employer P10 submissions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What changed in 2026 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">What Changed in 2026 — Full Breakdown</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {CHANGES_2026.map(change => (
              <div key={change.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="text-2xl mb-3">{change.icon}</div>
                <h3 className="font-bold text-white text-sm mb-2">{change.title}</h3>
                <p className="text-stone-400 text-xs leading-relaxed mb-3">{change.description}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  change.impact.startsWith('High') ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  change.impact.startsWith('Medium') ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-stone-500/20 text-stone-400 border-stone-500/30'
                }`}>
                  Impact: {change.impact}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Employer section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Employer Obligations in 2026</h2>
          <div className="space-y-3">
            {EMPLOYER_OBLIGATIONS.map(ob => (
              <div key={ob.title} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                <div className="text-center shrink-0 bg-amber-500/10 rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
                  <span className="text-xs text-amber-400 font-semibold whitespace-nowrap">{ob.deadline}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{ob.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed">{ob.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common errors */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-400 inline mr-2" />
            Common iTax Mistakes and How to Fix Them
          </h2>
          <div className="space-y-3">
            {COMMON_ERRORS.map(e => (
              <div key={e.error} className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400 text-sm mb-1.5">❌ {e.error}</h3>
                <p className="text-stone-400 text-sm leading-relaxed"><span className="text-emerald-400 font-semibold">Fix: </span>{e.fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { href: '/tax-calendar', label: 'View Filing Deadlines', icon: '📅' },
            { href: '/p9-generator', label: 'Generate P9 Form', icon: '📄' },
            { href: '/', label: 'Calculate Your PAYE', icon: '🧮' },
          ].map(cta => (
            <Link key={cta.href} href={cta.href}
              className="flex items-center justify-between bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="flex items-center gap-3">
                <span className="text-xl">{cta.icon}</span>
                <span className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">{cta.label}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-emerald-400 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar 2026</span>
              <span className="text-stone-500 text-xs">Every KRA filing deadline</span>
            </Link>
            <Link href="/p9-generator" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📄</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">P9 Form Generator</span>
              <span className="text-stone-500 text-xs">Create annual tax certificates</span>
            </Link>
            <Link href="/statutory-changes" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📊</span>
              <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">SHIF & NSSF Changes</span>
              <span className="text-stone-500 text-xs">Statutory rate changes explained</span>
            </Link>
            <Link href="/employer-guide" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🏢</span>
              <span className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">Employer Guide</span>
              <span className="text-stone-500 text-xs">P10 filing and compliance</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">PAYE FAQ</span>
              <span className="text-stone-500 text-xs">Common iTax questions answered</span>
            </Link>
            <Link href="/kra-offices" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🗺️</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">KRA Offices</span>
              <span className="text-stone-500 text-xs">Find your nearest service centre</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">Also useful for filing season</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/p9-generator" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📄</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">P9 Form Generator</p>
                <p className="text-stone-500 text-xs mt-0.5">Create your annual tax certificate in minutes</p>
              </div>
            </Link>
            <Link href="/tax-calendar" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📅</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">KRA Tax Deadlines</p>
                <p className="text-stone-500 text-xs mt-0.5">June 30 return, 9th PAYE — all 2026 dates</p>
              </div>
            </Link>
            <Link href="/tax-relief" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">💰</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Relief Guide</p>
                <p className="text-stone-500 text-xs mt-0.5">Claim mortgage & pension relief before filing</p>
              </div>
            </Link>
            <Link href="/faq" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">❓</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE FAQ</p>
                <p className="text-stone-500 text-xs mt-0.5">"What if my P9 data doesn't match iTax?"</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Mail, Calculator, BookOpen } from 'lucide-react'
import ThankYouLead from '@/components/ThankYouLead'

export const metadata: Metadata = {
  title: { absolute: 'Thank you for your purchase | Kenya PAYE Calculator' },
  description: 'Your Broke After Payday kit is on its way to your inbox.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/thank-you' },
  // Post-purchase landing: keep it out of search.
  robots: { index: false, follow: false },
}

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-brand" />
        <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
          Payment received. Asante!
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Your copy of <strong>Broke After Payday: Kenya Salary Survival Kit</strong> is yours.
          Thank you for backing the project.
        </p>
      </div>

      {/* What happens next */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-brand-50 p-6">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <Mail className="h-5 w-5 text-brand" /> Check your inbox
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Your download link has been emailed to the address you paid with. It usually arrives within a
          couple of minutes. If you do not see it, check your spam or promotions folder and search for
          <strong> Selar</strong> or <strong>PAYE Calculator</strong>. The PDF is yours to keep and reread every payday.
        </p>
      </div>

      {/* Lead capture */}
      <div className="mt-8">
        <ThankYouLead />
      </div>

      {/* Keep them on site */}
      <div className="mt-10">
        <p className="text-center text-sm font-medium text-gray-500">While you wait, put the kit to work</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-brand"
          >
            <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <span className="text-sm text-gray-700">
              <span className="block font-semibold text-gray-900">Run your numbers</span>
              See your exact take-home pay on the free 2026 PAYE calculator.
            </span>
          </Link>
          <Link
            href="/guides"
            className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-brand"
          >
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <span className="text-sm text-gray-700">
              <span className="block font-semibold text-gray-900">Read the guides</span>
              Statutory deductions, reliefs and salary breakdowns explained plainly.
            </span>
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-gray-400">
        Trouble with your download? Reply to your purchase email and we will sort you out.
      </p>
    </div>
  )
}

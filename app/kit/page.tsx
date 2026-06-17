import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, BookOpen, ShieldCheck, RefreshCw, FileText } from 'lucide-react'
import KitCheckout from '@/components/KitCheckout'

export const metadata: Metadata = {
  title: { absolute: 'Broke After Payday: Kenya Salary Survival Kit 2026 (PDF)' },
  description:
    'A practical 53-page kit for Kenyan workers: understand your payslip, plug money leaks, dodge scams and test a side hustle in 30 days. KES 299 via M-Pesa.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/kit' },
}

const CHAPTERS = [
  'Your 10-Minute Salary Triage (start here)',
  'Your Salary Is Not the Problem, Your Take-Home Pay Is',
  'Read Your Payslip Before You Panic — with 2026 rates',
  'Why You Are Broke by Week Two: the ten doors money leaves through',
  'Payday Rules That Fit Real Life',
  'Stop Choosing Side Hustles from TikTok: the five filters',
  'Which Side Hustle Fits You? Matched to your time, capital and skills',
  'Side Hustles Kenyans Can Start Small — services, food, online, skills',
  'Your 30-Day Extra Income Plan',
  'Money Scams in Kenya: spot them, avoid them, report them (DCI, Safaricom 333)',
  'Make Your Phone Save For You: M-Shwari locks, staged emergency fund',
  'The Toolkit: 10 worksheets + customer message templates',
]

const FAQS = [
  ['Is this financial advice?', 'No. It is practical education and planning built around the 2026 statutory rates. For decisions about your specific situation, talk to a qualified professional.'],
  ['What format is it?', 'A 53-page PDF, sized for phone and desktop reading, with clickable contents and links. Your copy is licensed to your email address.'],
  ['What happens after I pay?', 'The download starts on this page the moment your M-Pesa payment confirms, and we also email you the link. The link works for 7 days; the PDF is yours forever.'],
  ['Rates change. Will my copy go stale?', 'No. Buyers get every updated edition free. When PAYE, NSSF, SHIF or Housing Levy rates change, we ship a new edition and email you.'],
  ['Can I get a refund?', 'If the kit is not what you expected, reply to your purchase email within 7 days and we will sort you out.'],
]

export default function KitPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Hero */}
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-brand">New for 2026</p>
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            The salary comes in. By week two it is gone.{' '}
            <span className="text-brand-600">This kit shows you exactly where, and what to do about it.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            <strong>Broke After Payday</strong> is the practical guide for Kenyan workers:
            understand every line of your payslip, plug the ten money leaks, dodge the scams
            that target squeezed people, and test one realistic side hustle in 30 days.
          </p>
          <ul className="mt-5 space-y-2 text-gray-700">
            {[
              '53 pages, written for one tired but intelligent reader. No guru talk.',
              'Built on the real 2026 PAYE, NSSF, SHIF and Housing Levy rates.',
              '10 worksheets, HR scripts, family-boundary scripts and scam checklists.',
              'Free updated editions every time the rates change.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Image
            src="/kit/cover-preview.jpg"
            alt="Broke After Payday kit preview — Kenyan professional reading on a matatu"
            width={760}
            height={560}
            className="rounded-xl shadow-md"
            priority
          />
        </div>
      </section>

      {/* Checkout */}
      <section id="buy" className="mx-auto mt-12 max-w-md scroll-mt-24">
        <KitCheckout />
      </section>

      {/* Trust strip */}
      <section className="mt-10 grid gap-4 text-center sm:grid-cols-3">
        {[
          { Icon: ShieldCheck, text: 'M-Pesa STK push checkout — no card needed' },
          { Icon: RefreshCw, text: 'Free updated editions when rates change' },
          { Icon: FileText, text: 'Instant download + email delivery' },
        ].map(({ Icon, text }) => (
          <div key={text} className="rounded-lg border border-gray-200 p-4">
            <Icon className="mx-auto mb-2 h-6 w-6 text-brand" />
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </section>

      {/* Contents */}
      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <BookOpen className="h-6 w-6 text-brand" /> What is inside
        </h2>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {CHAPTERS.map((c, i) => (
            <li key={c} className="flex items-start gap-3 rounded-lg bg-brand-50 px-4 py-3 text-sm text-gray-800">
              <span className="font-bold text-brand-600">{String(i + 1).padStart(2, '0')}</span> {c}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-500">
          Pairs with the free <Link href="/" className="font-medium text-brand-600 underline">PAYE calculator</Link>:
          the calculator shows you the salary, the kit shows you what to do next.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-gray-900">Questions, answered</h2>
        <div className="mt-4 space-y-3">
          {FAQS.map(([q, a]) => (
            <details key={q} className="rounded-lg border border-gray-200 p-4">
              <summary className="cursor-pointer font-semibold text-gray-900">{q}</summary>
              <p className="mt-2 text-sm text-gray-600">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#buy" className="inline-block rounded-lg bg-brand px-8 py-3.5 font-bold text-white hover:bg-brand-600">
            Get the kit — KES 299
          </a>
          <p className="mt-2 text-xs text-gray-400">Less than one weekend out. Pays for itself the first time it stops a Fuliza cycle.</p>
        </div>
      </section>
    </main>
  )
}

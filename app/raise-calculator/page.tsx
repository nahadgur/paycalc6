import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import ToolNav from '@/components/ToolNav'
import { SpokeGrid } from '@/components/SpokeGrid'

export const metadata: Metadata = {
  title: { absolute: 'Pay Rise Calculator Kenya 2026 | How Much You Keep' },
  description:
    'See how much of a pay rise you keep in Kenya after PAYE, NSSF, SHIF and the Housing Levy. Free 2026 calculator with monthly and annual net gain.',
  keywords: [
    'pay rise calculator Kenya', 'salary increase calculator Kenya', 'how much of a raise do I keep Kenya',
    'raise after tax Kenya 2026', 'net pay increase calculator Kenya',
  ],
  alternates: { canonical: 'https://www.payecalculator.co.ke/raise-calculator' },
}

const FAQ = [
  {
    q: 'How much of a pay rise do I actually keep in Kenya?',
    a: 'Compare complete old and new payroll calculations. With the full taxable increase in the 30% band, standard contributions and no other changes, you retain 62.825% below the NSSF ceiling and 67.025% above it. An increase crossing the ceiling needs a split calculation.',
  },
  {
    q: 'Does a 10% gross raise always mean a smaller percentage net rise?',
    a: 'No universal rule applies. Gross and net percentage changes use different starting amounts. Calculate both net salaries, subtract them, then divide by the old net salary to measure the net percentage increase.',
  },
  {
    q: 'Does NSSF affect a raise above KES 108,000?',
    a: 'Once your pay is above the KES 108,000 NSSF upper limit, NSSF stops increasing, so a raise beyond that point is not reduced by extra NSSF — only by PAYE, SHIF and the Housing Levy.',
  },
]

export default function RaiseCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Pay Rise Calculator Kenya 2026',
        url: 'https://www.payecalculator.co.ke/raise-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Work out the real take-home value of a pay rise in Kenya after PAYE, NSSF, SHIF and the Housing Levy, per month and per year.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <PAYECalculator single defaultTab="raise" />

      <section className="bg-white px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">
              What a pay rise is really worth
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              A raise is quoted in gross terms, but you spend net. Because Kenya&apos;s PAYE is progressive, the extra
              income sits in your highest tax band, so a larger share of a raise goes to tax than of your existing
              salary. SHIF and the Housing Levy take a further slice of the higher gross.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              Set your current gross and the percentage on offer to see the monthly and annual increase in your actual
              take-home, and what share of the raise survives deductions. It turns a vague offer into a real number you
              can plan around.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-4">Questions about pay rises</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl border border-[#eee] p-5">
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{f.q}</h3>
                  <p className="text-[14px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <SpokeGrid hubHref="/raise-calculator" light heading="Understand your pay rise" />
          <ToolNav current="/raise-calculator" />
        </div>
      </section>
    </>
  )
}

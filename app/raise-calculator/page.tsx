import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import ToolNav from '@/components/ToolNav'

export const metadata: Metadata = {
  title: { absolute: 'Pay Rise Calculator Kenya 2026 | How Much You Keep' },
  description:
    'See how much of a pay rise you keep in Kenya after PAYE, NSSF, SHIF and the Housing Levy. Free 2026 calculator with monthly and annual net gain.',
  keywords: [
    'pay rise calculator Kenya', 'salary increase calculator Kenya', 'how much of a raise do I keep Kenya',
    'raise after tax Kenya 2026', 'net pay increase calculator Kenya',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/raise-calculator' },
}

const FAQ = [
  {
    q: 'How much of a pay rise do I actually keep in Kenya?',
    a: 'Less than the headline figure. Every extra shilling is taxed at your marginal PAYE band, and SHIF and the Housing Levy also take 4.25% of the increase. On a salary already in the 30% band you typically keep around 65-66% of a raise after all deductions.',
  },
  {
    q: 'Why does a 10% raise not lift my take-home by 10%?',
    a: 'Because deductions are applied to the increase too. PAYE on the new income is charged at your top band, then SHIF and the Housing Levy come off the higher gross. The percentage rise in your net pay is always smaller than the percentage rise in your gross.',
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
        url: 'https://payecalculator.co.ke/raise-calculator',
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

          <ToolNav current="/raise-calculator" />
        </div>
      </section>
    </>
  )
}

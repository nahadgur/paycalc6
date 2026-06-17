import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import ToolNav from '@/components/ToolNav'

export const metadata: Metadata = {
  title: { absolute: 'Net to Gross Salary Calculator Kenya 2026 | Reverse PAYE' },
  description:
    'Enter the take-home you want and see the gross salary you need in Kenya. Free net to gross calculator on 2026 PAYE, NSSF, SHIF and Housing Levy.',
  keywords: [
    'net to gross calculator Kenya', 'gross from net salary Kenya', 'reverse PAYE calculator Kenya',
    'gross salary calculator Kenya 2026', 'what gross for net salary Kenya',
  ],
  alternates: { canonical: 'https://www.payecalculator.co.ke/net-gross-calculator' },
}

const FAQ = [
  {
    q: 'How do I work out gross salary from net pay in Kenya?',
    a: 'Start from the take-home you want and add back every deduction: PAYE income tax, NSSF, SHIF (2.75%) and the Housing Levy (1.5%). Because PAYE is progressive, you cannot simply add a fixed percentage — the calculator solves it for you by testing gross figures until the net matches your target.',
  },
  {
    q: 'Why is the gross so much higher than the net I asked for?',
    a: 'On a mid-to-high salary, PAYE alone can take 25-30% of the top slice, and SHIF and the Housing Levy add 4.25% of gross on top. To take home an extra KES 10,000 you often need KES 14,000-15,000 more gross.',
  },
  {
    q: 'Is this net to gross calculator up to date for 2026?',
    a: 'Yes. It uses the 2026 KRA bands (10%, 25%, 30%, 32.5% and 35%), the KES 2,400 personal relief, NSSF at 6% up to KES 108,000 (max KES 6,480), SHIF at 2.75% and the Housing Levy at 1.5%.',
  },
]

export default function NetGrossCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Net to Gross Salary Calculator Kenya 2026',
        url: 'https://www.payecalculator.co.ke/net-gross-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Reverse Kenya PAYE calculator: enter a target net salary and get the gross required, with the 2026 deduction breakdown.',
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
      <PAYECalculator single defaultTab="reverse" />

      <section className="bg-white px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">
              How the net to gross calculator works
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              Most salary tools run one way: gross in, net out. This one runs in reverse. You set the monthly
              take-home you actually want in your account, and it works out the gross salary an employer would have to
              pay for you to land there once PAYE, NSSF, SHIF and the Housing Levy come off.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              It is the number you want before a salary negotiation or a job offer. Quote a gross figure that already
              accounts for tax, rather than discovering the shortfall on your first payslip. Adjust the target with the
              slider and the required gross updates instantly.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-4">Questions about net to gross</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl border border-[#eee] p-5">
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{f.q}</h3>
                  <p className="text-[14px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <ToolNav current="/net-gross-calculator" />
        </div>
      </section>
    </>
  )
}

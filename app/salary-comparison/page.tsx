import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import ToolNav from '@/components/ToolNav'
import { SpokeGrid } from '@/components/SpokeGrid'

export const metadata: Metadata = {
  title: 'Salary Comparison Calculator Kenya 2026 | PAYE & Net by Band',
  description:
    'Compare salaries side by side in Kenya. See how PAYE, net pay and the effective tax rate change from KES 30,000 to KES 1,000,000 under the 2026 KRA bands.',
  keywords: [
    'salary comparison Kenya', 'net salary by band Kenya', 'effective tax rate Kenya 2026',
    'salary comparison calculator Kenya', 'take home by salary Kenya',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/salary-comparison' },
}

const FAQ = [
  {
    q: 'How does take-home pay change as salary rises in Kenya?',
    a: 'Net pay rises with gross, but a shrinking share of each increase reaches your account. Because the PAYE bands step up from 10% to 35%, the effective tax rate climbs steadily, so someone on KES 500,000 keeps a smaller percentage than someone on KES 50,000.',
  },
  {
    q: 'What is the effective tax rate at different salaries?',
    a: 'The effective rate is total PAYE divided by gross. It is low on small salaries thanks to the KES 2,400 personal relief and the 10% band, and rises toward the high 20s and low 30s in percentage terms as income enters the 30%, 32.5% and 35% bands.',
  },
  {
    q: 'Why compare salaries before accepting an offer?',
    a: 'Two gross salaries can feel far apart but land closer in net terms once tax is applied, and a jump into a higher band returns less than expected. Comparing the net and effective rate across bands shows what a higher offer is genuinely worth.',
  },
]

export default function SalaryComparisonPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Salary Comparison Calculator Kenya 2026',
        url: 'https://payecalculator.co.ke/salary-comparison',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Compare PAYE, net pay and the effective tax rate across salary bands in Kenya under the 2026 KRA tax bands.',
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
      <PAYECalculator single defaultTab="compare" />

      <section className="bg-white px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">
              Comparing salaries across the 2026 bands
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              Kenya&apos;s PAYE is progressive, so the tax you pay does not rise in a straight line with your salary. The
              chart and table above run the full 2026 calculation across salary levels from KES 30,000 to KES 1,000,000,
              showing the PAYE, the resulting net pay and the effective tax rate at each step.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              Read across to see how much of a higher salary actually reaches your account, and where the jumps between
              bands bite hardest. For an exact figure on your own salary, use the main PAYE calculator.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-4">Questions about comparing salaries</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl border border-[#eee] p-5">
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{f.q}</h3>
                  <p className="text-[14px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <SpokeGrid siloKey="salary-breakdowns" light heading="Salary breakdown guides" />

          <ToolNav current="/salary-comparison" />
        </div>
      </section>
    </>
  )
}

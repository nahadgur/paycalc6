import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import ToolNav from '@/components/ToolNav'

export const metadata: Metadata = {
  title: 'Employer Cost Calculator Kenya 2026 | True Cost to Employ',
  description:
    'Work out the full monthly cost of employing someone in Kenya. Free employer cost calculator covering gross salary plus the matched NSSF and Housing Levy, on 2026 rates.',
  keywords: [
    'employer cost calculator Kenya', 'cost of employing staff Kenya', 'employer NSSF Housing Levy Kenya',
    'true cost to employ Kenya 2026', 'payroll cost calculator Kenya',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/employer-cost-calculator' },
}

const FAQ = [
  {
    q: 'What does it cost to employ someone in Kenya?',
    a: 'More than the gross salary. On top of gross pay an employer matches NSSF (6% up to KES 108,000, so up to KES 6,480) and the Housing Levy (1.5% of gross). For a KES 100,000 salary the total monthly cost is roughly KES 107,500.',
  },
  {
    q: 'Do employers pay NSSF and the Housing Levy?',
    a: 'Yes. NSSF is matched shilling for shilling by the employer, and the Affordable Housing Levy is a 1.5% employer contribution on top of the 1.5% deducted from the employee. Both are a real cost of employment.',
  },
  {
    q: 'Is SHIF paid by the employer?',
    a: 'SHIF (2.75%) is deducted from staff pay and not matched by the employer, so it does not add to the cost of employing someone. The employer adds only the matched NSSF and the 1.5% Housing Levy contribution.',
  },
]

export default function EmployerCostCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Employer Cost Calculator Kenya 2026',
        url: 'https://payecalculator.co.ke/employer-cost-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Calculate the full monthly cost of employment in Kenya: gross salary plus matched NSSF and the Housing Levy, on 2026 rates.',
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
      <PAYECalculator single defaultTab="employer" />

      <section className="bg-white px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">
              The real cost of employment in Kenya
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              The salary you offer is not the figure that leaves the business. An employer in Kenya also matches the
              employee&apos;s NSSF contribution and pays a Housing Levy of 1.5% of gross. SHIF is deducted from the
              employee and is not an employer cost.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              This matters for budgeting headcount, pricing a contract, or comparing a salaried hire with a contractor.
              Enter a gross salary to see the total monthly cost to employ, with the matched NSSF and Housing Levy
              broken out.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-4">Questions about employer cost</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl border border-[#eee] p-5">
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{f.q}</h3>
                  <p className="text-[14px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <ToolNav current="/employer-cost-calculator" />
        </div>
      </section>
    </>
  )
}

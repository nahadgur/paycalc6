import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import ToolNav from '@/components/ToolNav'

export const metadata: Metadata = {
  title: 'Bonus Tax Calculator Kenya 2026 | Tax on Bonus & 13th Month',
  description:
    'How much tax will you pay on your bonus in Kenya? Free bonus tax calculator showing the PAYE on a bonus or 13th-month pay and the net you actually receive, using 2026 KRA rates.',
  keywords: [
    'bonus tax calculator Kenya', 'how is bonus taxed in Kenya', 'tax on bonus Kenya 2026',
    '13th month pay tax Kenya', 'net bonus calculator Kenya',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/bonus-calculator' },
}

const FAQ = [
  {
    q: 'How is a bonus taxed in Kenya?',
    a: 'A bonus is added to your pay for the month it is paid and taxed under the normal PAYE bands. Because it sits on top of your salary, it is taxed at your highest (marginal) band — often 30%, 32.5% or 35% — so you keep less of a bonus than of your basic pay.',
  },
  {
    q: 'Is a 13th-month or Christmas bonus taxed?',
    a: 'Yes. There is no separate tax-free treatment for a 13th-month cheque or a festive bonus in Kenya. It is taxable employment income and PAYE applies at your marginal rate, the same as any other bonus.',
  },
  {
    q: 'How much tax will I pay on my bonus?',
    a: 'Take your top tax band as a rough guide. If your salary already pushes you into the 30% band, expect roughly 30% of the bonus to go to PAYE, leaving about 70%. The calculator gives the exact figure for your salary and bonus amount.',
  },
]

export default function BonusCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Bonus Tax Calculator Kenya 2026',
        url: 'https://payecalculator.co.ke/bonus-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Work out the PAYE on a bonus or 13th-month pay in Kenya and the net amount you keep, using 2026 KRA tax bands.',
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
      <PAYECalculator single defaultTab="bonus" />

      <section className="bg-white px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">
              How bonus tax works in Kenya
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              A bonus is not taxed at some special flat rate. It is stacked on top of your salary for the month it is
              paid, so it is taxed at your marginal band — the rate on the last shilling you earn. For most salaried
              employees that is the 30% band, and for higher earners 32.5% or 35%.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              That is why a KES 100,000 bonus rarely lands as KES 100,000. Enter your monthly gross and the bonus
              figure above to see the PAYE that comes off, the net bonus you receive, and the effective rate on the
              extra pay.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-4">Questions about bonus tax</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl border border-[#eee] p-5">
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{f.q}</h3>
                  <p className="text-[14px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <ToolNav current="/bonus-calculator" />
        </div>
      </section>
    </>
  )
}

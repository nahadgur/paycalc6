import PAYECalculator from '@/components/PAYECalculator'

// Homepage structured data — helps win rich results and feeds AI answer engines.
// This is the #1 commercial page ("PAYE calculator Kenya") and previously had no schema.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Kenya PAYE Calculator 2026',
      url: 'https://payecalculator.co.ke',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
      description:
        'Free Kenya PAYE calculator for 2026. Calculate net salary, PAYE tax, NSSF, SHIF and Housing Levy instantly using the latest KRA tax bands.',
      featureList: [
        'Net salary calculation',
        'PAYE tax by KRA band',
        'NSSF, SHIF and Housing Levy deductions',
        'Net-to-gross reverse calculation',
        'Bonus and benefits-in-kind impact',
        'Employer cost breakdown',
      ],
      dateModified: '2026-06-02',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is PAYE calculated in Kenya in 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PAYE is calculated on taxable income after allowable deductions (NSSF and pension). Kenya uses progressive bands of 10%, 25%, 30%, 32.5% and 35%, then a monthly personal relief of KES 2,400 is subtracted. SHIF (2.75%) and the Housing Levy (1.5%) are also deducted from gross pay.',
          },
        },
        {
          '@type': 'Question',
          name: 'What deductions are taken from my Kenyan salary?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The mandatory statutory deductions are NSSF, SHIF (2.75% of gross), the Affordable Housing Levy (1.5% of gross) and PAYE income tax. Voluntary deductions can include HELB, SACCO and pension contributions.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is this Kenya PAYE calculator free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The calculator is free and updated with the latest 2026 KRA tax bands, NSSF, SHIF and Housing Levy rates.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'PAYE Calculator',
          item: 'https://payecalculator.co.ke',
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PAYECalculator />

      {/* Server-rendered quick answer + trust signals (SEO / AEO) */}
      <section className="bg-white px-4 sm:px-6 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-[#eee] p-6 sm:p-8">
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">
              How is PAYE calculated in Kenya in 2026?
            </h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              PAYE is charged on your taxable income after NSSF and any pension contributions are deducted. Kenya
              uses progressive bands of 10%, 25%, 30%, 32.5% and 35%, and a personal relief of KES 2,400 a month is
              subtracted from the tax due. SHIF (2.75% of gross) and the Affordable Housing Levy (1.5% of gross) are
              also deducted from your pay. From February 2026, NSSF is 6% of pay up to KES 108,000 — a maximum of
              KES 6,480 a month.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              For example, on a gross salary of KES 100,000 you pay roughly KES 6,000 NSSF, KES 2,750 SHIF and
              KES 1,500 Housing Levy, with PAYE applied to the balance. Enter your own salary above for the exact
              figure, or see a ready breakdown for{' '}
              <a href="/salary/50000" className="text-brand hover:underline">KES 50,000</a>,{' '}
              <a href="/salary/100000" className="text-brand hover:underline">KES 100,000</a> or{' '}
              <a href="/salary/150000" className="text-brand hover:underline">KES 150,000</a>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-1">
            <span className="inline-flex items-center gap-2 text-[12px] text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1a9e54' }}></span>
              Updated 2 June 2026 with the latest KRA, NSSF &amp; SHIF rates
            </span>
            <span className="text-[11px] text-[#888]">
              Sources:{' '}
              <a href="https://www.kra.go.ke" target="_blank" rel="noopener noreferrer" className="hover:underline">KRA</a>,{' '}
              <a href="https://www.nssf.or.ke" target="_blank" rel="noopener noreferrer" className="hover:underline">NSSF</a>,{' '}
              <a href="https://sha.go.ke" target="_blank" rel="noopener noreferrer" className="hover:underline">SHA (SHIF)</a>
            </span>
          </div>
        </div>
      </section>
    </>
  )
}

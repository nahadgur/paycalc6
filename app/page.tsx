import type { Metadata } from 'next'
import PAYECalculator from '@/components/PAYECalculator'
import { SILOS } from '@/lib/silos'
import { SpokeGrid } from '@/components/SpokeGrid'

export const metadata: Metadata = {
  title: { absolute: 'PAYE Calculator Kenya 2026 | Net Salary Calculator' },
  description: 'Calculate your Kenya net salary after PAYE, NSSF, SHIF and Housing Levy. See the tax bands, pension deductions and take-home pay breakdown.',
  alternates: { canonical: 'https://www.payecalculator.co.ke' },
}

// Homepage structured data — helps win rich results and feeds AI answer engines.
// This is the #1 commercial page ("PAYE calculator Kenya") and previously had no schema.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Kenya PAYE Calculator 2026',
      url: 'https://www.payecalculator.co.ke',
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
      dateModified: '2026-10-21',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is PAYE calculated in Kenya in 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PAYE is calculated on taxable income after allowable employee NSSF, SHIF, Housing Levy and qualifying pension or mortgage deductions. Kenya uses progressive bands of 10%, 25%, 30%, 32.5% and 35%, then a monthly personal relief of KES 2,400 is subtracted. SHIF (2.75%) and the Housing Levy (1.5%) are also deducted from gross pay.',
          },
        },
        {
          '@type': 'Question',
          name: 'What deductions are taken from my Kenyan salary?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The mandatory statutory deductions are NSSF, SHIF (2.75% of gross), the Affordable Housing Levy (1.5% of gross) and PAYE income tax. Other cash deductions can include HELB repayments, SACCO savings and pension contributions.',
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
          item: 'https://www.payecalculator.co.ke',
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
              PAYE is charged after allowable employee NSSF, SHIF and Housing Levy deductions, plus
              qualifying pension and mortgage-interest deductions. The monthly tax bands are 10%, 25%,
              30%, 32.5% and 35%. Resident personal relief reduces the resulting tax by KES 2,400.
              From February 2026, employee NSSF is 6% of pensionable earnings up to KES 108,000
              (maximum KES 6,480). SHIF is 2.75% of gross pay, with a KES 300 minimum; the employee
              Housing Levy is 1.5% of regular gross pay.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              On KES 100,000 regular monthly gross pay, a resident employee pays KES 6,000 NSSF,
              KES 2,750 SHIF, KES 1,500 Housing Levy and KES 19,308.35 PAYE, leaving KES 70,441.65.
              This assumes pensionable pay equals gross pay, standard personal relief, and no other
              benefits, reliefs or personal deductions. Compare standard examples for{' '}
              <a href="/salary/50000" className="text-brand hover:underline">KES 50,000</a>,{' '}
              <a href="/salary/100000" className="text-brand hover:underline">KES 100,000</a> or{' '}
              <a href="/salary/150000" className="text-brand hover:underline">KES 150,000</a>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-1">
            <span className="inline-flex items-center gap-2 text-[12px] text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1a9e54' }}></span>
              Reviewed 21 October 2026 · February 2026 NSSF limits
            </span>
            <span className="text-[11px] text-[#888]">
              Sources:{' '}
              <a href="https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye" target="_blank" rel="noopener noreferrer" className="hover:underline">KRA</a>,{' '}
              <a href="https://www.nssf.or.ke" target="_blank" rel="noopener noreferrer" className="hover:underline">NSSF</a>,{' '}
              <a href="https://sha.go.ke" target="_blank" rel="noopener noreferrer" className="hover:underline">SHA (SHIF)</a>
            </span>
          </div>

          <section className="mt-8 rounded-2xl border border-stone-200 p-6 text-stone-700">
            <h2 className="text-xl font-semibold text-stone-900 mb-3">Choose the right salary calculator</h2>
            <p className="mb-3">Use this calculator for gross-to-net monthly salary. For a take-home target, use the <a className="text-brand underline" href="/net-gross-calculator">net-to-gross calculator</a>. Compare job offers with the <a className="text-brand underline" href="/salary-comparison">salary comparison tool</a>, or check an increase with the <a className="text-brand underline" href="/raise-calculator">pay rise calculator</a>.</p>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">Check your assumptions</h2>
            <p>The standard calculation is for a resident employee and regular monthly cash pay. Enter only qualifying deductions and correctly valued taxable benefits. Actual payroll can differ for historical periods, irregular payments, non-residents or special exemptions. Salary figures are estimates, not a KRA assessment.</p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Kenya salary and payroll guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {SILOS.filter(s => s.guideHref).map(s => <a key={s.key} href={s.guideHref} className="rounded-xl border border-stone-200 p-4 text-brand hover:underline">{s.title}</a>)}
            </div>
          </section>
          <SpokeGrid hubHref="/" light heading="Understand your salary and deductions" />
        </div>
      </section>
    </>
  )
}

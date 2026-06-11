import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import PayslipGenerator from '@/components/PayslipGenerator'

export const metadata: Metadata = {
  title: 'Payslip Generator Kenya 2026 | Free Payslip Maker (PDF)',
  description:
    'Create a professional payslip in Kenya for free. Enter salary and allowances and download a PDF payslip with PAYE, NSSF, SHIF and Housing Levy worked out on 2026 KRA rates.',
  keywords: [
    'payslip generator Kenya', 'free payslip generator', 'payslip maker Kenya',
    'create payslip Kenya', 'payslip template Kenya', 'payslip PDF Kenya 2026',
  ],
  alternates: { canonical: 'https://payecalculator.co.ke/payslip-generator' },
}

const FAQ = [
  {
    q: 'How do I generate a payslip in Kenya?',
    a: 'Enter the employer, employee, pay period, basic salary and any allowances. The generator works out PAYE, NSSF, SHIF and the Housing Levy on 2026 KRA rates and produces a payslip showing gross pay, each deduction and the net take-home. You then download it as a PDF.',
  },
  {
    q: 'Is the payslip generator free?',
    a: 'Yes. Building and previewing the payslip is free. To download the PDF you enter your name, email and phone once, then it unlocks instantly and stays unlocked for the rest of your visit.',
  },
  {
    q: 'Is this an official payslip?',
    a: 'It is an accurate estimate based on 2026 KRA tax bands, NSSF (max KES 6,480), SHIF (2.75%) and the Housing Levy (1.5%). For an official payroll payslip your employer must issue it from their payroll system, but the figures here will match a standard salary closely.',
  },
  {
    q: 'What deductions are shown on the payslip?',
    a: 'PAYE income tax, NSSF pension, SHIF health, and the Affordable Housing Levy are always shown. You can also add HELB and SACCO deductions, which are subtracted after tax.',
  },
]

export default function PayslipGeneratorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Payslip Generator Kenya 2026',
        url: 'https://payecalculator.co.ke/payslip-generator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
        description:
          'Free Kenya payslip generator: build a payslip with PAYE, NSSF, SHIF and Housing Levy on 2026 KRA rates and download it as a PDF.',
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
      <Hero
        active="payslip"
        h1="Payslip Generator Kenya 2026 — Free Payslip Maker"
        pre="Make a "
        em="payslip"
        post=" in seconds."
        desc="Build a clean, professional payslip for any Kenyan salary. Enter the pay and allowances and we work out PAYE, NSSF, SHIF and the Housing Levy on 2026 KRA rates, then download it as a PDF."
      />

      <PayslipGenerator />

      <section className="bg-white px-4 sm:px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-3">How the payslip generator works</h2>
            <p className="text-[14px] text-[#444] leading-relaxed mb-3">
              A payslip shows what an employee earned and what was deducted in a pay period. This tool builds one for any
              Kenyan salary: enter the basic pay and allowances, and it applies the 2026 statutory deductions, PAYE income
              tax on the KRA bands, NSSF at 6% (capped at KES 108,000), SHIF at 2.75% and the Housing Levy at 1.5%, then
              shows the net take-home.
            </p>
            <p className="text-[14px] text-[#444] leading-relaxed">
              It is handy for small employers issuing payslips, for anyone who wants a clean record of their pay, or for
              checking that the deductions on a real payslip add up. The preview updates as you type, and the PDF prints
              on a single page.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-[#111] mb-4">Payslip generator FAQ</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="rounded-2xl border border-[#eee] p-5">
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{f.q}</h3>
                  <p className="text-[14px] text-[#444] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

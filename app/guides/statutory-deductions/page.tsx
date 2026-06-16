import type { Metadata } from 'next'
import { SiloHub } from '@/components/SiloHub'

export const metadata: Metadata = {
  title: { absolute: 'Statutory Deductions in Kenya 2026: NSSF, SHIF, Levy' },
  description:
    'The three mandatory payroll deductions in Kenya for 2026: NSSF (max KES 6,480), SHIF (2.75%) and the Housing Levy (1.5%). Rates, limits and maths.',
  alternates: { canonical: 'https://payecalculator.co.ke/guides/statutory-deductions' },
}

export default function StatutoryDeductionsHub() {
  return (
    <SiloHub
      siloKey="statutory-deductions"
      heading="Statutory Deductions in Kenya (2026)"
      intro={
        <>
          <p>
            Before PAYE is even worked out, three deductions are taken from almost every Kenyan
            payslip by law. They are <strong>NSSF</strong> (your pension), <strong>SHIF</strong>{' '}
            (health, which replaced NHIF), and the <strong>Affordable Housing Levy</strong>. Together
            they can take a meaningful slice of gross pay, and two of them (NSSF and the housing levy)
            also reduce the income your PAYE is charged on.
          </p>
          <p>
            For 2026 the headline figures are: NSSF at 6% of pensionable pay up to an upper limit of
            KES 108,000, so a maximum of <strong>KES 6,480</strong> a month; SHIF at{' '}
            <strong>2.75% of gross pay</strong> with no cap; and the Housing Levy at{' '}
            <strong>1.5% of gross</strong>, matched by your employer. The guides below break each one
            down in full, with worked examples.
          </p>
        </>
      }
      faqs={[
        {
          q: 'What are the statutory deductions in Kenya for 2026?',
          a: 'NSSF (6% of pensionable pay, maximum KES 6,480/month), SHIF (2.75% of gross pay, replaced NHIF), and the Affordable Housing Levy (1.5% of gross, matched by the employer). PAYE is then calculated on the balance after NSSF and the housing levy are deducted.',
        },
        {
          q: 'Which deductions reduce my PAYE?',
          a: 'NSSF contributions and the Housing Levy are deductible before PAYE is calculated, so they lower your taxable income. SHIF is not deducted before PAYE, but it does attract a 15% insurance relief that reduces the tax due.',
        },
        {
          q: 'Is SHIF really 2.75% of my whole salary?',
          a: 'Yes. SHIF replaced NHIF in 2024 and is charged at a flat 2.75% of gross pay with no upper limit, unlike the old banded NHIF table. Someone earning KES 100,000 pays KES 2,750 a month.',
        },
      ]}
    />
  )
}

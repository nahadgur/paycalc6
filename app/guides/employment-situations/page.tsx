import type { Metadata } from 'next'
import { SiloHub } from '@/components/SiloHub'

export const metadata: Metadata = {
  title: 'PAYE in Real Life — Bonuses, Freelancing, HELB & Job Changes (Kenya 2026)',
  description:
    'How PAYE actually behaves in Kenyan working life: bonuses and 13th-month pay, freelancing vs employment, HELB deductions, changing jobs, employer errors, and filing taxes as a couple.',
  alternates: { canonical: 'https://payecalculator.co.ke/guides/employment-situations' },
}

export default function EmploymentSituationsHub() {
  return (
    <SiloHub
      siloKey="employment-situations"
      heading="PAYE in Real Working Life (Kenya 2026)"
      intro={
        <>
          <p>
            The textbook PAYE calculation assumes a steady monthly salary, but real working life is
            messier. A bonus lands and pushes you into a higher band for one month. You pick up
            freelance work on the side. HELB starts deducting. You change jobs halfway through the
            year and suddenly your tax looks wrong. These guides cover the situations the basic
            calculator does not.
          </p>
          <p>
            Each one explains what KRA expects, how the deduction or adjustment is worked out, and
            what to do if something looks off on your payslip, including the common case of an
            employer deducting the wrong PAYE.
          </p>
        </>
      }
      faqs={[
        {
          q: 'Is my bonus taxed more than my salary in Kenya?',
          a: 'A bonus is taxed as part of that month\'s income, so it can be taxed at your highest PAYE band (up to 35%) for that month, which makes it feel like it is taxed more. It is not a separate higher rate. The bonus guide shows how the one-month spike works.',
        },
        {
          q: 'Do I pay PAYE on freelance income in Kenya?',
          a: 'PAYE applies to employment income. Freelance or self-employed income is taxed under different rules and you account for it yourself on your annual return. The freelancing vs employment guide compares the total tax on each.',
        },
        {
          q: 'My employer is deducting the wrong PAYE — what do I do?',
          a: 'First confirm the correct figure with the calculator, then raise it with payroll in writing. If it is not fixed, you can reconcile it on your annual iTax return and claim back any overpayment. The dedicated guide walks through the steps.',
        },
      ]}
    />
  )
}

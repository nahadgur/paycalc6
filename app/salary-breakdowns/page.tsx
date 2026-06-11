import type { Metadata } from 'next'
import { SiloHub } from '@/components/SiloHub'

export const metadata: Metadata = {
  title: 'Kenya Salary Breakdowns 2026 — What You Actually Take Home',
  description:
    'See exactly what common Kenyan salaries look like after PAYE, NSSF, SHIF and the Housing Levy in 2026, from KES 50,000 to KES 200,000 and beyond, plus what you need to live comfortably in Nairobi.',
  alternates: { canonical: 'https://payecalculator.co.ke/salary-breakdowns' },
}

export default function SalaryBreakdownsHub() {
  return (
    <SiloHub
      siloKey="salary-breakdowns"
      heading="Kenya Salary Breakdowns (2026)"
      intro={
        <>
          <p>
            A gross salary and a take-home salary are two very different numbers in Kenya. Between
            them sit PAYE, NSSF, SHIF and the Housing Levy, and the gap widens as you earn more
            because PAYE is banded up to 35%. These breakdowns show, salary by salary, exactly what
            lands in your account and where every shilling goes.
          </p>
          <p>
            Each guide below takes a real salary level and walks through the full deduction stack,
            so you can find the figure closest to yours. For your own exact number, the calculator
            does the same maths on any salary in seconds.
          </p>
        </>
      }
      faqs={[
        {
          q: 'How much is deducted from a KES 100,000 salary in Kenya?',
          a: 'On KES 100,000 gross in 2026 you lose PAYE, NSSF (KES 6,000 at that level), SHIF (KES 2,750) and the Housing Levy (KES 1,500), leaving a net take-home in the region of KES 73,000–75,000 depending on reliefs. The dedicated guide shows the full breakdown.',
        },
        {
          q: 'Why does my take-home not rise much when I get a raise?',
          a: 'Kenya PAYE is progressive, so higher slices of income are taxed at 30% and 35%. Once you pass roughly KES 100,000 a month, a large part of every extra shilling goes to PAYE plus the uncapped SHIF and housing levy, so net pay rises slowly. The high-earners guide explains the bands.',
        },
        {
          q: 'What salary do you need to live comfortably in Nairobi?',
          a: 'It depends on rent and lifestyle, but the comfort-in-Nairobi guide works through a realistic monthly budget and back-solves the gross salary you would need after all deductions.',
        },
      ]}
    />
  )
}

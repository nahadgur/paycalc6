import type { Metadata } from 'next'

// The page itself is a client component, so its metadata (and canonical) lives
// here in a server-component segment layout.
export const metadata: Metadata = {
  title: 'Kenya Salary Budget Planner',
  description: 'Plan your monthly budget around your Kenyan take-home pay. See how PAYE, NSSF, SHIF and the Housing Levy shape what you can spend, save and invest.',
  alternates: { canonical: 'https://payecalculator.co.ke/budget-guide' },
}

export default function BudgetGuideLayout({ children }: { children: React.ReactNode }) {
  return children
}

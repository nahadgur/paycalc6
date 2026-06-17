import type { Metadata } from 'next'

// The page itself is a client component, so its metadata (and canonical) lives
// here in a server-component segment layout.
export const metadata: Metadata = {
  title: 'Annual P9 Certificate Generator',
  description: 'Generate your annual P9 tax deduction certificate for Kenya. Enter your monthly pay and deductions to produce a P9 summary for your KRA return.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/p9-generator' },
}

export default function P9GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children
}

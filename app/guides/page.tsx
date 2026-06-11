import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { SILOS, spokeTitle } from '@/lib/silos'

export const metadata: Metadata = {
  title: 'Kenya PAYE & Salary Guides 2026 — by Topic',
  description:
    'Every Kenya payroll guide, organised by topic: statutory deductions (NSSF, SHIF, Housing Levy), tax savings, salary breakdowns, employment situations, employer obligations and the latest changes.',
  alternates: { canonical: 'https://payecalculator.co.ke/guides' },
}

// Topical pillar hubs (the how-paye-works set lives on the homepage calculator).
const HUBS = SILOS.filter((s) => s.hubHref.startsWith('/guides/'))

export default function GuidesIndex() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://payecalculator.co.ke/' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://payecalculator.co.ke/guides' },
    ],
  }

  return (
    <div className="paye-calc-body min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-6">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700 font-medium">Guides</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Kenya Payroll Guides</h1>
          <p className="text-lg text-stone-600 leading-relaxed">
            Everything about Kenyan PAYE, deductions and take-home pay, organised by topic. Each
            guide pulls together the articles on that subject, with the latest 2026 figures.
          </p>
        </header>

        <div className="space-y-5">
          {HUBS.map((hub) => (
            <Link
              key={hub.key}
              href={hub.hubHref}
              className="group block rounded-2xl bg-white border border-stone-200 hover:border-brand-300 p-6 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1.5 group-hover:text-brand-700 transition-colors">
                    {hub.title}
                  </h2>
                  <p className="text-stone-600 leading-relaxed text-[15px] mb-3">{hub.blurb}</p>
                  <p className="text-xs text-stone-500">
                    {hub.spokes.length} guides ·{' '}
                    {hub.spokes.slice(0, 2).map((s) => spokeTitle(s)).join(' · ')}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-700 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/blog" className="text-sm text-brand-700 hover:underline">
            Or browse every article →
          </Link>
        </div>
      </div>
    </div>
  )
}

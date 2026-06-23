import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronRight,
  BookOpen,
  Landmark,
  PiggyBank,
  Wallet,
  Briefcase,
  Building2,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'
import { SILOS, spokeTitle, type Silo } from '@/lib/silos'
import Hero from '@/components/Hero'
import KitBanner from '@/components/KitBanner'

export const metadata: Metadata = {
  title: { absolute: 'Kenya PAYE & Salary Guides 2026, by Topic' },
  description:
    'Every Kenya payroll guide by topic: statutory deductions, tax savings, salary breakdowns, employment situations and employer obligations.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/guides' },
}

// Topical pillar hubs. The pillar page is the silo's guideHref (a /guides/ page),
// not hubHref (which is always a calculator). how-paye-works has no guideHref —
// its hub is the homepage calculator — so it is correctly excluded here.
const HUBS = SILOS.filter(
  (s): s is Silo & { guideHref: string } => !!s.guideHref?.startsWith('/guides/'),
)

const HUB_ICONS: Record<string, LucideIcon> = {
  'statutory-deductions': Landmark,
  'tax-savings': PiggyBank,
  'salary-breakdowns': Wallet,
  'employment-situations': Briefcase,
  'for-employers': Building2,
  'news-updates': Newspaper,
}

export default function GuidesIndex() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.payecalculator.co.ke/' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.payecalculator.co.ke/guides' },
    ],
  }
  const totalGuides = HUBS.reduce((n, h) => n + h.spokes.length, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <Hero
        h1="Kenya Payroll Guides"
        desc="Everything about Kenyan PAYE, deductions and take-home pay, organised by topic. Each guide pulls together the articles on that subject, with the latest 2026 figures."
        cta={{ href: '/', label: 'Open the PAYE calculator →' }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-brand-50/40 pt-8 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-8">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-700 font-medium">Guides</span>
          </nav>

          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="editorial-h text-[26px] sm:text-[34px] text-stone-900">
              Browse by <span className="accent">topic</span>
            </h2>
            <span className="hidden sm:block text-[12px] text-stone-400 pb-1">
              {HUBS.length} topics · {totalGuides} guides
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {HUBS.map((hub) => {
              const Icon = HUB_ICONS[hub.key] ?? BookOpen
              return (
                <Link
                  key={hub.key}
                  href={hub.guideHref}
                  className="group flex flex-col rounded-2xl bg-white border border-stone-200/80 p-6 transition-all duration-200 hover:border-brand-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(240,76,64,0.10)]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-500">
                      {hub.spokes.length} guides
                    </span>
                  </div>

                  <h3 className="editorial-h text-[22px] text-stone-900 mb-2 transition-colors group-hover:text-brand-700">
                    {hub.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-[14px] mb-4">{hub.blurb}</p>

                  <p className="text-[12px] text-stone-400 leading-relaxed mb-5">
                    {hub.spokes.slice(0, 2).map((s) => spokeTitle(s)).join(' · ')}
                  </p>

                  <div className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700">
                    Explore guides
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )
            })}
          </div>

          <KitBanner className="mt-12" />

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              Or browse every article
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowRight,
  BookOpen,
  Landmark,
  PiggyBank,
  Wallet,
  Briefcase,
  Building2,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import articles from '@/lib/articles.json'

export const metadata: Metadata = {
  title: 'Kenya Tax & PAYE Articles',
  description: 'Articles on Kenya PAYE tax, NSSF, SHIF, the Housing Levy and more. How to work out your salary and reduce your tax legally, updated for 2026.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/blog' },
  openGraph: {
    title: 'Kenya Tax & PAYE Articles | PAYE Calculator Kenya',
    description: 'Comprehensive articles on Kenya PAYE tax, NSSF contributions, SHIF deductions, and more.',
  },
}

const categories: Record<string, string[]> = {
  'How-to guides': [
    'how-to-calculate-your-paye-tax-in-kenya',
    'how-kenyan-employees-can-calculate-their-net-salary',
    'working-backwards-from-net-to-gross-salary-in-kenya',
  ],
  'Statutory deductions': [
    'the-complete-guide-to-nssf-contributions-in-kenya',
    'understanding-shif-deductions-in-kenya-and-what-replaced-nhif',
    'everything-you-need-to-know-about-kenyas-housing-levy',
  ],
  'Tax savings': [
    'legal-ways-to-reduce-paye-in-kenya',
    'how-insurance-relief-works-for-kenyan-taxpayers',
    'claiming-mortgage-interest-relief-on-your-kenyan-tax-return',
    'why-kenyan-employees-should-max-out-their-pension-contributions',
    'tax-benefits-for-persons-with-disability-in-kenya',
  ],
  'Salary breakdowns': [
    'what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya',
    'take-home-pay-on-a-kes-100000-salary-in-kenya',
    'how-much-tax-do-you-pay-on-kes-150000-in-kenya',
    'the-real-cost-of-earning-kes-200000-in-kenya',
    'paye-rates-for-high-earners-in-kenya-explained',
  ],
  'Employment situations': [
    'how-kenyan-employers-tax-your-bonus-and-13th-month-pay',
    'freelancing-vs-employment-in-kenya-and-which-pays-less-tax',
    'how-helb-loan-repayments-are-deducted-from-kenyan-salaries',
    'what-happens-to-your-paye-when-you-change-jobs-in-kenya',
    'what-to-do-if-your-kenyan-employer-is-deducting-wrong-paye',
    'how-kenyan-couples-can-file-taxes-together-or-separately',
  ],
  'For employers': [
    'the-true-cost-of-hiring-an-employee-in-kenya',
    'a-kenyan-employers-guide-to-nssf-and-housing-levy-obligations',
    'filing-paye-returns-on-itax-in-kenya-without-getting-penalised',
    'taxable-benefits-in-kind-that-kenyan-employers-must-declare',
  ],
  'News & updates': [
    'what-the-kenya-finance-bill-2025-means-for-your-salary',
    'key-kra-tax-deadlines-every-kenyan-should-know',
    'how-the-new-nssf-rates-affect-kenyan-workers',
  ],
  'Lifestyle': [
    'what-salary-do-you-need-to-live-comfortably-in-nairobi',
  ],
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'How-to guides': BookOpen,
  'Statutory deductions': Landmark,
  'Tax savings': PiggyBank,
  'Salary breakdowns': Wallet,
  'Employment situations': Briefcase,
  'For employers': Building2,
  'News & updates': Newspaper,
  'Lifestyle': Sparkles,
}

const catId = (name: string) =>
  name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function BlogPage() {
  const articleMap = new Map(articles.map(a => [a.slug, a]))
  const featuredSlugs = [
    'how-to-calculate-your-paye-tax-in-kenya',
    'the-complete-guide-to-nssf-contributions-in-kenya',
    'legal-ways-to-reduce-paye-in-kenya',
  ]
  const total = Object.values(categories).reduce((n, s) => n + s.length, 0)

  return (
    <div className="bg-white">
      {/* Hero — contained Bold Poster, matches the calculator and guide heroes */}
      <section className="bg-white pt-4 sm:pt-6 px-4 sm:px-6">
        <div className="relative max-w-5xl mx-auto bg-brand text-white rounded-2xl sm:rounded-3xl overflow-hidden">
          <svg aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 w-[300px] sm:w-[440px] h-auto text-white/10" viewBox="0 0 400 400" fill="none">
            <circle cx="270" cy="130" r="160" stroke="currentColor" strokeWidth="2" />
            <circle cx="270" cy="130" r="112" stroke="currentColor" strokeWidth="2" />
            <circle cx="270" cy="130" r="64" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg aria-hidden="true" className="pointer-events-none absolute -left-20 -bottom-24 w-[260px] sm:w-[320px] h-auto text-white/[0.05]" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="100" fill="currentColor" />
          </svg>

          <div className="relative z-10 px-5 sm:px-8 md:px-10 py-14 sm:py-20">
            <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-white/70 mb-3">The library</p>
            <h1 className="editorial-h text-[44px] sm:text-[72px] mb-4">
              Kenya tax, <span className="italic">explained</span>.
            </h1>
            <p className="text-[14px] sm:text-[16px] opacity-90 max-w-xl leading-relaxed">
              {total} in-depth articles on PAYE, NSSF, SHIF, the Housing Levy, and every legal way to reduce your tax in Kenya.
            </p>

            {/* Category quick-nav */}
            <div className="mt-8 flex flex-wrap gap-2">
              {Object.keys(categories).map((cat) => (
                <a
                  key={cat}
                  href={`#${catId(cat)}`}
                  className="rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-white/25"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14">
          <h2 className="editorial-h text-[26px] sm:text-[32px] mb-8">
            Featured <span className="accent">articles</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredSlugs.map((slug) => {
              const article = articleMap.get(slug)
              if (!article) return null
              return (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="group relative flex flex-col rounded-2xl border border-stone-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_8px_30px_rgba(240,76,64,0.10)]"
                >
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    <Sparkles className="h-3 w-3" /> Featured
                  </span>
                  <h3 className="editorial-h text-[20px] mb-3 transition-colors group-hover:text-brand">
                    {article.title}
                  </h3>
                  <p className="text-[#666] text-[13px] leading-relaxed line-clamp-3 mb-4">
                    {article.metaDescription}
                  </p>
                  <div className="mt-auto flex items-center gap-1 text-brand text-[12px] font-medium">
                    Read article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Full library by category */}
      <section className="bg-brand-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14">
          <h2 className="editorial-h text-[26px] sm:text-[32px] mb-10 text-brand-900">
            The full <span className="accent">library</span>
          </h2>

          <div className="space-y-12">
            {Object.entries(categories).map(([category, slugs]) => {
              const Icon = CATEGORY_ICONS[category] ?? BookOpen
              return (
                <div key={category} id={catId(category)} className="scroll-mt-24">
                  <div className="mb-5 flex items-center gap-3 border-b border-brand-300 pb-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <h3 className="editorial-h text-[20px] text-brand-900">{category}</h3>
                    <span className="ml-auto text-[11px] font-medium text-brand-700/70">
                      {slugs.length} article{slugs.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {slugs.map((slug) => {
                      const article = articleMap.get(slug)
                      if (!article) return null
                      return (
                        <Link
                          key={slug}
                          href={`/blog/${slug}`}
                          className="group flex flex-col rounded-xl border border-brand-300/40 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_6px_24px_rgba(240,76,64,0.10)]"
                        >
                          <h4 className="mb-2 text-[14px] font-medium leading-snug text-[#111] transition-colors group-hover:text-brand">
                            {article.title}
                          </h4>
                          <p className="text-[#666] text-[12px] line-clamp-2 leading-relaxed mb-3">
                            {article.metaDescription}
                          </p>
                          <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
                            Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

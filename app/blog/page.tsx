import Link from 'next/link'
import { Metadata } from 'next'
import articles from '@/lib/articles.json'

export const metadata: Metadata = {
  title: 'Kenya Tax & PAYE Articles',
  description: 'Comprehensive articles on Kenya PAYE tax, NSSF contributions, SHIF deductions, Housing Levy, and more. Learn how to calculate your salary and reduce your tax legally.',
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
    'the-complete-guide-to-nssf-contributions-in-kenya-for-2026',
    'understanding-shif-deductions-in-kenya-and-what-replaced-nhif',
    'everything-you-need-to-know-about-kenyas-housing-levy',
  ],
  'Tax savings': [
    '7-legal-ways-kenyan-employees-can-reduce-their-paye',
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
    'key-kra-tax-deadlines-every-kenyan-should-know-in-2026',
    'how-the-new-nssf-rates-affect-kenyan-workers',
  ],
  'Lifestyle': [
    'what-salary-do-you-need-to-live-comfortably-in-nairobi',
  ],
}

export default function BlogPage() {
  const articleMap = new Map(articles.map(a => [a.slug, a]))
  const featuredSlugs = [
    'how-to-calculate-your-paye-tax-in-kenya',
    'the-complete-guide-to-nssf-contributions-in-kenya-for-2026',
    '7-legal-ways-kenyan-employees-can-reduce-their-paye',
  ]

  return (
    <div className="bg-white">
      {/* Hero — red canvas Bold Poster */}
      <section className="bg-brand text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
          <div className="flex justify-between items-baseline mb-6 text-xs text-stone-500 font-medium">
            <span>Kenya · 2026</span>
            <span className="opacity-80">The blog</span>
          </div>
          <h1 className="editorial-h text-[44px] sm:text-[72px] mb-4">
            Kenya tax, <span className="italic">explained</span>.
          </h1>
          <p className="text-[14px] sm:text-[16px] opacity-90 max-w-xl leading-relaxed">
            Thirty in-depth articles on PAYE, NSSF, SHIF, Housing Levy, and every legal way to reduce your tax in Kenya.
          </p>
          <div className="mt-8 h-px bg-white/40"></div>
        </div>
      </section>

      {/* Featured — white */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14">
          <h2 className="editorial-h text-[26px] sm:text-[32px] mb-8">
            Featured <span className="accent">articles</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredSlugs.map((slug, i) => {
              const article = articleMap.get(slug)
              if (!article) return null
              return (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="group relative bg-white border border-[#eee] rounded-2xl p-6 hover:border-brand transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="absolute top-4 right-4 w-6 h-6 bg-brand-50 rounded-full flex items-center justify-center text-[10px] font-medium text-brand-700">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="editorial-h text-[20px] mb-3 group-hover:text-brand transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[#666] text-[13px] leading-relaxed line-clamp-3 mb-4">
                    {article.metaDescription}
                  </p>
                  <div className="mt-auto text-brand text-[12px] font-medium flex items-center gap-1">
                    Read article <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* All categories — cream section */}
      <section className="bg-brand-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14">
          <h2 className="editorial-h text-[26px] sm:text-[32px] mb-10 text-brand-900">
            The full <span className="accent">library</span>
          </h2>

          <div className="space-y-10">
            {Object.entries(categories).map(([category, slugs], catIdx) => (
              <div key={category}>
                <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-brand-300">
                  <span className="text-[10px] text-brand-700 font-medium tracking-wider">
                    {String(catIdx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="editorial-h text-[20px] text-brand-900">{category}</h3>
                  <span className="text-[11px] text-brand-700 opacity-70 ml-auto">{slugs.length} article{slugs.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slugs.map((slug) => {
                    const article = articleMap.get(slug)
                    if (!article) return null
                    return (
                      <Link
                        key={slug}
                        href={`/blog/${slug}`}
                        className="group bg-white rounded-xl p-5 border border-brand-300/50 hover:border-brand transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <h4 className="font-medium text-[14px] text-[#111] mb-2 group-hover:text-brand transition-colors leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-[#666] text-[12px] line-clamp-2 leading-relaxed">
                          {article.metaDescription}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

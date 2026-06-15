// lib/silos.ts
// Single source of truth for the hub-and-spoke silo structure.
// Each silo = one hub (pillar page) + its spokes (blog articles). The hub
// links down to its spokes; each spoke links back up to its hub (see
// components/SiloHub.tsx and app/blog/[slug]/page.tsx).
import articlesData from '@/lib/articles.json'

const articles = articlesData as { slug: string; title: string }[]
const titleMap = new Map(articles.map((a) => [a.slug, a.title]))

export function spokeTitle(slug: string): string {
  return titleMap.get(slug) ?? slug
}

export interface Cta {
  href: string
  label: string
}

export interface Silo {
  key: string
  title: string
  hubHref: string
  blurb: string
  spokes: string[]
  cta: Cta
}

export const SILOS: Silo[] = [
  {
    key: 'how-paye-works',
    title: 'How PAYE Works',
    hubHref: '/',
    blurb: 'The fundamentals of calculating PAYE, net salary, and working backwards from net to gross in Kenya.',
    spokes: [
      'how-to-calculate-your-paye-tax-in-kenya',
      'how-kenyan-employees-can-calculate-their-net-salary',
      'working-backwards-from-net-to-gross-salary-in-kenya',
    ],
    cta: { href: '/', label: 'Calculate your exact take-home' },
  },
  {
    key: 'statutory-deductions',
    title: 'Statutory Deductions',
    hubHref: '/guides/statutory-deductions',
    blurb: 'NSSF, SHIF, and the Housing Levy: the three mandatory deductions that come out of every Kenyan payslip in 2026.',
    spokes: [
      'the-complete-guide-to-nssf-contributions-in-kenya',
      'understanding-shif-deductions-in-kenya-and-what-replaced-nhif',
      'everything-you-need-to-know-about-kenyas-housing-levy',
    ],
    cta: { href: '/', label: 'See your full deduction breakdown' },
  },
  {
    key: 'tax-savings',
    title: 'Tax Savings & Reliefs',
    hubHref: '/guides/tax-relief',
    blurb: 'Legal ways to reduce your PAYE: insurance relief, mortgage interest relief, pension contributions, and disability exemptions.',
    spokes: [
      'legal-ways-to-reduce-paye-in-kenya',
      'how-insurance-relief-works-for-kenyan-taxpayers',
      'claiming-mortgage-interest-relief-on-your-kenyan-tax-return',
      'why-kenyan-employees-should-max-out-their-pension-contributions',
      'tax-benefits-for-persons-with-disability-in-kenya',
    ],
    cta: { href: '/', label: 'See how reliefs cut your PAYE' },
  },
  {
    key: 'salary-breakdowns',
    title: 'Salary Breakdowns',
    hubHref: '/guides/salary-breakdowns',
    blurb: 'Exactly what common Kenyan salaries look like after PAYE, NSSF, SHIF, and the Housing Levy, from KES 50,000 to KES 200,000 and beyond.',
    spokes: [
      'what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya',
      'take-home-pay-on-a-kes-100000-salary-in-kenya',
      'how-much-tax-do-you-pay-on-kes-150000-in-kenya',
      'the-real-cost-of-earning-kes-200000-in-kenya',
      'paye-rates-for-high-earners-in-kenya-explained',
      'what-salary-do-you-need-to-live-comfortably-in-nairobi',
    ],
    cta: { href: '/salary-comparison', label: 'Compare salaries side by side' },
  },
  {
    key: 'employment-situations',
    title: 'Employment Situations',
    hubHref: '/guides/employment-situations',
    blurb: 'How PAYE behaves in real working life: bonuses, freelancing, HELB, changing jobs, employer errors, and filing as a couple.',
    spokes: [
      'how-kenyan-employers-tax-your-bonus-and-13th-month-pay',
      'freelancing-vs-employment-in-kenya-and-which-pays-less-tax',
      'how-helb-loan-repayments-are-deducted-from-kenyan-salaries',
      'what-happens-to-your-paye-when-you-change-jobs-in-kenya',
      'what-to-do-if-your-kenyan-employer-is-deducting-wrong-paye',
      'how-kenyan-couples-can-file-taxes-together-or-separately',
    ],
    cta: { href: '/', label: 'Check your PAYE for your situation' },
  },
  {
    key: 'for-employers',
    title: 'For Employers',
    hubHref: '/guides/employer-guide',
    blurb: 'Payroll obligations for Kenyan employers: the true cost of hiring, NSSF and Housing Levy duties, iTax filing, and benefits in kind.',
    spokes: [
      'the-true-cost-of-hiring-an-employee-in-kenya',
      'a-kenyan-employers-guide-to-nssf-and-housing-levy-obligations',
      'filing-paye-returns-on-itax-in-kenya-without-getting-penalised',
      'taxable-benefits-in-kind-that-kenyan-employers-must-declare',
    ],
    cta: { href: '/employer-cost-calculator', label: 'Work out the true cost to employ' },
  },
  {
    key: 'news-updates',
    title: 'News & Updates',
    hubHref: '/guides/statutory-changes',
    blurb: 'The latest changes to Kenyan payroll: the Finance Bill, KRA deadlines, and the new NSSF rates.',
    spokes: [
      'what-the-kenya-finance-bill-2025-means-for-your-salary',
      'key-kra-tax-deadlines-every-kenyan-should-know',
      'how-the-new-nssf-rates-affect-kenyan-workers',
    ],
    cta: { href: '/', label: 'Recalculate on 2026 rates' },
  },
]

const spokeToSilo = new Map<string, Silo>()
for (const s of SILOS) for (const sp of s.spokes) spokeToSilo.set(sp, s)

export function siloForSpoke(slug: string): Silo | undefined {
  return spokeToSilo.get(slug)
}
export function siloByKey(key: string): Silo | undefined {
  return SILOS.find((s) => s.key === key)
}

// Per-article CTA overrides: where an individual post matches a specific
// tool more tightly than its silo default. Takes precedence over the silo cta.
const CTA_OVERRIDES: Record<string, Cta> = {
  'working-backwards-from-net-to-gross-salary-in-kenya':
    { href: '/net-gross-calculator', label: 'Work out gross from your net' },
  'the-complete-guide-to-nssf-contributions-in-kenya':
    { href: '/nssf-calculator', label: 'Calculate your NSSF contribution' },
  'claiming-mortgage-interest-relief-on-your-kenyan-tax-return':
    { href: '/mortgage-relief', label: 'Calculate your mortgage relief' },
  'what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya':
    { href: '/salary/50000', label: 'See the full KES 50,000 breakdown' },
  'take-home-pay-on-a-kes-100000-salary-in-kenya':
    { href: '/salary/100000', label: 'See the full KES 100,000 breakdown' },
  'how-much-tax-do-you-pay-on-kes-150000-in-kenya':
    { href: '/salary/150000', label: 'See the full KES 150,000 breakdown' },
  'the-real-cost-of-earning-kes-200000-in-kenya':
    { href: '/salary/200000', label: 'See the full KES 200,000 breakdown' },
  'how-kenyan-employers-tax-your-bonus-and-13th-month-pay':
    { href: '/bonus-calculator', label: 'Calculate the tax on your bonus' },
  'key-kra-tax-deadlines-every-kenyan-should-know':
    { href: '/tax-calendar', label: 'See the 2026 KRA tax calendar' },
  'how-the-new-nssf-rates-affect-kenyan-workers':
    { href: '/nssf-calculator', label: 'Calculate your NSSF contribution' },
  'filing-paye-returns-on-itax-in-kenya-without-getting-penalised':
    { href: '/p9-generator', label: 'Generate your P9 form' },
}

const DEFAULT_CTA: Cta = { href: '/', label: 'Open calculator' }

// Resolve the best CTA for a blog post: per-article override, then silo
// default, then the main calculator as a fallback.
export function ctaForSpoke(slug: string): Cta {
  return CTA_OVERRIDES[slug] ?? siloForSpoke(slug)?.cta ?? DEFAULT_CTA
}

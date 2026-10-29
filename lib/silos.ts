// lib/silos.ts
// Single source of truth for the hub-and-spoke silo structure.
// Each silo = one hub (pillar page) + its spokes (blog articles). The hub
// links down to its spokes; each spoke links back up to its hub (see
// components/SiloHub.tsx and app/blog/[slug]/page.tsx).
import articlesData from '@/lib/articles.json'

const articles = articlesData as { slug: string; title: string; draft?: boolean }[]
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
  // hubHref is the silo's hub: always a calculator. Authority concentrates here.
  hubHref: string
  // guideHref is the silo's pillar guide page, the natural parent of its blog
  // spokes. Omitted for how-paye-works (the homepage calculator is its own hub).
  guideHref?: string
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
      'working-backwards-from-net-to-gross-salary-in-kenya',
    ],
    cta: { href: '/', label: 'Calculate your exact take-home' },
  },
  {
    key: 'statutory-deductions',
    title: 'Statutory Deductions',
    hubHref: '/nssf-calculator',
    guideHref: '/guides/statutory-deductions',
    blurb: 'NSSF, SHIF, and the Housing Levy: the three mandatory deductions that come out of every Kenyan payslip in 2026.',
    spokes: [
      'how-to-check-your-nssf-contributions',
      'how-to-check-your-sha-contributions',
      'missing-nssf-contributions-what-to-do',
      'the-complete-guide-to-nssf-contributions-in-kenya',
      'understanding-shif-deductions-in-kenya-and-what-replaced-nhif',
      'everything-you-need-to-know-about-kenyas-housing-levy',
    ],
    cta: { href: '/nssf-calculator', label: 'Calculate your NSSF deduction' },
  },
  {
    key: 'tax-savings',
    title: 'Tax Savings & Reliefs',
    hubHref: '/mortgage-relief',
    guideHref: '/guides/tax-relief',
    blurb: 'Legal ways to reduce your PAYE: insurance relief, mortgage interest relief, pension contributions, and disability exemptions.',
    spokes: [
      'personal-relief-in-kenya',
      'claim-tax-relief-through-payroll',
      'documents-for-paye-tax-relief',
      'legal-ways-to-reduce-paye-in-kenya',
      'how-insurance-relief-works-for-kenyan-taxpayers',
      'claiming-mortgage-interest-relief-on-your-kenyan-tax-return',
      'why-kenyan-employees-should-max-out-their-pension-contributions',
      'tax-benefits-for-persons-with-disability-in-kenya',
    ],
    cta: { href: '/mortgage-relief', label: 'Calculate your mortgage relief' },
  },
  {
    key: 'salary-breakdowns',
    title: 'Salary Breakdowns',
    hubHref: '/salary-comparison',
    guideHref: '/guides/salary-breakdowns',
    blurb: 'Exactly what common Kenyan salaries look like after PAYE, NSSF, SHIF, and the Housing Levy, from KES 50,000 to KES 200,000 and beyond.',
    spokes: [
      'gross-vs-net-salary-in-kenya',
      'how-to-read-your-kenyan-payslip',
      'taxable-pay-vs-gross-pay-in-kenya',
      'what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya',
      'take-home-pay-on-a-kes-100000-salary-in-kenya',
      'how-much-tax-do-you-pay-on-kes-150000-in-kenya',
      'the-real-cost-of-earning-kes-200000-in-kenya',
      'what-salary-do-you-need-to-live-comfortably-in-nairobi',
    ],
    cta: { href: '/salary-comparison', label: 'Compare salaries side by side' },
  },
  {
    key: 'employment-situations',
    title: 'Employment Situations',
    hubHref: '/bonus-calculator',
    guideHref: '/guides/employment-situations',
    blurb: 'How PAYE behaves in real working life: bonuses, freelancing, HELB, changing jobs, employer errors, second jobs and terminal dues.',
    spokes: [
      'is-notice-pay-taxable-in-kenya',
      'is-unused-leave-pay-taxable-in-kenya',
      'redundancy-pay-and-tax-in-kenya',
      'is-overtime-taxable-in-kenya',
      'are-salary-allowances-taxable-in-kenya',
      'salary-arrears-and-paye-in-kenya',
      'how-kenyan-employers-tax-your-bonus-and-13th-month-pay',
      'freelancing-vs-employment-in-kenya-and-which-pays-less-tax',
      'how-helb-loan-repayments-are-deducted-from-kenyan-salaries',
      'what-happens-to-your-paye-when-you-change-jobs-in-kenya',
      'what-to-do-if-your-kenyan-employer-is-deducting-wrong-paye',
      'how-terminal-dues-are-taxed-when-you-leave-a-job-in-kenya',
      'how-a-second-job-is-taxed-in-kenya',
    ],
    cta: { href: '/bonus-calculator', label: 'Calculate tax on your bonus' },
  },
  {
    key: 'for-employers',
    title: 'For Employers',
    hubHref: '/employer-cost-calculator',
    guideHref: '/guides/employer-guide',
    blurb: 'Payroll obligations for Kenyan employers: the true cost of hiring, NSSF and Housing Levy duties, iTax filing, and benefits in kind.',
    spokes: [
      'how-to-set-up-payroll-in-kenya',
      'new-employee-payroll-checklist-kenya',
      'payroll-records-kenyan-employers-need',
      'the-true-cost-of-hiring-an-employee-in-kenya',
      'filing-paye-returns-on-itax-in-kenya-without-getting-penalised',
      'taxable-benefits-in-kind-that-kenyan-employers-must-declare',
    ],
    cta: { href: '/employer-cost-calculator', label: 'Work out the true cost to employ' },
  },
  {
    key: 'news-updates',
    title: 'News & Updates',
    hubHref: '/tax-calendar',
    guideHref: '/guides/statutory-changes',
    blurb: 'The latest changes to Kenyan payroll: the Finance Bill, KRA deadlines, and the new NSSF rates.',
    spokes: [
      'what-the-kenya-finance-bill-2025-means-for-your-salary',
      'key-kra-tax-deadlines-every-kenyan-should-know',
    ],
    cta: { href: '/tax-calendar', label: 'See the KRA tax calendar' },
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
  'is-notice-pay-taxable-in-kenya': { href: '/', label: 'Understand your PAYE' },
  'is-unused-leave-pay-taxable-in-kenya': { href: '/', label: 'Understand your PAYE' },
  'redundancy-pay-and-tax-in-kenya': { href: '/', label: 'Understand your PAYE' },

  'is-overtime-taxable-in-kenya': { href: '/', label: 'Estimate your PAYE' },
  'are-salary-allowances-taxable-in-kenya': { href: '/', label: 'Estimate your PAYE' },
  'salary-arrears-and-paye-in-kenya': { href: '/', label: 'Estimate your PAYE' },

  'personal-relief-in-kenya': { href: '/', label: 'Estimate your PAYE' },
  'claim-tax-relief-through-payroll': { href: '/', label: 'Estimate your PAYE' },
  'documents-for-paye-tax-relief': { href: '/', label: 'Estimate your PAYE' },

  'how-to-check-your-sha-contributions':
    { href: '/', label: 'Calculate your salary deductions' },
  'understanding-shif-deductions-in-kenya-and-what-replaced-nhif':
    { href: '/', label: 'Calculate your salary deductions' },
  'everything-you-need-to-know-about-kenyas-housing-levy':
    { href: '/', label: 'Calculate your salary deductions' },
  'working-backwards-from-net-to-gross-salary-in-kenya':
    { href: '/net-gross-calculator', label: 'Convert net to gross' },
  'the-complete-guide-to-nssf-contributions-in-kenya':
    { href: '/nssf-calculator', label: 'Calculate your NSSF' },
  'claiming-mortgage-interest-relief-on-your-kenyan-tax-return':
    { href: '/mortgage-relief', label: 'Calculate your mortgage relief' },
  'what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya':
    { href: '/salary/50000', label: 'See the KES 50k breakdown' },
  'take-home-pay-on-a-kes-100000-salary-in-kenya':
    { href: '/salary/100000', label: 'See the KES 100k breakdown' },
  'how-much-tax-do-you-pay-on-kes-150000-in-kenya':
    { href: '/salary/150000', label: 'See the KES 150k breakdown' },
  'the-real-cost-of-earning-kes-200000-in-kenya':
    { href: '/salary/200000', label: 'See the KES 200k breakdown' },
  'how-kenyan-employers-tax-your-bonus-and-13th-month-pay':
    { href: '/bonus-calculator', label: 'Calculate tax on your bonus' },
  'key-kra-tax-deadlines-every-kenyan-should-know':
    { href: '/tax-calendar', label: 'See the tax calendar' },
  'how-the-new-nssf-rates-affect-kenyan-workers':
    { href: '/nssf-calculator', label: 'Calculate the new NSSF' },
  'filing-paye-returns-on-itax-in-kenya-without-getting-penalised':
    { href: '/p9-generator', label: 'Generate your P9' },
  'how-a-second-job-is-taxed-in-kenya':
    { href: '/', label: 'Open the PAYE calculator' },
}

const DEFAULT_CTA: Cta = { href: '/', label: 'Open calculator' }

// Resolve the best CTA for a blog post: per-article override, then silo
// default, then the main calculator as a fallback.
export function ctaForSpoke(slug: string): Cta {
  return CTA_OVERRIDES[slug] ?? siloForSpoke(slug)?.cta ?? DEFAULT_CTA
}

const CALCULATOR_TITLES: Record<string, string> = {
  '/': 'PAYE Calculator',
  '/nssf-calculator': 'NSSF Calculator',
  '/mortgage-relief': 'Mortgage Relief Calculator',
  '/salary-comparison': 'Salary Comparison Calculator',
  '/bonus-calculator': 'Bonus Tax Calculator',
  '/employer-cost-calculator': 'Employer Cost Calculator',
  '/net-gross-calculator': 'Net to Gross Calculator',
  '/raise-calculator': 'Pay Rise Calculator',
  '/p9-generator': 'P9 Generator',
  '/tax-calendar': 'Tax Calendar',
}

// Calculators are the primary hubs. The same destination powers the article
// breadcrumb, CTA and reciprocal article list on its calculator page.
export function calculatorHubForSpoke(slug: string): Cta {
  const cta = ctaForSpoke(slug)
  const salary = cta.href.match(/^\/salary\/(\d+)$/)
  const label = salary
    ? `KES ${Number(salary[1]).toLocaleString('en-KE')} Salary Breakdown`
    : CALCULATOR_TITLES[cta.href] ?? 'PAYE Calculator'
  return { href: cta.href, label }
}

export function spokesForCalculator(href: string): string[] {
  return articles
    .filter(article => !article.draft && calculatorHubForSpoke(article.slug).href === href)
    .map(article => article.slug)
}

// Heading + note for the in-article CTA card, matched to the destination
// calculator so the card text is no longer hardcoded to the homepage.
export interface CtaCard {
  title: string
  note: string
  // Short button trigger, deliberately decoupled from the title so the card
  // heading and the button do not echo each other.
  action: string
}

const CTA_CARDS: Record<string, CtaCard> = {
  '/': { title: 'Your exact take-home', note: '2026 KRA rates, instant', action: 'Open calculator' },
  '/nssf-calculator': { title: 'Your NSSF deduction', note: 'Tier I + II, 2026 rates', action: 'Open calculator' },
  '/mortgage-relief': { title: 'Your mortgage relief', note: 'Qualifying interest; saving depends on tax band', action: 'Open calculator' },
  '/salary-comparison': { title: 'Compare two salaries', note: 'Side by side, 2026 rates', action: 'Open comparison' },
  '/bonus-calculator': { title: 'Tax on your bonus', note: '13th-month + bonus, instant', action: 'Open calculator' },
  '/employer-cost-calculator': { title: 'True cost to employ', note: 'Gross plus employer NSSF and levy', action: 'Open calculator' },
  '/tax-calendar': { title: 'KRA tax calendar', note: '2026 filing deadlines', action: 'View calendar' },
  '/net-gross-calculator': { title: 'Net to gross', note: 'Work back to gross pay', action: 'Open calculator' },
  '/p9-generator': { title: 'Generate your P9', note: 'Year-end tax certificate', action: 'Open generator' },
}

export function ctaCard(href: string): CtaCard {
  const salary = href.match(/^\/salary\/(\d+)$/)
  if (salary) {
    const amount = Number(salary[1]).toLocaleString('en-KE')
    return { title: `KES ${amount} take-home`, note: 'Full 2026 breakdown', action: 'See breakdown' }
  }
  return CTA_CARDS[href] ?? { title: 'Your exact take-home', note: '2026 KRA rates, instant', action: 'Open calculator' }
}

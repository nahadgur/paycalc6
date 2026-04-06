import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kenya PAYE FAQ 2026 | Tax Questions Answered — KRA, SHIF, NSSF',
  description: 'Answers to the most common Kenya PAYE tax questions in 2026: SHIF, NSSF, Housing Levy, P9 forms, iTax filing, mortgage relief, freelancer tax, and more.',
  keywords: ['Kenya PAYE FAQ','KRA tax questions Kenya','is SHIF mandatory','NSSF Kenya FAQ','iTax Kenya help'],
  alternates: { canonical: 'https://payecalculator.co.ke/faq' },
}

type FAQ = {
  q: string
  a: string
  category: string
}

const FAQS: FAQ[] = [
  // SHIF
  {
    category: 'SHIF (Social Health Insurance Fund)',
    q: 'Is SHIF mandatory for all employees in Kenya?',
    a: 'Yes. SHIF (2.75% of gross salary) is mandatory for all formal sector employees in Kenya from 2026. The deduction is split equally between employee (1.375%) and employer (1.375%). Informal sector workers and self-employed individuals can join voluntarily at a minimum of KES 300 per month.',
  },
  {
    category: 'SHIF (Social Health Insurance Fund)',
    q: 'What is the minimum SHIF deduction per month?',
    a: 'The minimum SHIF deduction is KES 300 per month. This applies to employees whose 2.75% of gross salary would calculate to less than KES 300 — meaning anyone earning below KES 10,909 per month. For formal employees, SHIF is always at least KES 300.',
  },
  {
    category: 'SHIF (Social Health Insurance Fund)',
    q: 'Does my employer pay SHIF on my behalf?',
    a: 'Yes — unlike NHIF (which was employee-only), SHIF requires an equal contribution from the employer. Your employer pays 1.375% of your gross salary and you pay 1.375%. Both amounts are remitted to SHA together by the 9th of each month.',
  },
  {
    category: 'SHIF (Social Health Insurance Fund)',
    q: 'What happens if my employer does not deduct SHIF?',
    a: 'If your employer fails to deduct and remit SHIF, they face a 2% monthly penalty on the outstanding amount. As an employee, you are covered as long as your employer has complied with registration. Report non-compliant employers to the Social Health Authority (SHA) at sha.go.ke.',
  },
  // NSSF
  {
    category: 'NSSF',
    q: 'What is the NSSF pensionable pay ceiling in 2026?',
    a: 'The NSSF upper pensionable pay limit is KES 72,000 per month in 2026. Contributions are calculated on up to KES 72,000 of your pensionable pay — income above this is not subject to additional NSSF contributions.',
  },
  {
    category: 'NSSF',
    q: 'Can I opt out of NSSF if I have a private pension?',
    a: 'No. NSSF is mandatory for all employees earning above KES 1,000 per month. You cannot opt out even if you contribute to a private pension scheme. However, private pension contributions are tax-deductible (up to KES 30,000/month), which reduces your PAYE independently.',
  },
  {
    category: 'NSSF',
    q: 'When can I withdraw my NSSF savings?',
    a: 'NSSF Tier I savings can be accessed as a pension from age 50. Tier II provides a lump sum at withdrawal. You can access funds earlier in cases of invalidity (60% disability) or emigration. Your dependants receive survivor benefits upon your death after 36 months of contributions.',
  },
  // PAYE & Tax Bands
  {
    category: 'PAYE Tax',
    q: 'What are the Kenya PAYE tax bands for 2026?',
    a: 'The 2026 PAYE tax bands are: 10% on the first KES 24,000/month, 25% on KES 24,001–32,333, 30% on KES 32,334–500,000, 32.5% on KES 500,001–800,000, and 35% on amounts above KES 800,000 per month. A personal relief of KES 2,400/month applies to all taxpayers.',
  },
  {
    category: 'PAYE Tax',
    q: 'How is PAYE calculated in Kenya step by step?',
    a: 'Step 1: Calculate gross salary (basic + all allowances). Step 2: Subtract NSSF employee contribution. Step 3: Subtract any pension/mortgage deductions. Step 4: Apply progressive tax bands to the remaining taxable income. Step 5: Subtract personal relief (KES 2,400/month). Step 6: Subtract any insurance relief (15% of premium, max KES 5,000). The result is your monthly PAYE.',
  },
  {
    category: 'PAYE Tax',
    q: 'Why is my effective tax rate lower than the headline rate?',
    a: 'Kenya uses a progressive tax system. Not all your income is taxed at the highest band — only the portion above each threshold. For a KES 100,000 salary, the first KES 24,000 is taxed at 10%, the next KES 8,333 at 25%, and the remainder at 30%. The personal relief of KES 2,400 further reduces the final amount.',
  },
  // Housing Levy
  {
    category: 'Housing Levy',
    q: 'Can I get a refund of the Housing Levy if I already own a home?',
    a: 'Under current regulations, you cannot get an immediate refund. However, the Affordable Housing Levy can be credited toward purchasing a government affordable housing unit. After 5 years of contributions, accumulated funds may be partially refundable if you do not apply for a housing unit. Check the Boma Yangu portal at bomayangu.go.ke for current redemption options.',
  },
  {
    category: 'Housing Levy',
    q: 'Is the Housing Levy 1.5% or 3%?',
    a: 'You pay 1.5% of your gross salary — that is the employee share. Your employer also pays a matching 1.5%, making the total remittance 3% of your gross salary. However, only the 1.5% employee share is deducted from your take-home pay.',
  },
  // P9 Form
  {
    category: 'P9 Form',
    q: 'What happens if my employer does not issue my P9 form?',
    a: 'Employers are legally required to issue P9 forms to all employees by January 31 each year. Failure is a violation of the Income Tax Act. If your employer fails to provide it, write to them formally demanding the P9. If they do not comply, report to KRA via itax.kra.go.ke or call 0800 722 226. KRA can penalise employers for non-issuance.',
  },
  {
    category: 'P9 Form',
    q: 'What information should a P9 form contain?',
    a: 'A P9 must show: employer name and PIN, employee name and PIN, tax year, each month\'s gross pay, PAYE deducted each month, NSSF deducted, SHIF deducted, Housing Levy deducted, any reliefs applied, and annual totals. Our P9 Generator creates a compliant form for any salary.',
  },
  // iTax Filing
  {
    category: 'iTax Filing',
    q: 'Do I need to file an iTax return if my employer deducts PAYE?',
    a: 'Yes — every Kenyan with a KRA PIN must file an annual income tax return by June 30, even if you only earn PAYE income. In 2026, this is easier than ever: salaried employees can file a simplified pre-filled return in under 5 minutes using just their PIN and national ID. Filing a nil return is also required if you have zero income.',
  },
  {
    category: 'iTax Filing',
    q: 'What is the penalty for not filing my iTax return on time?',
    a: 'Failure to file an income tax return on time attracts a penalty of KES 20,000 for individuals. Additionally, if you owe tax, there is 5% on the tax due plus 1% interest per month. KRA can also restrict government services (passport renewal, business permits) for non-filers.',
  },
  {
    category: 'iTax Filing',
    q: 'How do I file a nil return on iTax?',
    a: 'Log into itax.kra.go.ke with your PIN and password. Go to Returns → File Return → Income Tax → Individual. Select "Nil Return" from the return type options. Confirm and submit. Nil returns take approximately 2 minutes. File one even if you had no income — failure to file attracts the same penalties.',
  },
  // Freelancer
  {
    category: 'Freelancers & Side Hustles',
    q: 'I have a salary and do freelance work on the side — how am I taxed?',
    a: 'Your salaried income continues to be taxed via PAYE. Your freelance/self-employment income must be declared on your annual iTax return as business income and taxed at the applicable PAYE rates. If your total freelance income exceeds KES 1 million per year, you may be required to register for VAT. Alternatively, if turnover is below KES 5 million, Turnover Tax (TOT) at 3% may apply instead of regular PAYE on the business income.',
  },
  {
    category: 'Freelancers & Side Hustles',
    q: 'What is the difference between Turnover Tax (TOT) and regular PAYE for freelancers?',
    a: 'Turnover Tax (TOT) at 3% applies to business income between KES 500,000 and KES 5 million per year and is simpler to calculate and file. Regular income tax (using PAYE rates) applies above KES 5 million or if you opt out of TOT. TOT is paid quarterly while regular income tax has a June 30 annual deadline.',
  },
  // Employer
  {
    category: 'Employers & Payroll',
    q: 'When is the deadline for PAYE remittance to KRA?',
    a: 'PAYE, SHIF, and Housing Levy must be remitted to KRA by the 9th of the following month. NSSF has a separate deadline of the 15th of the following month. Both must be accompanied by the relevant returns (P10 for PAYE, NSSF schedule for pensions). Late remittance attracts 5% initial penalty plus 1% per month.',
  },
  {
    category: 'Employers & Payroll',
    q: 'What is a P10 return and how often must it be filed?',
    a: 'The P10 is the employer\'s monthly PAYE return filed via iTax. It summarises all employees, their gross pay, and PAYE deducted for the month. It must be filed by the 9th of each month for the previous month\'s payroll. From 2026, the P10 data feeds directly into employees\' pre-filled annual returns.',
  },
]

const CATEGORIES = [...new Set(FAQS.map(f => f.category))]

export default function FAQPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5">
            <span className="text-blue-400 text-sm font-medium">❓ FAQ Library — 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Kenya PAYE Tax Questions — Answered</h1>
          <p className="text-stone-400 text-sm max-w-lg mx-auto">
            {FAQS.length} commonly asked questions about PAYE, SHIF, NSSF, Housing Levy, P9 forms, and iTax filing in Kenya for 2026.
          </p>
        </div>

        {/* Category navigation */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <a key={cat} href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:border-white/20 rounded-lg text-xs transition-colors">
              {cat}
            </a>
          ))}
        </div>

        {/* FAQ sections by category */}
        {CATEGORIES.map(cat => {
          const categoryFAQs = FAQS.filter(f => f.category === cat)
          const anchorId = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          return (
            <section key={cat} id={anchorId} className="mb-10 scroll-mt-20">
              <h2 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/10">{cat}</h2>
              <div className="space-y-3">
                {categoryFAQs.map((faq, i) => (
                  <details key={i} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <summary className="flex items-start justify-between gap-4 p-5 cursor-pointer list-none hover:bg-white/5 transition-colors">
                      <span className="text-sm font-medium text-stone-200 group-open:text-white">{faq.q}</span>
                      <span className="text-stone-500 group-open:rotate-180 transition-transform shrink-0 mt-0.5">▾</span>
                    </summary>
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <p className="text-stone-400 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA links */}
        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {[
            { href: '/',                label: 'PAYE Calculator',         desc: 'Calculate your exact take-home pay' },
            { href: '/p9-generator',    label: 'P9 Form Generator',       desc: 'Create your annual tax certificate' },
            { href: '/tax-calendar',    label: 'Tax Deadlines',           desc: 'All KRA filing dates for 2026' },
            { href: '/tax-relief',      label: 'Tax Relief Guide',        desc: 'How to reduce your PAYE legally' },
            { href: '/statutory-changes', label: 'SHIF & NSSF Changes',  desc: 'Full guide to 2026 rate changes' },
            { href: '/itax-2026',       label: 'iTax 2026 Guide',         desc: 'Pre-filled returns explained' },
          ].map(cta => (
            <Link key={cta.href} href={cta.href}
              className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-xl p-4 transition-all group">
              <div className="flex-1">
                <p className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">{cta.label}</p>
                <p className="text-stone-500 text-xs mt-0.5">{cta.desc}</p>
              </div>
              <span className="text-stone-600 group-hover:text-emerald-400 transition-colors">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

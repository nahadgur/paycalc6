import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// ── Salary amounts that get their own page ────────────────────────────────
const SALARY_AMOUNTS = [
  20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000,
  70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000,
  140000, 150000, 160000, 170000, 180000, 200000, 220000, 250000, 280000, 300000,
  350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000
]

// ── 2026 Tax constants ────────────────────────────────────────────────────
const TAX_BANDS = [
  { min: 0,      max: 24000,    rate: 0.10, label: '10%' },
  { min: 24000,  max: 32333,    rate: 0.25, label: '25%' },
  { min: 32333,  max: 500000,   rate: 0.30, label: '30%' },
  { min: 500000, max: 800000,   rate: 0.325,label: '32.5%' },
  { min: 800000, max: Infinity, rate: 0.35, label: '35%' },
]
const PERSONAL_RELIEF = 2400
const NSSF_RATE = 0.06
const NSSF_CAP  = 108000  // Feb 2026 NSSF Phase 4 upper limit; max employee NSSF 6% x 108,000 = 6,480
const SHIF_RATE = 0.0275
const SHIF_MIN  = 300
const HOUSING   = 0.015

function calcAll(gross: number) {
  const nssf    = Math.min(gross, NSSF_CAP) * NSSF_RATE
  const shif    = Math.max(gross * SHIF_RATE, SHIF_MIN)
  const housing = gross * HOUSING
  const taxable = Math.max(0, gross - nssf)

  let paye = 0, rem = taxable
  for (const b of TAX_BANDS) {
    if (rem <= 0) break
    const amt = Math.min(rem, b.max - b.min)
    paye += amt * b.rate
    rem  -= amt
  }
  paye = Math.max(0, paye - PERSONAL_RELIEF)

  const totalDeductions = paye + nssf + shif + housing
  const net             = gross - totalDeductions
  const effectiveTax    = (paye / gross) * 100
  const totalRate       = (totalDeductions / gross) * 100

  const bandBreakdown = TAX_BANDS.map(b => {
    const inBand = Math.max(0, Math.min(taxable - b.min, b.max - b.min))
    return { label: b.label, income: inBand, tax: inBand * b.rate }
  }).filter(b => b.income > 0)

  return {
    gross, nssf, shif, housing, taxable, paye,
    totalDeductions, net, effectiveTax, totalRate,
    bandBreakdown,
    employerNSSF: nssf,
    employerHousing: housing,
    totalEmployerCost: gross + nssf + housing,
  }
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

const fmtCompact = (n: number) => {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `KES ${(n / 1_000).toFixed(0)}K`
  return fmt(n)
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: { amount: string } }): Promise<Metadata> {
  const { amount } = params
  const gross = parseInt(amount, 10)
  if (!SALARY_AMOUNTS.includes(gross)) return { title: 'Salary Not Found' }
  const c = calcAll(gross)
  return {
    title: { absolute: `KES ${gross.toLocaleString()} Salary in Kenya 2026: Net Pay & Gross to Net` },
    description: `On a KES ${gross.toLocaleString()} gross salary in Kenya you take home ${fmt(c.net)} a month (${fmt(c.net * 12)} a year). PAYE tax ${fmt(c.paye)}, NSSF ${fmt(c.nssf)}, SHIF ${fmt(c.shif)}, Housing Levy ${fmt(c.housing)} — the full 2026 gross-to-net breakdown.`,
    alternates: { canonical: `https://payecalculator.co.ke/salary/${gross}` },
  }
}

// ── Static paths ───────────────────────────────────────────────────────────
export function generateStaticParams() {
  return SALARY_AMOUNTS.map(a => ({ amount: String(a) }))
}

// ── Nearby salaries for navigation ────────────────────────────────────────
function nearbyAmounts(current: number): number[] {
  const idx = SALARY_AMOUNTS.indexOf(current)
  const nearby: number[] = []
  if (idx > 0) nearby.push(SALARY_AMOUNTS[idx - 1])
  if (idx < SALARY_AMOUNTS.length - 1) nearby.push(SALARY_AMOUNTS[idx + 1])
  return nearby
}

// ── Budget split using 50/30/20 rule ──────────────────────────────────────
function budgetSplit(net: number) {
  return {
    needs:   net * 0.50,
    wants:   net * 0.30,
    savings: net * 0.20,
  }
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function SalaryPage({ params }: { params: { amount: string } }) {
  const { amount } = params
  const gross = parseInt(amount, 10)
  if (!SALARY_AMOUNTS.includes(gross)) notFound()

  const c      = calcAll(gross)
  const budget = budgetSplit(c.net)
  const nearby = nearbyAmounts(gross)

  const schemaFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the net salary for ${fmt(gross)} gross in Kenya 2026?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For a ${fmt(gross)} gross monthly salary in Kenya, the net take-home pay is ${fmt(c.net)} after PAYE tax (${fmt(c.paye)}), NSSF (${fmt(c.nssf)}), SHIF (${fmt(c.shif)}), and Housing Levy (${fmt(c.housing)}).`,
        },
      },
      {
        '@type': 'Question',
        name: `How much PAYE tax do I pay on ${fmt(gross)} salary in Kenya?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a ${fmt(gross)} gross monthly salary, PAYE tax is ${fmt(c.paye)} per month (${fmt(c.paye * 12)} per year). The effective tax rate is ${c.effectiveTax.toFixed(1)}%.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the total deductions on a ${fmt(gross)} salary in Kenya?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Total monthly deductions on a ${fmt(gross)} salary are ${fmt(c.totalDeductions)} — that is ${c.totalRate.toFixed(1)}% of gross pay. This includes PAYE, NSSF, SHIF, and the Affordable Housing Levy.`,
        },
      },
    ],
  }

  return (
    <div className="paye-calc-body min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />

      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="text-sm text-stone-500 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Calculator</Link>
          <span>›</span>
          <Link href="/salary/100000" className="hover:text-white transition-colors">Salary Breakdown</Link>
          <span>›</span>
          <span className="text-stone-300">{fmtCompact(gross)}</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
            <span className="bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent">
              {fmt(gross)}
            </span>
            {' '}Salary in Kenya
          </h1>
          <p className="text-stone-400 text-lg">
            Your take-home pay is <strong className="text-emerald-400">{fmt(c.net)}</strong> per month after all 2026 deductions
          </p>
          <p className="text-stone-500 text-sm mt-1">
            Effective tax rate: {c.effectiveTax.toFixed(1)}% · Total deductions: {c.totalRate.toFixed(1)}%
          </p>
        </div>

        {/* Direct answer — featured-snippet target for "X gross to net" / "how much tax on X". Explicit brand colours so it reads on any theme. */}
        <div className="rounded-2xl border border-brand-300 bg-brand-50 p-5 sm:p-6 mb-8">
          <p className="text-[15px] sm:text-[16px] text-[#222] leading-relaxed">
            The net (take-home) pay on a <strong>{fmt(gross)}</strong> gross salary in Kenya is{' '}
            <strong className="text-brand">{fmt(c.net)} per month</strong> ({fmt(c.net * 12)} per year), after PAYE tax of{' '}
            {fmt(c.paye)}, NSSF {fmt(c.nssf)}, SHIF {fmt(c.shif)} and the Housing Levy {fmt(c.housing)}. Total deductions are{' '}
            {fmt(c.totalDeductions)} ({c.totalRate.toFixed(1)}% of gross), at an effective PAYE rate of {c.effectiveTax.toFixed(1)}%.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-[13px]">
            {[
              { k: 'Gross salary', v: fmt(c.gross), strong: true },
              { k: 'PAYE tax', v: `− ${fmt(c.paye)}` },
              { k: 'NSSF', v: `− ${fmt(c.nssf)}` },
              { k: 'SHIF', v: `− ${fmt(c.shif)}` },
              { k: 'Housing Levy', v: `− ${fmt(c.housing)}` },
              { k: 'Net pay', v: fmt(c.net), strong: true },
            ].map((row) => (
              <div key={row.k} className="flex items-center justify-between border-b border-brand-300/40 pb-1.5">
                <span className="text-[#666]">{row.k}</span>
                <span className={row.strong ? 'font-bold text-brand' : 'text-[#222]'}>{row.v}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-[#888] mt-3">
            Need it the other way round?{' '}
            <Link href="/net-gross-calculator" className="text-brand hover:underline">Net to gross calculator</Link> ·{' '}
            <Link href="/" className="text-brand hover:underline">try another salary</Link>
          </p>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Net Salary',    value: c.net,             color: 'text-emerald-400', sub: `${(100 - c.totalRate).toFixed(1)}% of gross` },
            { label: 'PAYE Tax',      value: c.paye,            color: 'text-red-400',     sub: `${c.effectiveTax.toFixed(1)}% effective` },
            { label: 'Total Taken',   value: c.totalDeductions, color: 'text-amber-400',   sub: `${c.totalRate.toFixed(1)}% of gross` },
            { label: 'Annual Net',    value: c.net * 12,        color: 'text-blue-400',    sub: 'Before bonuses' },
          ].map(card => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-stone-400 text-xs mb-1">{card.label}</p>
              <p className={`text-xl font-black ${card.color}`}>{fmt(card.value)}</p>
              <p className="text-stone-600 text-xs mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Full breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-5">Complete Monthly Deduction Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Gross Salary',     value: c.gross,   color: 'text-white',       isGross: true, note: 'Your employer pays this' },
              { label: 'PAYE Tax',         value: -c.paye,   color: 'text-red-400',     note: `Effective rate ${c.effectiveTax.toFixed(1)}% · 2026 KRA bands` },
              { label: 'NSSF Pension',     value: -c.nssf,   color: 'text-blue-400',    note: '6% of pensionable pay (capped KES 108,000)' },
              { label: 'SHIF Health',      value: -c.shif,   color: 'text-purple-400',  note: '2.75% of gross (min KES 300)' },
              { label: 'Housing Levy',     value: -c.housing,color: 'text-amber-400',   note: '1.5% of gross salary' },
            ].map(row => (
              <div key={row.label} className={`flex items-center justify-between py-3 ${!row.isGross ? 'border-t border-white/5' : ''}`}>
                <div>
                  <span className="text-stone-300 text-sm font-medium">{row.label}</span>
                  {row.note && <p className="text-stone-500 text-xs mt-0.5">{row.note}</p>}
                </div>
                <span className={`font-bold ${row.color}`}>
                  {row.isGross ? fmt(row.value as number) : `−${fmt(Math.abs(row.value as number))}`}
                </span>
              </div>
            ))}
            <div className="border-t-2 border-emerald-500/30 pt-4 flex items-center justify-between">
              <div>
                <span className="text-white font-bold">Take-Home Pay</span>
                <p className="text-stone-500 text-xs mt-0.5">Net monthly salary</p>
              </div>
              <span className="text-emerald-400 text-2xl font-black">{fmt(c.net)}</span>
            </div>
          </div>
        </div>

        {/* Tax band breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">How PAYE is Calculated — Tax Band Breakdown</h2>
          <p className="text-stone-400 text-sm mb-5">
            Your taxable income is <strong className="text-white">{fmt(c.taxable)}</strong> (gross minus NSSF of {fmt(c.nssf)}).
            Kenya uses a progressive tax system — different portions are taxed at different rates.
          </p>
          <div className="space-y-3">
            {c.bandBreakdown.map(band => (
              <div key={band.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-stone-300">At {band.label}</span>
                  <div className="text-right">
                    <span className="text-stone-400">{fmt(band.income)} × {band.label} = </span>
                    <span className="text-red-400 font-semibold">{fmt(band.tax)}</span>
                  </div>
                </div>
                <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                    style={{ width: `${(band.income / c.taxable) * 100}%` }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-stone-400">Less: Personal Relief</span>
              <span className="text-emerald-400">−{fmt(PERSONAL_RELIEF)}/month</span>
            </div>
            <div className="flex justify-between font-bold pt-1">
              <span className="text-white">Net PAYE Tax</span>
              <span className="text-red-400">{fmt(c.paye)}</span>
            </div>
          </div>
        </div>

        {/* Annual summary */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-5">Annual Figures</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2 text-sm">
              <h3 className="text-xs font-semibold text-stone-600 mb-3">Employee (Annual)</h3>
              {[
                { label: 'Annual Gross',     value: c.gross * 12,            color: 'text-white' },
                { label: 'Annual PAYE',      value: c.paye * 12,             color: 'text-red-400' },
                { label: 'Annual NSSF',      value: c.nssf * 12,             color: 'text-blue-400' },
                { label: 'Annual SHIF',      value: c.shif * 12,             color: 'text-purple-400' },
                { label: 'Annual Housing',   value: c.housing * 12,          color: 'text-amber-400' },
                { label: 'Annual Net',       value: c.net * 12,              color: 'text-emerald-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-stone-400">{r.label}</span>
                  <span className={`font-semibold ${r.color}`}>{fmt(r.value)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <h3 className="text-xs font-semibold text-stone-600 mb-3">Employer Cost</h3>
              {[
                { label: 'Gross Salary',      value: c.gross,               color: 'text-white' },
                { label: 'Employer NSSF',     value: c.employerNSSF,        color: 'text-blue-400' },
                { label: 'Employer Housing',  value: c.employerHousing,     color: 'text-amber-400' },
                { label: 'Total Cost/Month',  value: c.totalEmployerCost,   color: 'text-emerald-400' },
                { label: 'Total Cost/Year',   value: c.totalEmployerCost * 12, color: 'text-emerald-400' },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-stone-400">{r.label}</span>
                  <span className={`font-semibold ${r.color}`}>{fmt(r.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget split */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Budgeting on {fmtCompact(gross)} — The 50/30/20 Rule</h2>
          <p className="text-stone-400 text-sm mb-5">
            Based on your net take-home of <strong className="text-emerald-400">{fmt(c.net)}</strong>/month, here is a recommended Kenyan budget split:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Needs (50%)', value: budget.needs, color: 'text-blue-400', desc: 'Rent, food, transport, utilities, SHIF top-ups' },
              { label: 'Wants (30%)', value: budget.wants, color: 'text-purple-400', desc: 'Dining out, entertainment, shopping, subscriptions' },
              { label: 'Savings (20%)', value: budget.savings, color: 'text-emerald-400', desc: 'Emergency fund, SACCO, investments, pension top-up' },
            ].map(cat => (
              <div key={cat.label} className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-stone-400 text-xs mb-1">{cat.label}</p>
                <p className={`text-xl font-black ${cat.color}`}>{fmt(cat.value)}</p>
                <p className="text-stone-500 text-xs mt-2 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: `What is the net salary for ${fmt(gross)} gross in Kenya 2026?`,
                a: `For a ${fmt(gross)} gross monthly salary, the net take-home pay is ${fmt(c.net)} per month after PAYE tax of ${fmt(c.paye)}, NSSF of ${fmt(c.nssf)}, SHIF of ${fmt(c.shif)}, and Housing Levy of ${fmt(c.housing)}.`,
              },
              {
                q: `How much PAYE tax do I pay on ${fmt(gross)} salary?`,
                a: `PAYE tax on a ${fmt(gross)} monthly salary is ${fmt(c.paye)} per month, or ${fmt(c.paye * 12)} per year. This gives an effective tax rate of ${c.effectiveTax.toFixed(1)}%. The taxable income (after NSSF) is ${fmt(c.taxable)}.`,
              },
              {
                q: `What is the total employer cost for a ${fmt(gross)} salary in Kenya?`,
                a: `The total cost to the employer for a ${fmt(gross)} gross salary employee is ${fmt(c.totalEmployerCost)} per month — ${fmt(c.employerNSSF + c.employerHousing)} above gross salary (employer NSSF ${fmt(c.employerNSSF)} + employer Housing Levy ${fmt(c.employerHousing)}).`,
              },
              {
                q: 'Can I reduce my PAYE tax on this salary?',
                a: `Yes. You can reduce PAYE by making pension contributions (reduces taxable income by up to KES 30,000/month), paying mortgage interest (up to KES 30,000/month deductible), or having life insurance premiums (15% relief, max KES 5,000/month). Use our full calculator to see the impact of these reliefs.`,
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="font-semibold text-white text-sm mb-2">{faq.q}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation to nearby salaries */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Compare with Other Salaries</h2>
          <div className="flex flex-wrap gap-3">
            {SALARY_AMOUNTS.filter(a => a !== gross).map(a => (
              <Link key={a} href={`/salary/${a}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  nearby.includes(a)
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                    : 'border-white/10 bg-white/5 text-stone-400 hover:border-white/20 hover:text-white'
                }`}>
                {fmtCompact(a)}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90">
            Try the Full Calculator with All Reliefs →
          </Link>
        </div>

      </div>
    </div>
  )
}

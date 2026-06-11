'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PiggyBank, Home, Coffee, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react'

const TAX_BANDS = [
  { min: 0,      max: 24000,    rate: 0.10 },
  { min: 24000,  max: 32333,    rate: 0.25 },
  { min: 32333,  max: 500000,   rate: 0.30 },
  { min: 500000, max: 800000,   rate: 0.325 },
  { min: 800000, max: Infinity, rate: 0.35 },
]
const PERSONAL_RELIEF = 2400

function calcNet(gross: number) {
  const nssf    = Math.min(gross, 72000) * 0.06
  const shif    = Math.max(gross * 0.0275, 300)
  const housing = gross * 0.015
  const taxable = Math.max(0, gross - nssf)
  let paye = 0, rem = taxable
  for (const b of TAX_BANDS) {
    if (rem <= 0) break
    const amt = Math.min(rem, b.max - b.min)
    paye += amt * b.rate
    rem  -= amt
  }
  paye = Math.max(0, paye - PERSONAL_RELIEF)
  return Math.round(gross - paye - nssf - shif - housing)
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n)

// Nairobi average costs (2026 estimates)
const NAIROBI_COSTS = {
  rent1bed:   25000,
  rent2bed:   40000,
  food:       12000,
  transport:   5000,
  utilities:   4000,
  internet:    3000,
  phone:       1500,
  gym:         3000,
  dining:      8000,
  entertainment: 5000,
  subscriptions: 2500,
  clothing:    5000,
}

type BudgetRule = {
  id: string
  name: string
  needs: number
  wants: number
  savings: number
  description: string
}

const BUDGET_RULES: BudgetRule[] = [
  { id: '50-30-20', name: '50/30/20 Rule', needs: 50, wants: 30, savings: 20, description: 'The classic budgeting framework. 50% on needs, 30% on wants, 20% saved.' },
  { id: '60-25-15', name: '60/25/15 Rule', needs: 60, wants: 25, savings: 15, description: 'Gemini-recommended for Kenya — accounts for Nairobi\'s high cost of living.' },
  { id: '70-20-10', name: '70/20/10 Rule', needs: 70, wants: 20, savings: 10, description: 'For lower incomes where basic costs dominate. Still saves 10%.' },
  { id: '40-30-30', name: '40/30/30 Rule', needs: 40, wants: 30, savings: 30, description: 'For higher earners who want to aggressively build wealth.' },
]

const QUICK_AMOUNTS = [40000, 60000, 75000, 100000, 150000, 200000]

export default function BudgetGuidePage() {
  const [gross,      setGross]      = useState(100000)
  const [rawInput,   setRawInput]   = useState('100000')
  const [ruleId,     setRuleId]     = useState('60-25-15')
  const [showNairobi, setShowNairobi] = useState(false)

  const net  = useMemo(() => calcNet(gross), [gross])
  const rule = BUDGET_RULES.find(r => r.id === ruleId) || BUDGET_RULES[1]

  const budget = {
    needs:   Math.round(net * rule.needs   / 100),
    wants:   Math.round(net * rule.wants   / 100),
    savings: Math.round(net * rule.savings / 100),
  }

  const pieData = [
    { name: 'Needs',   value: budget.needs,   color: '#3B82F6' },
    { name: 'Wants',   value: budget.wants,   color: '#8B5CF6' },
    { name: 'Savings', value: budget.savings,  color: '#10B981' },
  ]

  const NEEDS_ITEMS = [
    { label: 'Rent (1-bed Nairobi)', value: NAIROBI_COSTS.rent1bed, icon: '🏠' },
    { label: 'Food & groceries', value: NAIROBI_COSTS.food, icon: '🛒' },
    { label: 'Transport (matatu/fuel)', value: NAIROBI_COSTS.transport, icon: '🚌' },
    { label: 'Utilities (electricity/water)', value: NAIROBI_COSTS.utilities, icon: '💡' },
    { label: 'Internet & phone', value: NAIROBI_COSTS.internet + NAIROBI_COSTS.phone, icon: '📱' },
  ]
  const nairobiNeedsTotal = NEEDS_ITEMS.reduce((s, i) => s + i.value, 0)

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Budget Planner — Kenya 2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Kenyan Salary Budget Planner</h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
            Enter your gross salary — we calculate your take-home pay after all 2026 deductions, then split it using your chosen budget rule. See if your salary covers Nairobi living costs.
          </p>
        </div>

        {/* Salary input */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-stone-300 font-medium text-sm">Monthly Gross Salary</label>
            <span className="text-emerald-400 font-bold">{fmt(gross)}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-stone-500 text-sm">KES</span>
            <input type="number" value={rawInput} min={10000}
              onChange={e => { setRawInput(e.target.value); const n = Number(e.target.value); if (n >= 10000) setGross(n) }}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <input type="range" min={20000} max={1000000} step={5000} value={Math.min(gross, 1000000)}
            onChange={e => { const n = Number(e.target.value); setGross(n); setRawInput(String(n)) }}
            className="w-full accent-emerald-500 mb-3" />
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map(q => (
              <button key={q} onClick={() => { setGross(q); setRawInput(String(q)) }}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${gross === q ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}>
                {fmt(q)}
              </button>
            ))}
          </div>
        </div>

        {/* Take-home display */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-stone-400 text-xs mb-1">Gross</p>
            <p className="text-white font-bold text-sm">{fmt(gross)}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-stone-400 text-xs mb-1">Deductions</p>
            <p className="text-red-400 font-bold text-sm">{fmt(gross - net)}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-stone-400 text-xs mb-1">Take-Home</p>
            <p className="text-emerald-400 font-bold text-lg">{fmt(net)}</p>
          </div>
        </div>

        {/* Budget rule selector */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-white mb-4">Choose Your Budget Rule</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {BUDGET_RULES.map(r => (
              <button key={r.id} onClick={() => setRuleId(r.id)}
                className={`text-left p-4 rounded-xl border transition-all ${ruleId === r.id ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{r.name}</span>
                  {r.id === '60-25-15' && <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Recommended for Kenya</span>}
                </div>
                <p className="text-stone-500 text-xs">{r.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Budget breakdown */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Pie chart */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">{rule.name} — {fmt(net)} take-home</h3>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {[
                { label: `Needs (${rule.needs}%)`,   value: budget.needs,   color: 'bg-blue-500',   icon: Home },
                { label: `Wants (${rule.wants}%)`,   value: budget.wants,   color: 'bg-purple-500', icon: Coffee },
                { label: `Savings (${rule.savings}%)`,value: budget.savings, color: 'bg-emerald-500',icon: TrendingUp },
              ].map(cat => (
                <div key={cat.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${cat.color}`} />
                  <span className="text-stone-300 text-sm flex-1">{cat.label}</span>
                  <span className="font-bold text-white">{fmt(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget targets */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Monthly Budget Targets</h3>
            <div className="space-y-4">
              {[
                {
                  category: 'Needs',
                  amount: budget.needs,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/20',
                  icon: '🏠',
                  items: ['Rent / mortgage', 'Food & groceries', 'Utilities & internet', 'Transport', 'SHIF top-up & medical'],
                },
                {
                  category: 'Wants',
                  amount: budget.wants,
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/20',
                  icon: '☕',
                  items: ['Dining out & entertainment', 'Clothing & personal care', 'Streaming & subscriptions', 'Hobbies & gym', 'Travel & weekends'],
                },
                {
                  category: 'Savings',
                  amount: budget.savings,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/20',
                  icon: '💰',
                  items: ['Emergency fund (3–6 months expenses)', 'SACCO contributions', 'Investment account', 'Pension top-up', 'Mortgage down payment'],
                },
              ].map(cat => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-stone-300">{cat.icon} {cat.category}</span>
                    <span className={`font-bold ${cat.color}`}>{fmt(cat.amount)}/mo</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map(item => (
                      <span key={item} className={`text-xs px-2 py-0.5 rounded-full ${cat.bg} text-stone-400`}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nairobi cost check */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <span className="text-lg">📍</span>
              Can Your Salary Cover Nairobi? Reality Check
            </h2>
            <button onClick={() => setShowNairobi(!showNairobi)}
              className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              {showNairobi ? 'Hide' : 'Show'} breakdown
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Basic Nairobi needs (1-bed)', value: nairobiNeedsTotal, color: nairobiNeedsTotal <= budget.needs ? 'text-emerald-400' : 'text-red-400' },
              { label: 'Your needs budget', value: budget.needs, color: 'text-blue-400' },
              { label: 'Surplus / shortfall', value: budget.needs - nairobiNeedsTotal, color: budget.needs - nairobiNeedsTotal >= 0 ? 'text-emerald-400' : 'text-red-400' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-stone-500 text-xs mb-1">{item.label}</p>
                <p className={`font-bold ${item.color}`}>{item.value >= 0 ? fmt(item.value) : `−${fmt(Math.abs(item.value))}`}</p>
              </div>
            ))}
          </div>

          {budget.needs < nairobiNeedsTotal && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-stone-400">
                <span className="text-red-400 font-semibold">Tight budget: </span>
                Basic Nairobi costs exceed your {rule.needs}% needs allocation by {fmt(nairobiNeedsTotal - budget.needs)}/month.
                Consider a 2-bed with a flatmate to split costs, or areas further from CBD (Rongai, Kitengela, Ruiru) where rent is 30–50% lower.
              </p>
            </div>
          )}

          {showNairobi && (
            <div className="space-y-2">
              {NEEDS_ITEMS.map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">{item.icon} {item.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((item.value / budget.needs) * 100, 100)}%` }} />
                    </div>
                    <span className="text-stone-300 w-20 text-right">{fmt(item.value)}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2 font-bold">
                <span className="text-stone-300">Total basic needs</span>
                <span className="text-blue-400">{fmt(nairobiNeedsTotal)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Annual savings projection */}
        <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-white mb-4">Annual Savings Projection</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: '1 Year', value: budget.savings * 12,  sub: 'Emergency fund target' },
              { label: '5 Years', value: budget.savings * 60,  sub: 'With 8% SACCO returns → more' },
              { label: '10 Years', value: budget.savings * 120, sub: 'Before compound growth' },
            ].map(p => (
              <div key={p.label} className="text-center">
                <p className="text-stone-400 text-xs mb-1">{p.label}</p>
                <p className="text-emerald-400 font-black text-xl">{fmt(p.value)}</p>
                <p className="text-stone-600 text-xs mt-1">{p.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-stone-500 text-xs mt-4">
            Saving {fmt(budget.savings)}/month ({rule.savings}% of {fmt(net)} take-home) over 10 years = {fmt(budget.savings * 120)} before investment returns.
            At 10% annual return (Sacco/MMF), the 10-year value exceeds {fmt(budget.savings * 204)}.
          </p>
        </div>

        {/* Tips */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { icon: '💼', title: 'Increase take-home first', desc: 'Before budgeting harder, check if you are claiming all available tax reliefs — mortgage interest, pension top-up, and insurance can add KES 5,000–20,000 to your monthly take-home.' },
            { icon: '🏦', title: 'Automate savings', desc: 'Set up a standing order to your SACCO or MMF on payday — before you can spend it. \'Pay yourself first\' is the most reliable savings strategy in Kenya.' },
            { icon: '📊', title: 'Track for 30 days', desc: 'The 60/25/15 rule is a target, not reality on day one. Track your actual spending for one month first using M-Pesa statements, then identify where to adjust.' },
            { icon: '🎯', title: 'Wants are not waste', desc: 'Budgeting KES 25–30% for wants makes the plan sustainable. Cutting enjoyment entirely leads to abandoning the budget. Allow yourself treats within the envelope.' },
          ].map(tip => (
            <div key={tip.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <span className="text-xl">{tip.icon}</span>
              <h3 className="font-semibold text-white text-sm mt-2 mb-1">{tip.title}</h3>
              <p className="text-stone-400 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/tax-relief" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">
            Increase your take-home with tax reliefs <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/tax-relief" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">💰</span>
              <span className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">Tax Relief Guide</span>
              <span className="text-stone-500 text-xs">Increase take-home with reliefs</span>
            </Link>
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🧮</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">PAYE Calculator</span>
              <span className="text-stone-500 text-xs">Recalculate with any salary</span>
            </Link>
            <Link href="/salary/100000" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📊</span>
              <span className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">Salary Breakdowns</span>
              <span className="text-stone-500 text-xs">Detailed pages by salary level</span>
            </Link>
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar</span>
              <span className="text-stone-500 text-xs">Key dates to plan your finances</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Increase the money you're planning with</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/tax-relief" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">💰</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Relief Guide</p>
                <p className="text-stone-500 text-xs mt-0.5">Add KES 5,000–20,000/month to your take-home</p>
              </div>
            </Link>
            <Link href="/" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">🧮</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE Calculator</p>
                <p className="text-stone-500 text-xs mt-0.5">Calculate your exact net pay first</p>
              </div>
            </Link>
            <Link href="/salary/100000" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📊</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Salary Breakdown Pages</p>
                <p className="text-stone-500 text-xs mt-0.5">See full deductions for your specific salary</p>
              </div>
            </Link>
            <Link href="/statutory-changes" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📋</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">What Changed in 2026</p>
                <p className="text-stone-500 text-xs mt-0.5">Why your take-home may have shifted</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

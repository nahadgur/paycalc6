'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { FileText, Download, Printer, ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Info } from 'lucide-react'

// 2026 Tax constants
const TAX_BANDS = [
  { min: 0,      max: 24000,   rate: 0.10 },
  { min: 24000,  max: 32333,   rate: 0.25 },
  { min: 32333,  max: 500000,  rate: 0.30 },
  { min: 500000, max: 800000,  rate: 0.325 },
  { min: 800000, max: Infinity, rate: 0.35 },
]
const PERSONAL_RELIEF  = 2400
const NSSF_RATE        = 0.06
const NSSF_UPPER_LIMIT = 72000
const SHIF_RATE        = 0.0275
const SHIF_MIN         = 300
const HOUSING_LEVY     = 0.015

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

function calcPAYE(taxable: number): number {
  let tax = 0, rem = taxable
  for (const b of TAX_BANDS) {
    if (rem <= 0) break
    const amt = Math.min(rem, b.max - b.min)
    tax += amt * b.rate
    rem -= amt
  }
  return Math.max(0, tax - PERSONAL_RELIEF)
}

function calcMonth(gross: number, pension: number, insurance: number) {
  const nssf     = Math.min(gross, NSSF_UPPER_LIMIT) * NSSF_RATE
  const shif     = Math.max(gross * SHIF_RATE, SHIF_MIN)
  const housing  = gross * HOUSING_LEVY
  const pensionDeduction = Math.min(pension, 30000)
  const taxable  = Math.max(0, gross - nssf - pensionDeduction)
  const paye     = Math.max(0, calcPAYE(taxable) - Math.min(insurance * 0.15, 5000))
  const net      = gross - paye - nssf - shif - housing - pensionDeduction
  return { gross, nssf, shif, housing, paye, pension: pensionDeduction, insurance, taxable, net }
}

type MonthData = {
  gross: number
  pension: number
  insurance: number
}

const defaultMonth = (): MonthData => ({ gross: 100000, pension: 0, insurance: 0 })

export default function P9GeneratorPage() {
  const [employeeName,    setEmployeeName]    = useState('')
  const [employeePin,     setEmployeePin]     = useState('')
  const [employer,        setEmployer]        = useState('')
  const [employerPin,     setEmployerPin]     = useState('')
  const [taxYear,         setTaxYear]         = useState('2026')
  const [monthsData,      setMonthsData]      = useState<MonthData[]>(MONTHS.map(defaultMonth))
  const [showForm,        setShowForm]        = useState(true)
  const [showAdvanced,    setShowAdvanced]    = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const rows = useMemo(() => monthsData.map(m => calcMonth(m.gross, m.pension, m.insurance)), [monthsData])

  const totals = useMemo(() => ({
    gross:    rows.reduce((s, r) => s + r.gross, 0),
    nssf:     rows.reduce((s, r) => s + r.nssf, 0),
    shif:     rows.reduce((s, r) => s + r.shif, 0),
    housing:  rows.reduce((s, r) => s + r.housing, 0),
    paye:     rows.reduce((s, r) => s + r.paye, 0),
    pension:  rows.reduce((s, r) => s + r.pension, 0),
    taxable:  rows.reduce((s, r) => s + r.taxable, 0),
    net:      rows.reduce((s, r) => s + r.net, 0),
  }), [rows])

  function updateMonth(i: number, field: keyof MonthData, val: number) {
    setMonthsData(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }

  function fillAll(field: keyof MonthData, val: number) {
    setMonthsData(prev => prev.map(m => ({ ...m, [field]: val })))
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #p9-printable, #p9-printable * { visibility: visible; }
          #p9-printable { position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <Link href="/" className="no-print inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Calculator
        </Link>

        {/* Header */}
        <div className="no-print text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">P9 Form Generator — 2026 Tax Year</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Annual P9 Tax Deduction Certificate</h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
            Generate a P9 certificate for any employee. Enter monthly gross salary — all PAYE, NSSF, SHIF, and Housing Levy figures are computed automatically using 2026 KRA rates.
          </p>
        </div>

        {/* Employee details */}
        <div className="no-print bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Employee & Employer Details
            </h2>
            <button onClick={() => setShowForm(!showForm)} className="text-stone-500 hover:text-white">
              {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          {showForm && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Employee Name', val: employeeName, set: setEmployeeName, ph: 'Full name as per ID' },
                { label: 'Employee KRA PIN', val: employeePin, set: setEmployeePin, ph: 'A000000000A' },
                { label: 'Employer Name', val: employer, set: setEmployer, ph: 'Company name' },
                { label: 'Employer KRA PIN', val: employerPin, set: setEmployerPin, ph: 'P000000000A' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm text-stone-400 mb-1.5">{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                    className="w-full bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-stone-400 mb-1.5">Tax Year</label>
                <select value={taxYear} onChange={e => setTaxYear(e.target.value)}
                  className="w-full bg-stone-800/50 border border-stone-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
                  {['2024','2025','2026'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Quick-fill */}
        <div className="no-print bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-stone-400 font-medium">Quick-fill all months:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Gross:</span>
              <input type="number" placeholder="e.g. 120000"
                className="w-36 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                onChange={e => fillAll('gross', Number(e.target.value))} />
            </div>
            <button onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
              {showAdvanced ? '− Hide pension/insurance' : '+ Add pension/insurance reliefs'}
            </button>
            {showAdvanced && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Pension (monthly):</span>
                  <input type="number" placeholder="0"
                    className="w-28 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                    onChange={e => fillAll('pension', Number(e.target.value))} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">Insurance premium:</span>
                  <input type="number" placeholder="0"
                    className="w-28 bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                    onChange={e => fillAll('insurance', Number(e.target.value))} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Monthly input table */}
        <div className="no-print bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 overflow-x-auto">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Salary Entry</h3>
          <table className="w-full min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-2 text-stone-400">Month</th>
                <th className="text-right py-2 px-2 text-stone-400">Gross (KES)</th>
                {showAdvanced && <>
                  <th className="text-right py-2 px-2 text-stone-400">Pension</th>
                  <th className="text-right py-2 px-2 text-stone-400">Insurance</th>
                </>}
                <th className="text-right py-2 px-2 text-stone-400">PAYE</th>
                <th className="text-right py-2 px-2 text-stone-400">NSSF</th>
                <th className="text-right py-2 px-2 text-stone-400">SHIF</th>
                <th className="text-right py-2 px-2 text-stone-400">Housing</th>
                <th className="text-right py-2 px-2 text-stone-400">Net</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((month, i) => {
                const r = rows[i]
                return (
                  <tr key={month} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-1.5 px-2 text-stone-300 font-medium">{month}</td>
                    <td className="py-1.5 px-2 text-right">
                      <input type="number" value={monthsData[i].gross}
                        onChange={e => updateMonth(i, 'gross', Number(e.target.value))}
                        className="w-28 text-right bg-stone-800 border border-stone-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-500" />
                    </td>
                    {showAdvanced && <>
                      <td className="py-1.5 px-2 text-right">
                        <input type="number" value={monthsData[i].pension}
                          onChange={e => updateMonth(i, 'pension', Number(e.target.value))}
                          className="w-20 text-right bg-stone-800 border border-stone-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-500" />
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <input type="number" value={monthsData[i].insurance}
                          onChange={e => updateMonth(i, 'insurance', Number(e.target.value))}
                          className="w-20 text-right bg-stone-800 border border-stone-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-amber-500" />
                      </td>
                    </>}
                    <td className="py-1.5 px-2 text-right text-red-400">{fmt(r.paye)}</td>
                    <td className="py-1.5 px-2 text-right text-blue-400">{fmt(r.nssf)}</td>
                    <td className="py-1.5 px-2 text-right text-purple-400">{fmt(r.shif)}</td>
                    <td className="py-1.5 px-2 text-right text-amber-400">{fmt(r.housing)}</td>
                    <td className="py-1.5 px-2 text-right text-emerald-400 font-semibold">{fmt(r.net)}</td>
                  </tr>
                )
              })}
              <tr className="border-t-2 border-white/20 bg-white/5 font-bold">
                <td className="py-2 px-2 text-white">TOTAL</td>
                <td className="py-2 px-2 text-right text-white">{fmt(totals.gross)}</td>
                {showAdvanced && <>
                  <td className="py-2 px-2 text-right text-white">{fmt(totals.pension)}</td>
                  <td className="py-2 px-2 text-right text-white">—</td>
                </>}
                <td className="py-2 px-2 text-right text-red-400">{fmt(totals.paye)}</td>
                <td className="py-2 px-2 text-right text-blue-400">{fmt(totals.nssf)}</td>
                <td className="py-2 px-2 text-right text-purple-400">{fmt(totals.shif)}</td>
                <td className="py-2 px-2 text-right text-amber-400">{fmt(totals.housing)}</td>
                <td className="py-2 px-2 text-right text-emerald-400">{fmt(totals.net)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="no-print flex flex-wrap gap-3 mb-10">
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl text-sm transition-all hover:opacity-90">
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          <div className="flex items-start gap-2 text-xs text-stone-500 items-center">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Use your browser&apos;s Print → Save as PDF to download
          </div>
        </div>

        {/* ── PRINTABLE P9 FORM ── */}
        <div id="p9-printable" ref={printRef}
          className="bg-white text-black rounded-2xl p-8 border border-stone-700 no-print-border">
          {/* KRA Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-xl font-black uppercase tracking-widest">Kenya Revenue Authority</h1>
            <h2 className="text-base font-bold mt-1">P9 TAX DEDUCTION CARD</h2>
            <p className="text-sm mt-0.5">Employee&apos;s Certificate of Pay and Tax Deducted</p>
            <p className="text-sm font-semibold">Year of Income: {taxYear}</p>
          </div>

          {/* Employee / Employer details */}
          <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
            <div className="space-y-2">
              <div><span className="font-semibold">Employee Name:</span> <span className="border-b border-gray-400 inline-block min-w-[200px] pb-0.5">{employeeName || '________________________________'}</span></div>
              <div><span className="font-semibold">Employee PIN:</span> <span className="border-b border-gray-400 inline-block min-w-[140px] pb-0.5 font-mono">{employeePin || '_______________'}</span></div>
              <div><span className="font-semibold">Employer Name:</span> <span className="border-b border-gray-400 inline-block min-w-[200px] pb-0.5">{employer || '________________________________'}</span></div>
              <div><span className="font-semibold">Employer PIN:</span> <span className="border-b border-gray-400 inline-block min-w-[140px] pb-0.5 font-mono">{employerPin || '_______________'}</span></div>
            </div>
            <div className="space-y-2">
              <div><span className="font-semibold">Personal Relief:</span> KES 2,400 per month</div>
              <div><span className="font-semibold">NSSF Rate:</span> 6% (max pensionable KES 72,000)</div>
              <div><span className="font-semibold">SHIF Rate:</span> 2.75% (min KES 300)</div>
              <div><span className="font-semibold">Housing Levy:</span> 1.5% of gross</div>
            </div>
          </div>

          {/* Main P9 Table */}
          <table className="w-full text-xs border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-2 py-1.5 text-left">Month</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">Gross Pay (A)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">NSSF Employee (B)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">Pension Relief (C)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">Taxable Pay (D)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">PAYE Tax (E)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">SHIF (F)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">Housing Levy (G)</th>
                <th className="border border-gray-400 px-2 py-1.5 text-right">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {MONTHS.map((month, i) => {
                const r = rows[i]
                return (
                  <tr key={month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-2 py-1 font-medium">{month}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{fmt(r.gross)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{fmt(r.nssf)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{fmt(r.pension)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{fmt(r.taxable)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right font-semibold">{fmt(r.paye)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{fmt(r.shif)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right">{fmt(r.housing)}</td>
                    <td className="border border-gray-300 px-2 py-1 text-right font-semibold">{fmt(r.net)}</td>
                  </tr>
                )
              })}
              <tr className="bg-gray-200 font-bold">
                <td className="border border-gray-400 px-2 py-1.5">TOTAL</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.gross)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.nssf)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.pension)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.taxable)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.paye)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.shif)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.housing)}</td>
                <td className="border border-gray-400 px-2 py-1.5 text-right">{fmt(totals.net)}</td>
              </tr>
            </tbody>
          </table>

          {/* Annual summary box */}
          <div className="border-2 border-black p-4 mb-6">
            <h3 className="font-black text-sm uppercase mb-3">Annual Summary — For iTax Filing</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="font-semibold">Total Gross Pay (A):</span><span className="font-mono">KES {fmt(totals.gross)}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Total PAYE Deducted (E):</span><span className="font-mono">KES {fmt(totals.paye)}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Total NSSF (B):</span><span className="font-mono">KES {fmt(totals.nssf)}</span></div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between"><span className="font-semibold">Total SHIF (F):</span><span className="font-mono">KES {fmt(totals.shif)}</span></div>
                <div className="flex justify-between"><span className="font-semibold">Total Housing Levy (G):</span><span className="font-mono">KES {fmt(totals.housing)}</span></div>
                <div className="flex justify-between border-t border-black pt-1.5 mt-1.5"><span className="font-bold">Total Net Pay:</span><span className="font-mono font-bold">KES {fmt(totals.net)}</span></div>
              </div>
            </div>
          </div>

          {/* Certification */}
          <div className="text-xs text-gray-600 border-t border-gray-300 pt-4">
            <p className="mb-4">I hereby certify that the above particulars are correct as per payroll records maintained by the employer.</p>
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div>
                <div className="border-b border-black mb-1 h-8"></div>
                <p className="font-semibold">Authorised Signatory / Employer</p>
                <p className="text-gray-500">Name, Designation & Date</p>
              </div>
              <div>
                <div className="border-b border-black mb-1 h-8"></div>
                <p className="font-semibold">Employer Stamp / Company Seal</p>
              </div>
            </div>
            <p className="mt-4 text-gray-500 text-center">
              Generated by payecalculator.co.ke • Tax Year {taxYear} • Based on 2026 KRA rates • Verify at itax.kra.go.ke
            </p>
          </div>
        </div>

        {/* Info section */}
        <div className="no-print mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: '📋', title: 'What is a P9?', desc: 'A P9 is an annual tax deduction certificate that employers must issue to all employees by 28 February each year. It summarises gross pay, PAYE deducted, and all statutory deductions for the full year.' },
            { icon: '📅', title: 'When is it needed?', desc: 'P9 forms are required for KRA iTax filing (June 30 deadline), bank loan applications, mortgage applications, and government job applications. Employees are entitled to it by law.' },
            { icon: '⚠️', title: 'Disclaimer', desc: 'This generator provides estimates based on standard 2026 KRA rates. Always verify figures with your official payroll system. Consult a certified accountant for complex situations including benefits in kind.' },
          ].map(card => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-white text-sm mb-2">{card.title}</h3>
              <p className="text-stone-400 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

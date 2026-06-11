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
            </p>
          </div>
        </div>

        {/* What is a P9 */}
        <section className="no-print mt-14">
          <h2 className="text-2xl font-bold text-white mb-4">What Is a P9 Form?</h2>
          <p className="text-stone-400 leading-relaxed mb-4">
            A P9 Tax Deduction Card is an official annual certificate that every Kenyan employer must issue to each employee. It summarises the entire year&apos;s payroll data in one document: monthly gross pay, PAYE tax deducted each month, NSSF contributions, SHIF deductions, Housing Levy, and any tax reliefs applied. It is the employee&apos;s proof that their employer deducted and remitted the correct statutory amounts to KRA.
          </p>
          <p className="text-stone-400 leading-relaxed mb-4">
            The P9 is not optional. Under the <strong className="text-white">Income Tax Act Cap 470</strong>, employers are legally required to issue P9 forms to all employees by <strong className="text-white">31 January</strong> each year covering the previous tax year. Failure to issue a P9 on time is a violation of Kenyan tax law and can be reported to KRA.
          </p>
        </section>

        {/* When you need it */}
        <section className="no-print mt-10">
          <h2 className="text-2xl font-bold text-white mb-5">When You Need a P9 Form</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🧾', title: 'Annual iTax Return Filing', desc: 'Every Kenyan with a KRA PIN must file an annual income tax return by 30 June. Your P9 provides the gross pay and PAYE figures you declare. Without it, filing accurately is nearly impossible.' },
              { icon: '🏠', title: 'Mortgage Applications', desc: 'Banks and building societies routinely request P9 forms from the last 1–3 years as proof of income and tax compliance. A missing P9 can delay or block a mortgage application.' },
              { icon: '🏦', title: 'Bank Loans & Credit', desc: 'Personal loan applications, especially for amounts above KES 500,000, often require P9 forms alongside bank statements. The P9 confirms your net income more reliably than payslips alone.' },
              { icon: '💼', title: 'Government Job Applications', desc: 'Public service and county government job applications frequently require P9 certificates as part of the compliance documentation. Some private sector employers also request them.' },
              { icon: '🎓', title: 'HELB Applications', desc: 'The Higher Education Loans Board requires P9 forms when processing loan applications from employed individuals or when assessing repayment obligations.' },
              { icon: '🛂', title: 'Visa Applications', desc: 'Some embassies — particularly for UK, US, and Schengen applications — request P9 forms to verify declared income when assessing financial sufficiency for travel visas.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to use this tool */}
        <section className="no-print mt-10">
          <h2 className="text-2xl font-bold text-white mb-5">How to Use This P9 Generator</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            {[
              { step: '1', title: 'Enter employee and employer details', desc: 'Fill in the employee\'s full name and KRA PIN, and your company\'s name and PIN. These appear on the printed certificate and must match official KRA records exactly.' },
              { step: '2', title: 'Select the tax year', desc: 'Choose the tax year you are generating the P9 for. For the annual return due June 2026, select "2025" (covering January–December 2025). For returns filed in early 2026 about 2025 income, select 2025.' },
              { step: '3', title: 'Quick-fill or enter monthly salaries', desc: 'Use the quick-fill bar to set the same gross salary for all 12 months at once — ideal for employees on a fixed monthly salary. For employees with variable pay, click each month\'s input and enter the specific amount. Toggle "pension/insurance reliefs" if the employee benefits from additional deductions.' },
              { step: '4', title: 'Review the auto-calculated figures', desc: 'PAYE, NSSF, SHIF, and Housing Levy are calculated automatically using 2026 KRA rates. Review the monthly figures and annual totals in the table below the input section. Check that the figures are reasonable by comparing to the employee\'s payslips.' },
              { step: '5', title: 'Print or save as PDF', desc: 'Click "Print / Save as PDF" to open your browser\'s print dialogue. Select "Save as PDF" as the destination (available in Chrome, Edge, and Safari). The printable P9 form appears automatically — your input section and this guide are excluded from the print output.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 text-white rounded-full text-sm font-bold flex items-center justify-center shrink-0">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2026 Rates reference */}
        <section className="no-print mt-10">
          <h2 className="text-2xl font-bold text-white mb-5">2026 Statutory Rates Used in This Generator</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-3">Deduction Rates</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'NSSF', rate: '6% of pensionable pay (capped at KES 72,000)', color: 'text-blue-400' },
                  { label: 'SHIF', rate: '2.75% of gross salary (min KES 300/month)', color: 'text-purple-400' },
                  { label: 'Housing Levy', rate: '1.5% of gross salary', color: 'text-amber-400' },
                  { label: 'Personal Relief', rate: 'KES 2,400 per month (automatic)', color: 'text-emerald-400' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-stone-400">{r.label}</span>
                    <span className={`${r.color} text-xs text-right max-w-[55%]`}>{r.rate}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-3">2026 PAYE Tax Bands</h3>
              <div className="space-y-1.5 text-xs">
                {[
                  { band: 'KES 0 – 24,000/month', rate: '10%' },
                  { band: 'KES 24,001 – 32,333/month', rate: '25%' },
                  { band: 'KES 32,334 – 500,000/month', rate: '30%' },
                  { band: 'KES 500,001 – 800,000/month', rate: '32.5%' },
                  { band: 'Above KES 800,000/month', rate: '35%' },
                ].map(b => (
                  <div key={b.band} className="flex justify-between">
                    <span className="text-stone-400">{b.band}</span>
                    <span className="text-white font-semibold">{b.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="no-print mt-10 mb-4">
          <h2 className="text-2xl font-bold text-white mb-5">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'My employer has not given me a P9 — what can I do?', a: 'Employers are legally required to issue P9 forms by 31 January each year. Write to your HR department formally requesting the P9. If they refuse or ignore the request, report the employer to KRA at 0800 722 226 or via itax.kra.go.ke. You can also use this generator to create an estimated P9 based on your payslips and file your iTax return — noting that the figures are estimates pending the official P9.' },
              { q: 'Can I use this P9 form for my iTax return?', a: 'Yes — you can use the figures generated here to file your annual iTax return. The calculations are based on standard 2026 KRA rates. However, if your employer applies non-standard reliefs, benefits in kind, or has a different salary structure, the figures may differ from your official payroll. Always cross-check against your payslips.' },
              { q: 'Does the P9 cover pension and insurance reliefs?', a: 'Yes — toggle the "Add pension/insurance reliefs" option in the quick-fill bar to enter monthly pension contribution and insurance premium amounts. The generator will apply the correct tax relief calculations: pension contributions reduce taxable income (up to KES 30,000/month) and insurance premiums generate a 15% tax credit (up to KES 5,000/month).' },
              { q: 'What if the employee had different salaries each month?', a: 'Enter each month individually in the monthly salary table. Click on any month\'s gross salary input and type the correct amount. The generator recalculates that month\'s deductions instantly. This is useful for employees who received increments, bonuses, or had unpaid leave during the year.' },
              { q: 'Is this P9 accepted by banks and embassies?', a: 'This generator creates a standard P9 format following KRA requirements. For bank and mortgage applications, banks typically want the P9 to carry the employer\'s official stamp and authorised signature — which you add after printing. The generator creates the form content; the employer\'s stamp and signature make it official.' },
            ].map((faq, i) => (
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

        {/* Related guides */}
        <section className="no-print mt-10 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Related tools and guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { href: '/tax-calendar',   icon: '📅', label: 'KRA Tax Calendar',        desc: 'P9 due January 31 — see all 2026 deadlines' },
              { href: '/itax-2026',      icon: '💻', label: 'iTax 2026 Filing Guide',  desc: 'How to use your P9 to file your annual return' },
              { href: '/tax-relief',     icon: '💰', label: 'Tax Relief Guide',         desc: 'Check what reliefs should appear on your P9' },
              { href: '/employer-guide', icon: '🏢', label: 'Employer Compliance',      desc: 'P10 filing obligations and payroll deadlines' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">{item.label}</p>
                  <p className="text-stone-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <p className="no-print text-xs text-stone-600 text-center mt-6 mb-4">
          Calculations are based on 2026 KRA statutory rates. For complex payroll situations including benefits in kind, car allowances, or non-standard reliefs, verify with a certified accountant or your official payroll system.
        </p>

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar</span>
              <span className="text-stone-500 text-xs">P9 deadline: January 31</span>
            </Link>
            <Link href="/itax-2026" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🖥️</span>
              <span className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">KRA iTax 2026</span>
              <span className="text-stone-500 text-xs">Use your P9 to file online</span>
            </Link>
            <Link href="/" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🧮</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">PAYE Calculator</span>
              <span className="text-stone-500 text-xs">Verify the figures first</span>
            </Link>
            <Link href="/employer-guide" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-purple-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🏢</span>
              <span className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">Employer Guide</span>
              <span className="text-stone-500 text-xs">Employer P9 obligations</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">FAQ</span>
              <span className="text-stone-500 text-xs">P9 questions answered</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

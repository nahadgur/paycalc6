'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Download, Lock, CheckCircle2 } from 'lucide-react'
import LeadGate from './LeadGate'

// 2026 Kenya statutory constants
const TAX_BANDS = [
  { min: 0, max: 24000, rate: 0.1 },
  { min: 24000, max: 32333, rate: 0.25 },
  { min: 32333, max: 500000, rate: 0.3 },
  { min: 500000, max: 800000, rate: 0.325 },
  { min: 800000, max: Infinity, rate: 0.35 },
]
const PERSONAL_RELIEF = 2400
const NSSF_RATE = 0.06
const NSSF_CAP = 108000
const SHIF_RATE = 0.0275
const SHIF_MIN = 300
const HOUSING = 0.015

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const fmt = (n: number) =>
  new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(0, n))

function calcPayslip(basic: number, allowances: number, helb: number, sacco: number) {
  const gross = basic + allowances
  const nssf = Math.min(gross, NSSF_CAP) * NSSF_RATE
  const shif = Math.max(gross * SHIF_RATE, SHIF_MIN)
  const housing = gross * HOUSING
  const taxable = Math.max(0, gross - nssf)

  let paye = 0
  let rem = taxable
  for (const b of TAX_BANDS) {
    if (rem <= 0) break
    const amt = Math.min(rem, b.max - b.min)
    paye += amt * b.rate
    rem -= amt
  }
  paye = Math.max(0, paye - PERSONAL_RELIEF)

  const totalDeductions = paye + nssf + shif + housing + helb + sacco
  const net = gross - totalDeductions
  return { gross, nssf, shif, housing, paye, taxable, helb, sacco, totalDeductions, net }
}

type Calc = ReturnType<typeof calcPayslip>

// The printable payslip. Rendered once on screen (preview) and once portaled to
// <body> (.print-sheet) as the print target. Explicit black/white so it prints
// correctly on any theme.
function PayslipSheet({
  employer, employee, kraPin, period, basic, allowances, c,
}: {
  employer: string
  employee: string
  kraPin: string
  period: string
  basic: number
  allowances: number
  c: Calc
}) {
  // Force background colours to print (browsers strip them by default).
  const printColor: React.CSSProperties = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }
  const sectionLabel: React.CSSProperties = { fontSize: '11px', fontWeight: 700, color: '#F04C40', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }
  const Row = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontWeight: strong ? 700 : 400 }}>
      <span style={{ color: strong ? '#111' : '#555' }}>{label}</span>
      <span style={{ color: '#111' }}>{value}</span>
    </div>
  )
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>
      {/* Wordmark letterhead + accent bar */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F04C40' }}>
          PAYE Calculator Kenya
        </div>
      </div>
      <div style={{ height: '3px', background: '#F04C40', borderRadius: '2px', marginBottom: '22px', ...printColor }} />

      {/* Employer + PAYSLIP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>{employer || 'Employer name'}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Pay period: {period}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', color: '#aaa', textTransform: 'uppercase' }}>Payslip</div>
          <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>payecalculator.co.ke</div>
        </div>
      </div>

      {/* Employee / KRA PIN — only when provided */}
      {(employee || kraPin) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '11px 14px', background: '#fafafa', borderRadius: '8px', marginBottom: '16px', ...printColor }}>
          <div><span style={{ color: '#888' }}>Employee&nbsp;&nbsp;</span><span style={{ fontWeight: 600 }}>{employee || '—'}</span></div>
          <div><span style={{ color: '#888' }}>KRA PIN&nbsp;&nbsp;</span><span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{kraPin || '—'}</span></div>
        </div>
      )}

      {/* Earnings card */}
      <div style={{ background: '#FFF5F2', border: '1px solid #FFD9D3', borderRadius: '10px', padding: '14px 16px', marginBottom: '12px', ...printColor }}>
        <div style={sectionLabel}>Earnings</div>
        <Row label="Basic salary" value={fmt(basic)} />
        {allowances > 0 && <Row label="Allowances" value={fmt(allowances)} />}
        <div style={{ borderTop: '1px solid #FFD9D3', margin: '3px 0' }} />
        <Row label="Gross pay" value={fmt(c.gross)} strong />
      </div>

      {/* Deductions card */}
      <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', ...printColor }}>
        <div style={sectionLabel}>Deductions</div>
        <Row label="PAYE (income tax)" value={`− ${fmt(c.paye)}`} />
        <Row label="NSSF" value={`− ${fmt(c.nssf)}`} />
        <Row label="SHIF" value={`− ${fmt(c.shif)}`} />
        <Row label="Housing Levy" value={`− ${fmt(c.housing)}`} />
        {c.helb > 0 && <Row label="HELB" value={`− ${fmt(c.helb)}`} />}
        {c.sacco > 0 && <Row label="SACCO" value={`− ${fmt(c.sacco)}`} />}
        <div style={{ borderTop: '1px solid #eee', margin: '3px 0' }} />
        <Row label="Total deductions" value={`− ${fmt(c.totalDeductions)}`} strong />
      </div>

      {/* Net pay — filled brand box (the hero) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F04C40', color: '#fff', borderRadius: '10px', padding: '16px 20px', ...printColor }}>
        <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Net pay (take-home)</span>
        <span style={{ fontWeight: 800, fontSize: '21px' }}>KES {fmt(c.net)}</span>
      </div>

      {/* Footer */}
      <p style={{ fontSize: '10.5px', color: '#999', marginTop: '18px', lineHeight: 1.5 }}>
        Generated on payecalculator.co.ke using 2026 KRA tax bands, NSSF (max KES 6,480), SHIF (2.75%) and the Housing Levy (1.5%). This is an estimate, not an official payslip; figures depend on your exact payroll setup.
      </p>
      <div style={{ height: '2px', background: '#FFD9D3', borderRadius: '2px', marginTop: '10px', ...printColor }} />
    </div>
  )
}

const input = 'w-full bg-white border border-[#e5e5e5] rounded-lg px-3 py-2.5 text-[#111] text-sm focus:outline-none focus:border-brand'
const label = 'block text-[12px] font-medium text-[#666] mb-1.5'

export default function PayslipGenerator() {
  const [employer, setEmployer] = useState('')
  const [employee, setEmployee] = useState('')
  const [kraPin, setKraPin] = useState('')
  const [month, setMonth] = useState(0)
  const [year, setYear] = useState('2026')
  const [basic, setBasic] = useState(100000)
  const [allowances, setAllowances] = useState(0)
  const [helb, setHelb] = useState(0)
  const [sacco, setSacco] = useState(0)

  const [unlocked, setUnlocked] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const c = useMemo(() => calcPayslip(basic, allowances, helb, sacco), [basic, allowances, helb, sacco])
  const period = `${MONTHS[month]} ${year}`

  function onDownload() {
    if (unlocked) {
      window.print()
      return
    }
    setGateOpen(true)
  }

  function onUnlocked() {
    setUnlocked(true)
    setGateOpen(false)
    setTimeout(() => window.print(), 350)
  }

  return (
    <main className="paye-calc-body bg-white px-4 sm:px-6 pt-8 pb-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6">

        {/* ── Inputs ── */}
        <div className="bg-brand-50 border border-brand-300 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#111]">Payslip details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Employer / company</label>
              <input className={input} value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder="Company name" />
            </div>
            <div>
              <label className={label}>Employee name</label>
              <input className={input} value={employee} onChange={(e) => setEmployee(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className={label}>KRA PIN (optional)</label>
              <input className={input} value={kraPin} onChange={(e) => setKraPin(e.target.value)} placeholder="A000000000A" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={label}>Month</label>
                <select className={input} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Year</label>
                <select className={input} value={year} onChange={(e) => setYear(e.target.value)}>
                  {['2024', '2025', '2026'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-300/60 pt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Basic salary (KES)</label>
              <input type="number" className={input} value={basic} onChange={(e) => setBasic(Number(e.target.value))} />
            </div>
            <div>
              <label className={label}>Allowances (taxable)</label>
              <input type="number" className={input} value={allowances} onChange={(e) => setAllowances(Number(e.target.value))} />
            </div>
            <div>
              <label className={label}>HELB (optional)</label>
              <input type="number" className={input} value={helb} onChange={(e) => setHelb(Number(e.target.value))} />
            </div>
            <div>
              <label className={label}>SACCO (optional)</label>
              <input type="number" className={input} value={sacco} onChange={(e) => setSacco(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="space-y-4">
          <div className="bg-white border border-[#eee] rounded-2xl p-5 sm:p-6 shadow-sm">
            <PayslipSheet employer={employer} employee={employee} kraPin={kraPin} period={period} basic={basic} allowances={allowances} c={c} />
          </div>
          <button
            onClick={onDownload}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            {unlocked ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {unlocked ? 'Download payslip (PDF)' : 'Download payslip (PDF) — free'}
          </button>
          {unlocked && (
            <p className="text-center text-[12px] text-emerald-600 inline-flex items-center justify-center gap-1.5 w-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked. Use “Save as PDF” in the print dialog.
            </p>
          )}
        </div>
      </div>

      {/* ── Lead gate ── */}
      {gateOpen && (
        <LeadGate
          source="payslip-generator"
          notes={`Gross KES ${c.gross.toFixed(0)} · ${period}`}
          onSuccess={onUnlocked}
          onClose={() => setGateOpen(false)}
        />
      )}

      {/* ── Portaled print copy (single page) ── */}
      {mounted && createPortal(
        <div className="print-sheet payslip-print">
          <PayslipSheet employer={employer} employee={employee} kraPin={kraPin} period={period} basic={basic} allowances={allowances} c={c} />
        </div>,
        document.body
      )}
    </main>
  )
}

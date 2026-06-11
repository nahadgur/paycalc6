'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Download, Lock, CheckCircle2 } from 'lucide-react'

// Lead webhook — fleet rule: hardcoded const, never an env var.
const LEAD_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbyQi9LT5L_eZyAP1AlyFgi2BfeDZjKLivvzGbWtoip-h327MmVII4IWILLhUcHtJkkhEA/exec'

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
  const Row = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontWeight: strong ? 700 : 400 }}>
      <span style={{ color: strong ? '#111' : '#444' }}>{label}</span>
      <span>{value}</span>
    </div>
  )
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', color: '#111', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}>
      {/* Wordmark letterhead */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#F04C40' }}>
          PAYE Calculator Kenya
        </div>
      </div>

      {/* Employer + pay period */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #F04C40', paddingBottom: '12px', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.2 }}>{employer || 'Employer name'}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>Payslip for {period}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#999', textAlign: 'right' }}>
          payecalculator.co.ke<br />2026 KRA rates
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '13px' }}>
        <div>
          <div style={{ color: '#666' }}>Employee</div>
          <div style={{ fontWeight: 600 }}>{employee || '—'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#666' }}>KRA PIN</div>
          <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{kraPin || '—'}</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#F04C40', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Earnings</div>
        <Row label="Basic salary" value={fmt(basic)} />
        {allowances > 0 && <Row label="Allowances" value={fmt(allowances)} />}
        <Row label="Gross pay" value={fmt(c.gross)} strong />
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#F04C40', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>Deductions</div>
        <Row label="PAYE (income tax)" value={`− ${fmt(c.paye)}`} />
        <Row label="NSSF" value={`− ${fmt(c.nssf)}`} />
        <Row label="SHIF" value={`− ${fmt(c.shif)}`} />
        <Row label="Housing Levy" value={`− ${fmt(c.housing)}`} />
        {c.helb > 0 && <Row label="HELB" value={`− ${fmt(c.helb)}`} />}
        {c.sacco > 0 && <Row label="SACCO" value={`− ${fmt(c.sacco)}`} />}
        <Row label="Total deductions" value={`− ${fmt(c.totalDeductions)}`} strong />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #111', marginTop: '12px', paddingTop: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>Net pay (take-home)</span>
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#F04C40' }}>KES {fmt(c.net)}</span>
      </div>

      <p style={{ fontSize: '11px', color: '#888', marginTop: '18px' }}>
        Estimate generated on payecalculator.co.ke using 2026 KRA tax bands, NSSF (max KES 6,480), SHIF (2.75%) and the Housing Levy (1.5%). Not an official payslip; figures depend on your exact payroll setup.
      </p>
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
  const [lead, setLead] = useState({ name: '', email: '', phone: '', consent: false })
  const [submitting, setSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Default the pay period to a stable value; avoids new Date() on the server.
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

  async function submitGate(e: React.FormEvent) {
    e.preventDefault()
    if (!lead.name.trim() || !lead.email.trim() || !lead.phone.trim() || !lead.consent) return
    setSubmitting(true)
    try {
      // no-cors + text/plain so the request is "simple" and reaches Apps Script
      // (which JSON.parses the body). Response is opaque; we proceed regardless.
      await fetch(LEAD_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          consent: 'yes',
          source: 'payslip-generator',
          notes: `Gross KES ${c.gross.toFixed(0)} · ${period}`,
        }),
      })
    } catch (err) {
      // Best-effort: never block the user from their payslip on a logging error.
    }
    setSubmitting(false)
    setUnlocked(true)
    setGateOpen(false)
    setTimeout(() => window.print(), 350)
  }

  const leadValid = lead.name.trim() && lead.email.trim() && lead.phone.trim() && lead.consent

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

      {/* ── Lead gate modal ── */}
      {gateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => !submitting && setGateOpen(false)}>
          <div className="bg-white rounded-2xl border border-[#eee] w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#111] mb-1">Almost there</h3>
            <p className="text-[13px] text-[#666] mb-5">Enter your details and your payslip PDF unlocks instantly. We’ll only use these to send you useful Kenyan tax and salary tips.</p>
            <form onSubmit={submitGate} className="space-y-3">
              <div>
                <label className={label}>Full name</label>
                <input className={input} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} required />
              </div>
              <div>
                <label className={label}>Email</label>
                <input type="email" className={input} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} required />
              </div>
              <div>
                <label className={label}>Phone</label>
                <input type="tel" className={input} value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} required />
              </div>
              <label className="flex items-start gap-2 text-[12px] text-[#666] pt-1">
                <input type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} className="mt-0.5" required />
                <span>I agree to be contacted with relevant tips and offers, per the <a href="/privacy" className="text-brand hover:underline">privacy policy</a>. (Kenya Data Protection Act, 2019.)</span>
              </label>
              <button
                type="submit"
                disabled={!leadValid || submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all"
              >
                {submitting ? 'Unlocking…' : 'Unlock & download'}
              </button>
              <button type="button" onClick={() => setGateOpen(false)} className="w-full text-[12px] text-[#888] hover:text-[#555] pt-1">
                Maybe later
              </button>
            </form>
          </div>
        </div>
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

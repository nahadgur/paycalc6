'use client'

import { useState } from 'react'

type Payroll = {
  grossSalary: number; netSalary: number; paye: number; nssf: number;
  shif: number; housingLevy: number; helbRepayment: number;
  saccoContribution: number; unionDues: number; totalDeductions: number;
}
const money = (value: number) => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(value)
const compact = (value: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

export default function SalaryStory({ pay, pension }: { pay: Payroll; pension: number }) {
  const [selected, setSelected] = useState('take-home')
  const [month, setMonth] = useState(12)
  const deductions = [
    { id: 'paye', label: 'PAYE tax', value: pay.paye, color: '#191914' },
    { id: 'nssf', label: 'NSSF pension', value: pay.nssf, color: '#736b5b' },
    { id: 'shif', label: 'SHIF health', value: pay.shif, color: '#a99e86' },
    { id: 'housing', label: 'Housing levy', value: pay.housingLevy, color: '#c9bea6' },
    { id: 'helb', label: 'HELB repayment', value: pay.helbRepayment, color: '#736b5b' },
    { id: 'sacco', label: 'SACCO savings', value: pay.saccoContribution, color: '#a99e86' },
    { id: 'pension', label: 'Extra pension', value: pension, color: '#736b5b' },
    { id: 'union', label: 'Union dues', value: pay.unionDues, color: '#c9bea6' },
  ].filter(item => item.value > 0)
  const parts = [{ id: 'take-home', label: 'Take-home pay', value: Math.max(0, pay.netSalary), color: '#f04c40' }, ...deductions]
  const current = parts.find(item => item.id === selected) || parts[0]
  const denominator = Math.max(pay.grossSalary, pay.totalDeductions, 1)
  const kept = pay.grossSalary > 0 ? pay.netSalary / pay.grossSalary * 100 : 0
  const largestDeduction = Math.max(...deductions.map(item => item.value), 1)

  return (
    <section className="salary-story" aria-label="Your salary in pictures">
      <div className="story-heading"><span className="story-eyebrow">Follow the money</span><h2>One salary.<br />The whole story.</h2><p>Your monthly pay, made visible.</p></div>
      <div className="story-split">
        <div className="story-kept">
          <span className="story-eyebrow">What stays with you</span>
          <div className="story-big-number">{kept.toFixed(1)}<span>%</span></div>
          <p>of your gross salary comes home.</p>
          <div className="story-net"><span>Monthly take-home</span><strong>KES {money(pay.netSalary)}</strong></div>
          <div className="story-ratio" role="img" aria-label={`Take-home pay ${kept.toFixed(1)} percent of gross salary. Total deductions KES ${money(pay.totalDeductions)}.`}>
            {parts.map(item => <span key={item.id} style={{ width: `${item.value / denominator * 100}%`, backgroundColor: item.color, opacity: selected === 'take-home' || current.id === item.id ? 1 : .35 }} />)}
          </div>
          <div className="story-ratio-labels"><span>Keep · KES {money(pay.netSalary)}</span><span>Deductions · KES {money(pay.totalDeductions)}</span></div>
          {pay.netSalary < 0 && <p className="story-shortfall" role="status">Your deductions exceed your gross pay. Check the amounts entered below.</p>}
          <div className="story-selection" aria-live="polite"><span>{current.label}</span><strong>KES {money(current.value)}</strong></div>
          <button type="button" className="story-reset" onClick={() => setSelected('take-home')}>Show the whole salary <span aria-hidden="true">↗</span></button>
        </div>
        <div className="story-deductions">
          <div className="story-ledger-head"><h3>Where the rest goes.</h3><span>KES / month</span></div>
          <p className="story-ledger-hint">Select a deduction to highlight its share.</p>
          {deductions.length ? deductions.map((item, index) => <button type="button" className="story-deduction" key={item.id} aria-pressed={current.id === item.id} onClick={() => setSelected(item.id)}>
            <span className="story-row-top"><span><small>{String(index + 1).padStart(2, '0')}</small>{item.label}</span><strong>{money(item.value)}</strong></span>
            <span className="story-row-track" aria-hidden="true"><span style={{ width: `${item.value / largestDeduction * 100}%` }} /></span>
            <span className="story-row-share">{pay.grossSalary > 0 ? (item.value / pay.grossSalary * 100).toFixed(1) : '0.0'}% of gross</span>
          </button>) : <p className="story-empty">No deductions at this salary.</p>}
          <div className="story-ledger-total"><span>Total deductions</span><strong>{money(pay.totalDeductions)}</strong></div>
        </div>
      </div>
      {pay.netSalary >= 0 && <section className="story-year" aria-labelledby="story-year-title">
        <div className="story-year-head"><div><span className="story-eyebrow">The bigger picture</span><h3 id="story-year-title">Your next 12 paydays.</h3></div><div className="story-year-total" aria-live="polite"><span>Take-home after {month} {month === 1 ? 'payday' : 'paydays'}</span><strong>KES {money(pay.netSalary * month)}</strong></div></div>
        <div className="story-chart-key"><span><i className="story-key-net" />Take-home</span><span><i className="story-key-deductions" />All deductions</span><span>Cumulative · KES</span></div>
        <div className="story-year-chart">
          <div className="story-y-axis" aria-hidden="true"><span>{compact(pay.grossSalary * 12)}</span><span>{compact(pay.grossSalary * 6)}</span><span>0</span></div>
          <div className="story-year-bars" role="group" aria-label="Cumulative pay by payday. Select a bar for the exact amounts.">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => <button key={n} type="button" className="story-month" aria-pressed={month === n} aria-label={`Payday ${n}: take-home KES ${money(pay.netSalary * n)}, deductions KES ${money(pay.totalDeductions * n)}`} onClick={() => setMonth(n)}>
              <span className="story-month-stack" aria-hidden="true" style={{ height: `${pay.grossSalary > 0 ? n / 12 * 100 : 0}%` }}>
                <span className="story-month-deductions" style={{ flex: pay.totalDeductions }} /><span className="story-month-net" style={{ flex: Math.max(0, pay.netSalary) }} />
              </span><span className="story-month-label">{String(n).padStart(2, '0')}</span>
            </button>)}
          </div>
        </div>
        <label className="story-payday-control" htmlFor="story-payday">Choose a payday <strong>{String(month).padStart(2, '0')}</strong><input id="story-payday" type="range" min="1" max="12" step="1" value={month} onChange={event => setMonth(Number(event.target.value))} /></label>
        <div className="story-year-caption"><span>Payday 01 → 12 · select a bar</span><span>After payday {month}: gross KES {money(pay.grossSalary * month)} · deductions KES {money(pay.totalDeductions * month)}</span></div>
        <p className="story-assumption">Illustration assumes the same salary, deductions and rates for all 12 paydays. This is not a forecast of future tax rules.</p>
      </section>}
    </section>
  )
}

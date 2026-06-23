'use client'

import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { LEAD_WEBHOOK } from './LeadGate'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

type Lead = { name: string; email: string; phone: string; consent: boolean }

function validate(lead: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {}
  const name = lead.name.trim()
  if (name.length < 3 || !/[a-zA-Z]{2,}/.test(name)) errors.name = 'Please enter your full name.'
  if (!EMAIL_RE.test(lead.email.trim())) errors.email = 'Please enter a valid email address.'
  // Phone is optional here; validate only when something was typed.
  if (lead.phone.trim()) {
    const digits = lead.phone.replace(/\D/g, '')
    if (!/^(?:254|0)?[17]\d{8}$/.test(digits)) errors.phone = 'Enter a valid Kenyan number, e.g. 0712 345678.'
  }
  if (!lead.consent) errors.consent = 'Please tick the box to continue.'
  return errors
}

const inputBase =
  'w-full bg-white border rounded-lg px-3 py-2.5 text-[#111] text-sm focus:outline-none transition-colors'
const labelCls = 'block text-[12px] font-medium text-[#666] mb-1.5'

// Inline lead capture for the post-purchase thank-you page. Selar already has the
// buyer's email, but we keep our own list so we can ship the free updated editions
// promised on /kit when KRA rates change. Source tags the Selar funnel.
export default function ThankYouLead() {
  const [lead, setLead] = useState<Lead>({ name: '', email: '', phone: '', consent: false })
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const errors = validate(lead)
  const showErr = (k: keyof Lead) => touched && errors[k]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length > 0) return
    setSubmitting(true)
    try {
      // no-cors + text/plain so the request is "simple" and reaches Apps Script.
      await fetch(LEAD_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          consent: 'yes',
          source: 'kit-thankyou-selar',
          notes: 'Bought Broke After Payday kit via Selar',
        }),
      })
    } catch (err) {
      // Best-effort logging; never block the buyer on a webhook error.
    }
    setSubmitting(false)
    setDone(true)
  }

  const field = (k: keyof Lead) =>
    `${inputBase} ${showErr(k) ? 'border-red-400' : 'border-[#e5e5e5] focus:border-brand'}`

  if (done) {
    return (
      <div className="rounded-2xl border border-[#eee] bg-brand-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-brand" />
        <h3 className="text-lg font-bold text-[#111]">You are on the list</h3>
        <p className="mt-1 text-[13px] text-[#666]">
          When the 2026 rates change, your updated edition lands in your inbox for free. No spam, unsubscribe any time.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#eee] bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#111] mb-1">Get every future edition free</h3>
      <p className="text-[13px] text-[#666] mb-5">
        Kenyan PAYE, NSSF, SHIF and Housing Levy rates change. Add your details and we will email you each
        updated edition of the kit at no extra cost, plus the occasional salary and tax tip. Nothing else.
      </p>
      <form onSubmit={submit} className="space-y-3" noValidate>
        <div>
          <label className={labelCls}>Full name</label>
          <input className={field('name')} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="e.g. Jane Wanjiku" />
          {showErr('name') && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={labelCls}>Email <span className="text-[#aaa]">(use the same one you paid with)</span></label>
          <input type="email" className={field('email')} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="you@email.com" />
          {showErr('email') && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className={labelCls}>Phone <span className="text-[#aaa]">(optional)</span></label>
          <input type="tel" inputMode="tel" className={field('phone')} value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="0712 345678" />
          {showErr('phone') && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
        </div>
        <label className="flex items-start gap-2 text-[12px] text-[#666] pt-1">
          <input type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} className="mt-0.5" />
          <span>I agree to be emailed updated editions and relevant tips, per the <a href="/privacy" className="text-brand hover:underline">privacy policy</a>. (Kenya Data Protection Act, 2019.)</span>
        </label>
        {showErr('consent') && <p className="text-[11px] text-red-500">{errors.consent}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all"
        >
          {submitting ? 'Saving…' : 'Keep me updated'}
        </button>
      </form>
    </div>
  )
}

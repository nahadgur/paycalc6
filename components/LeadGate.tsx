'use client'

import React, { useState } from 'react'

// Lead webhook — fleet rule: hardcoded const, never an env var.
export const LEAD_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbyQi9LT5L_eZyAP1AlyFgi2BfeDZjKLivvzGbWtoip-h327MmVII4IWILLhUcHtJkkhEA/exec'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

type Lead = { name: string; email: string; phone: string; consent: boolean }

function validate(lead: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {}
  const name = lead.name.trim()
  // Real name: at least 3 chars and two consecutive letters (rejects "o", "123").
  if (name.length < 3 || !/[a-zA-Z]{2,}/.test(name)) errors.name = 'Please enter your full name.'
  if (!EMAIL_RE.test(lead.email.trim())) errors.email = 'Please enter a valid email address.'
  // Kenyan mobile: 07.., 01.., 2547.., +2547.., or 7..  (rejects "123").
  const digits = lead.phone.replace(/\D/g, '')
  if (!/^(?:254|0)?[17]\d{8}$/.test(digits)) errors.phone = 'Enter a valid Kenyan number, e.g. 0712 345678.'
  if (!lead.consent) errors.consent = 'Please tick the box to continue.'
  return errors
}

const inputBase =
  'w-full bg-white border rounded-lg px-3 py-2.5 text-[#111] text-sm focus:outline-none transition-colors'
const labelCls = 'block text-[12px] font-medium text-[#666] mb-1.5'

// A reusable lead-capture wall. The host page owns the "unlocked" state and the
// download action; this renders the modal, validates, posts the lead, then calls
// onSuccess so the page can unlock + print.
export default function LeadGate({
  source,
  notes,
  onSuccess,
  onClose,
}: {
  source: string
  notes?: string
  onSuccess: () => void
  onClose: () => void
}) {
  const [lead, setLead] = useState<Lead>({ name: '', email: '', phone: '', consent: false })
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const errors = validate(lead)
  const showErr = (k: keyof Lead) => touched && errors[k]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length > 0) return
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
          source,
          notes: notes || '',
        }),
      })
    } catch (err) {
      // Best-effort: never block the user from their download on a logging error.
    }
    setSubmitting(false)
    onSuccess()
  }

  const field = (k: keyof Lead) =>
    `${inputBase} ${showErr(k) ? 'border-red-400' : 'border-[#e5e5e5] focus:border-brand'}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => !submitting && onClose()}>
      <div className="bg-white rounded-2xl border border-[#eee] w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#111] mb-1">Almost there</h3>
        <p className="text-[13px] text-[#666] mb-5">
          Enter your details and your PDF unlocks instantly. We’ll only use these to send you useful Kenyan tax and salary tips.
        </p>
        <form onSubmit={submit} className="space-y-3" noValidate>
          <div>
            <label className={labelCls}>Full name</label>
            <input className={field('name')} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="e.g. Jane Wanjiku" />
            {showErr('name') && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={field('email')} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} placeholder="you@email.com" />
            {showErr('email') && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" inputMode="tel" className={field('phone')} value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="0712 345678" />
            {showErr('phone') && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <label className="flex items-start gap-2 text-[12px] text-[#666] pt-1">
            <input type="checkbox" checked={lead.consent} onChange={(e) => setLead({ ...lead, consent: e.target.checked })} className="mt-0.5" />
            <span>I agree to be contacted with relevant tips and offers, per the <a href="/privacy" className="text-brand hover:underline">privacy policy</a>. (Kenya Data Protection Act, 2019.)</span>
          </label>
          {showErr('consent') && <p className="text-[11px] text-red-500">{errors.consent}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-all"
          >
            {submitting ? 'Unlocking…' : 'Unlock & download'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-[12px] text-[#888] hover:text-[#555] pt-1">
            Maybe later
          </button>
        </form>
      </div>
    </div>
  )
}

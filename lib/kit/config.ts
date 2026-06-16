// Kit commerce configuration. All secrets come from env — see .env.kit.example
export const KIT = {
  name: 'Broke After Payday: The 2026 Kenya Take-Home Pay & Side Hustle Survival Kit',
  shortName: 'Broke After Payday Kit',
  priceKES: Number(process.env.KIT_PRICE_KES ?? 299),
  currency: 'KES',
  // Master PDF lives OUTSIDE /public so it can never be fetched directly.
  pdfPath: 'private/Broke_After_Payday_Kenya_Kit_2026.pdf',
  downloadValidDays: 7,
  fromEmail: process.env.KIT_FROM_EMAIL ?? 'PAYE Calculator Kenya <kit@payecalculator.co.ke>',
  siteUrl: process.env.SITE_URL ?? 'https://payecalculator.co.ke',
}

export type Provider = 'intasend' | 'pesapal'
export const ACTIVE_PROVIDER: Provider =
  (process.env.PAYMENT_PROVIDER as Provider) ?? 'intasend'

/** Normalise Kenyan MSISDN to 2547XXXXXXXX / 2541XXXXXXXX */
export function normalisePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, '')
  if (/^254(7|1)\d{8}$/.test(d)) return d
  if (/^0(7|1)\d{8}$/.test(d)) return '254' + d.slice(1)
  if (/^(7|1)\d{8}$/.test(d)) return '254' + d
  return null
}

export function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())
}

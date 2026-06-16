import type { Metadata } from 'next'

// Payment callback landing page (Pesapal redirects here with a tracking id).
// It carries transient query params and must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ThanksLayout({ children }: { children: React.ReactNode }) {
  return children
}

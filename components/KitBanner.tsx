import Link from 'next/link'
import { Download } from 'lucide-react'

// Persistent in-content promo for the kit. Unlike PromoBar (the dismissible top
// strip), this is a permanent block dropped into content pages — blog index,
// guides index, individual articles and the guide hubs. Dark warm charcoal so it
// stands out from the brand-50 calculator CTAs on the same pages. Links to the
// /kit landing page, which converts to Selar.
export default function KitBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#1a1412] text-white px-6 py-10 sm:px-10 sm:py-14 ${className}`}>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-16 h-auto w-[260px] text-white/[0.06]"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="270" cy="130" r="160" stroke="currentColor" strokeWidth="2" />
        <circle cx="270" cy="130" r="112" stroke="currentColor" strokeWidth="2" />
        <circle cx="270" cy="130" r="64" stroke="currentColor" strokeWidth="2" />
      </svg>

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Free for now
          </span>
          <h3 className="editorial-h mt-4 mb-3 text-[26px] sm:text-[34px] leading-tight">
            Broke After Payday: the 2026 salary survival kit
          </h3>
          <p className="text-sm leading-relaxed text-white/70">
            A 53-page PDF that decodes your payslip, plugs the money leaks, and helps you test one
            realistic side hustle. Free to download while we are in launch.
          </p>
        </div>
        <Link
          href="/kit"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition-colors hover:bg-brand-600"
        >
          <Download className="h-4 w-4" /> Get the kit free
        </Link>
      </div>
    </div>
  )
}

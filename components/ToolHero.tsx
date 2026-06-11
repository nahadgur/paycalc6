import Link from 'next/link'

// The coral "Bold Poster" hero used across the calculator pages, reused on the
// standalone tool pages (NSSF, mortgage relief, P9) so they match the fleet look.
export default function ToolHero({
  h1,
  pre,
  em,
  post,
  desc,
}: {
  h1: string
  pre: string
  em: string
  post: string
  desc: string
}) {
  return (
    <div className="bg-white pt-4 sm:pt-6 px-4 sm:px-6">
      <header className="max-w-5xl mx-auto bg-brand text-white rounded-2xl sm:rounded-3xl overflow-hidden">
        <div className="px-5 sm:px-8 md:px-10 pt-10 sm:pt-14 pb-10">
          <h1 className="text-[22px] sm:text-[28px] font-medium leading-tight mb-3 max-w-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
            {h1}
          </h1>
          <p className="editorial-h text-[40px] sm:text-[64px] mb-5" style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1 }}>
            {pre}
            <span className="italic">{em}</span>
            {post}
          </p>
          <p className="text-[13px] sm:text-[15px] opacity-90 max-w-xl leading-relaxed">{desc}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-full bg-white text-brand text-[13px] font-medium hover:bg-white/95 transition"
          >
            Open the full PAYE calculator →
          </Link>
          <div className="mt-8 h-px bg-white/40"></div>
        </div>
      </header>
    </div>
  )
}

import ToolTabs from './ToolTabs'

// The single coral "Bold Poster" hero. Two modes:
//  • Calculator pages: pass `active` (a ToolTabs key) -> small H1, big editorial
//    tagline, and the pill bar pinned to the bottom. All calculator heroes are
//    the same height, so moving between them is a seamless transition.
//  • Content pages (guides): omit `active`, pass `cta` -> the H1 itself is the
//    big editorial headline and a single CTA button replaces the pills. Shorter,
//    but all content heroes share one height too.
export default function Hero({
  h1,
  desc,
  active,
  pre,
  em,
  post,
  cta,
}: {
  h1: string
  desc: string
  active?: string
  pre?: string
  em?: string
  post?: string
  cta?: { href: string; label: string }
}) {
  const isCalc = !!active
  return (
    <div className="bg-white pt-4 sm:pt-6 px-4 sm:px-6">
      <header className="relative max-w-5xl mx-auto bg-brand text-white rounded-2xl sm:rounded-3xl overflow-hidden">
        {/* Decorative SVG backdrop — concentric rings + a soft disc, low opacity */}
        <svg aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 w-[300px] sm:w-[440px] h-auto text-white/10" viewBox="0 0 400 400" fill="none">
          <circle cx="270" cy="130" r="160" stroke="currentColor" strokeWidth="2" />
          <circle cx="270" cy="130" r="112" stroke="currentColor" strokeWidth="2" />
          <circle cx="270" cy="130" r="64" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg aria-hidden="true" className="pointer-events-none absolute -left-20 -bottom-24 w-[260px] sm:w-[320px] h-auto text-white/[0.05]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>

        <div className={`relative z-10 flex flex-col px-5 sm:px-8 md:px-10 pt-10 sm:pt-14 pb-8 ${isCalc ? 'min-h-[360px] sm:min-h-[490px]' : 'min-h-[230px] sm:min-h-[300px]'}`}>
          <div className="animate-fadeIn">
            {isCalc ? (
              <>
                <h1 className="text-[22px] sm:text-[28px] font-medium leading-tight mb-3 max-w-3xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {h1}
                </h1>
                <p className="editorial-h text-[40px] sm:text-[64px] mb-4" style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1 }}>
                  {pre}
                  <span className="italic">{em}</span>
                  {post}
                </p>
              </>
            ) : (
              <h1 className="editorial-h text-[32px] sm:text-[52px] mb-4 max-w-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05 }}>
                {h1}
              </h1>
            )}
            <p className="text-[13px] sm:text-[15px] opacity-90 max-w-xl leading-relaxed">{desc}</p>
          </div>

          <div className="mt-auto pt-7">
            {isCalc ? (
              <>
                <div className="h-px bg-white/30 mb-5"></div>
                <ToolTabs active={active!} />
              </>
            ) : cta ? (
              <a
                href={cta.href}
                className="inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand text-[13px] font-medium hover:bg-white/95 transition"
              >
                {cta.label}
              </a>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  )
}

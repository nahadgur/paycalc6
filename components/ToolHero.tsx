import ToolTabs from './ToolTabs'

// The coral "Bold Poster" hero used across the calculator pages, reused on the
// standalone tool pages (NSSF, mortgage relief, P9) so they match the fleet look.
// `active` is the ToolTabs key of the current page, used to highlight its pill.
export default function ToolHero({
  h1,
  pre,
  em,
  post,
  desc,
  active,
}: {
  h1: string
  pre: string
  em: string
  post: string
  desc: string
  active: string
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
          <ToolTabs active={active} />
        </div>
      </header>
    </div>
  )
}

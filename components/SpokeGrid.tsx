// components/SpokeGrid.tsx
// Renders a silo's spokes as a card grid. Used by the existing hub landing
// pages (tax-relief, employer-guide, statutory-changes) to link down to their
// articles, completing the hub-and-spoke loop.
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { siloByKey, spokeTitle } from '@/lib/silos'

export function SpokeGrid({ siloKey, heading = 'Guides in this topic' }: { siloKey: string; heading?: string }) {
  const silo = siloByKey(siloKey)
  if (!silo) return null
  return (
    <section className="mt-14 border-t border-white/10 pt-10">
      <h2 className="text-lg font-bold text-white mb-5">{heading}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {silo.spokes.map((slug) => (
          <Link
            key={slug}
            href={`/blog/${slug}`}
            className="group flex items-start gap-3 rounded-2xl bg-white border border-stone-200 hover:border-brand-300 p-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-brand-700 flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[15px] font-medium text-stone-800 leading-snug">{spokeTitle(slug)}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// components/SiloHub.tsx
// Shared pillar-hub shell for the new silo pages. Renders the breadcrumb,
// hero, intro, the "Guides in this topic" spoke grid (from lib/silos), a
// calculator CTA, and FAQ + BreadcrumbList JSON-LD. Light brand, no eyebrows.
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { siloByKey, spokeTitle } from '@/lib/silos'
import Hero from './Hero'

const BASE = 'https://www.payecalculator.co.ke'

export function SiloHub({
  siloKey,
  heading,
  intro,
  faqs,
}: {
  siloKey: string
  heading: string
  intro: React.ReactNode
  faqs: { q: string; a: string }[]
}) {
  const silo = siloByKey(siloKey)
  if (!silo) return null

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: silo.title, item: `${BASE}${silo.hubHref}` },
    ],
  }
  const faqSchema = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <Hero h1={heading} desc={silo.blurb} cta={{ href: silo.cta.href, label: `${silo.cta.label} →` }} />

      <div className="paye-calc-body min-h-screen pt-8 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/guides" className="hover:text-brand-700">Guides</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-700 font-medium">{silo.title}</span>
        </nav>

        {/* Intro */}
        <section className="mb-10 text-stone-700 leading-relaxed space-y-4 [&_a]:text-brand-700 [&_a]:underline [&_strong]:text-stone-900">
          {intro}
        </section>

        {/* Guides in this topic — the spokes */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-5">Guides in this topic</h2>
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

        {/* Calculator CTA */}
        <section className="mb-12 rounded-2xl bg-brand-50 border border-brand-200 p-7 text-center">
          <h2 className="text-xl font-bold text-stone-900 mb-2">See it on your own salary</h2>
          <p className="text-stone-600 max-w-xl mx-auto mb-5">
            Run your own figures and get an exact 2026 breakdown for PAYE, NSSF, SHIF, the Housing Levy and your net take-home.
          </p>
          <Link
            href={silo.cta.href}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white hover:bg-brand-600 transition-colors"
            style={{ backgroundColor: '#F04C40' }}
          >
            {silo.cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-white mb-5">Common questions</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl bg-white border border-stone-200 p-5">
                  <h3 className="font-semibold text-stone-900 mb-1.5">{f.q}</h3>
                  <p className="text-stone-600 leading-relaxed text-[15px]">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      </div>
    </>
  )
}

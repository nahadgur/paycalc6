import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import articles from '@/lib/articles.json'
import { siloForSpoke, ctaForSpoke } from '@/lib/silos'
import { ChevronRight } from 'lucide-react'

type Props = { params: { slug: string } }

const BASE = 'https://payecalculator.co.ke'

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) return { title: 'Article not found' }
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription,
      type: 'article',
      url: `https://payecalculator.co.ke/blog/${article.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription,
    },
  }
}

export default function BlogArticle({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const silo = siloForSpoke(params.slug)
  const cta = ctaForSpoke(params.slug)
  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE}/guides` },
    ...(silo ? [{ '@type': 'ListItem', position: 3, name: silo.title, item: `${BASE}${silo.hubHref}` }] : []),
    { '@type': 'ListItem', position: silo ? 4 : 3, name: article!.title, item: `${BASE}/blog/${params.slug}` },
  ]
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs }

  // Prefer same-silo posts (tightens internal linking), then top up with
  // others in stable order to keep the build deterministic.
  const siloSlugs = new Set(silo?.spokes ?? [])
  const sameSilo = articles.filter((a) => a.slug !== params.slug && siloSlugs.has(a.slug))
  const otherArticles = articles.filter((a) => a.slug !== params.slug && !siloSlugs.has(a.slug))
  const relatedArticles = [...sameSilo, ...otherArticles].slice(0, 3)

  const cleanContent = article!.content
    .replace(/\"\"/g, '"')
    .replace(/width\s*=\s*"[^"]*"/g, '')
    .replace(/<img([^>]*)>/g, '<img$1 loading="lazy">')

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {/* Hero — red band with title */}
      <section className="bg-brand text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
          <nav className="flex items-center flex-wrap gap-1.5 text-[12px] text-white/80 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/guides" className="hover:text-white">Guides</Link>
            {silo && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={silo.hubHref} className="hover:text-white">{silo.title}</Link>
              </>
            )}
          </nav>
          <h1 className="editorial-h text-[30px] sm:text-[44px] mb-5">
            {article!.title}
          </h1>
          <p className="text-[14px] sm:text-[16px] opacity-90 leading-relaxed">
            {article!.metaDescription}
          </p>
          <div className="flex items-center gap-4 mt-6 text-[11px] opacity-80">
            <span>10 min read</span>
            <span className="w-1 h-1 bg-white/60 rounded-full"></span>
            <span>Updated January 2026</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 py-12">

        {/* Calculator CTA card */}
        <div className="bg-brand-50 border border-brand-300 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="editorial-h text-[18px] text-brand-900 mb-1">Your exact take-home</h3>
            <p className="text-brand-700 text-[12px]">2026 KRA rates · instant</p>
          </div>
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand text-white rounded-full font-medium text-[13px] hover:bg-brand-600 transition whitespace-nowrap"
          >
            {cta.label} →
          </Link>
        </div>

        {/* Content */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: cleanContent }} />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-[#eee]">
          <div className="flex items-center justify-between">
            <span className="text-[#666] text-[13px]">Was this helpful?</span>
            <Link href={cta.href} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-[12px] font-medium hover:bg-brand-100 transition">
              {cta.label} →
            </Link>
          </div>
        </div>
      </article>

      {/* Related — cream section */}
      <section className="bg-brand-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14">
          <h2 className="editorial-h text-[26px] sm:text-[32px] mb-8 text-brand-900">
            Keep <span className="accent">reading</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group bg-white rounded-xl p-5 border border-brand-300/50 hover:border-brand transition-all duration-200 hover:-translate-y-0.5"
              >
                <h3 className="editorial-h text-[17px] text-[#111] mb-2 group-hover:text-brand transition-colors leading-snug">
                  {related.title}
                </h3>
                <p className="text-[#666] text-[12px] line-clamp-2 leading-relaxed">
                  {related.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

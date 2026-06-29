import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import articles from '@/lib/articles.json'
import { siloForSpoke, ctaForSpoke, ctaCard } from '@/lib/silos'
import { ChevronRight } from 'lucide-react'
import KitBanner from '@/components/KitBanner'

type Props = { params: { slug: string } }

const BASE = 'https://www.payecalculator.co.ke'
const PUBLISHED = '2026-01-15'
const MODIFIED = '2026-06-16'

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) return { title: 'Article not found' }
  return {
    title: { absolute: article.metaTitle || article.title },
    description: article.metaDescription,
    alternates: { canonical: `${BASE}/blog/${article.slug}` },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription,
      type: 'article',
      url: `${BASE}/blog/${article.slug}`,
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
  const card = ctaCard(cta.href)
  // Breadcrumb parent is the silo's pillar guide (the natural content parent);
  // for how-paye-works, which has no guide, it falls back to the calculator hub.
  // The calculator hub itself is reached via the CTA, completing blog -> guide
  // + blog -> calculator.
  const parentHref = silo ? (silo.guideHref ?? silo.hubHref) : undefined

  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
    ...(silo ? [{ '@type': 'ListItem', position: 2, name: silo.title, item: `${BASE}${parentHref}` }] : []),
    { '@type': 'ListItem', position: silo ? 3 : 2, name: article!.title, item: `${BASE}/blog/${params.slug}` },
  ]
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article!.title,
    description: article!.metaDescription,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${params.slug}` },
    author: { '@type': 'Organization', name: 'PayeCalculator', url: BASE },
    publisher: { '@type': 'Organization', name: 'PayeCalculator', url: BASE },
  }

  const cleanContent = article!.content
    .replace(/\"\"/g, '"')
    .replace(/width\s*=\s*"[^"]*"/g, '')
    .replace(/<img([^>]*)>/g, '<img$1 loading="lazy">')

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {/* Hero — red band with title */}
      <section className="bg-brand text-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
          <nav className="flex items-center flex-wrap gap-1.5 text-[12px] text-white/80 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            {silo && parentHref && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={parentHref} className="hover:text-white">{silo.title}</Link>
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
            <span>Updated June 2026</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 py-12">

        {/* Calculator CTA card */}
        <div className="bg-brand-50 border border-brand-300 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="editorial-h text-[18px] text-brand-900 mb-1">{card.title}</h3>
            <p className="text-brand-700 text-[12px]">{card.note}</p>
          </div>
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand text-white rounded-full font-medium text-[13px] hover:bg-brand-600 transition whitespace-nowrap"
          >
            {card.action} →
          </Link>
        </div>

        {/* Content */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: cleanContent }} />

        {/* Kit promo */}
        <KitBanner className="mt-12" />
      </article>
    </div>
  )
}

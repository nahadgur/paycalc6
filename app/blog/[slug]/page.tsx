import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import articles from '@/lib/articles.json'
import { calculatorHubForSpoke, ctaForSpoke, ctaCard } from '@/lib/silos'
import { ChevronRight } from 'lucide-react'
import KitBanner from '@/components/KitBanner'

type Props = { params: { slug: string } }
type FeaturedArticle = (typeof articles)[number] & {
  featuredImage?: string
  featuredImageAlt?: string
  featuredImageWidth?: number
  featuredImageHeight?: number
}

const articleList = articles as FeaturedArticle[]

const BASE = 'https://www.payecalculator.co.ke'
const PUBLISHED = '2026-01-15'

function featuredImageFor(article: FeaturedArticle) {
  if (!article.featuredImage) return undefined
  return {
    src: article.featuredImage,
    url: new URL(article.featuredImage, BASE).toString(),
    alt: article.featuredImageAlt || article.title,
    width: article.featuredImageWidth ?? 1200,
    height: article.featuredImageHeight ?? 630,
  }
}

export async function generateStaticParams() {
  // Draft articles are excluded from the build so they 404 in production and
  // stay out of the sitemap until the `draft` flag is removed.
  return articleList.filter((article) => !('draft' in article && article.draft)).map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articleList.find((a) => a.slug === params.slug)
  if (!article || ('draft' in article && article.draft)) notFound()
  const featuredImage = featuredImageFor(article)
  return {
    title: { absolute: article.metaTitle || article.title },
    description: article.metaDescription,
    alternates: { canonical: `${BASE}/blog/${article.slug}` },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription,
      type: 'article',
      url: `${BASE}/blog/${article.slug}`,
      ...(featuredImage ? {
        images: [{
          url: featuredImage.url,
          width: featuredImage.width,
          height: featuredImage.height,
          alt: featuredImage.alt,
        }],
      } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription,
      ...(featuredImage ? {
        images: [{ url: featuredImage.url, alt: featuredImage.alt }],
      } : {}),
    },
  }
}

export default function BlogArticle({ params }: Props) {
  const article = articleList.find((a) => a.slug === params.slug)
  // Draft articles 404 in both dev and prod until the `draft` flag is removed.
  if (!article || ('draft' in article && article.draft)) notFound()

  const featuredImage = featuredImageFor(article)
  const hub = calculatorHubForSpoke(params.slug)
  const cta = ctaForSpoke(params.slug)
  const card = ctaCard(cta.href)
  // The calculator is the primary hub; pillar guides remain supporting links.
  const hasSeparateHub = hub.href !== '/'

  const crumbs = [
    { '@type': 'ListItem', position: 1, name: 'PAYE Calculator', item: `${BASE}/` },
    ...(hasSeparateHub ? [{ '@type': 'ListItem', position: 2, name: hub.label, item: `${BASE}${hub.href}` }] : []),
    { '@type': 'ListItem', position: hasSeparateHub ? 3 : 2, name: article!.title, item: `${BASE}/blog/${params.slug}` },
  ]
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article!.title,
    description: article!.metaDescription,
    ...(featuredImage ? { image: [featuredImage.url] } : {}),
    datePublished: ('publishedAt' in article && article.publishedAt) || PUBLISHED,
    dateModified: article!.reviewedAt,
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
            <Link href="/" className="hover:text-white">PAYE Calculator</Link>
            {hasSeparateHub && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={hub.href} className="hover:text-white">{hub.label}</Link>
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
            <span>{Math.max(1, Math.ceil(article!.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 200))} min read</span>
            <span className="w-1 h-1 bg-white/60 rounded-full"></span>
            <span>Reviewed {new Date(article!.reviewedAt + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 py-12">

        {featuredImage ? (
          <figure className="mb-10 overflow-hidden rounded-2xl border border-stone-200 bg-brand-50">
            <img
              src={featuredImage.src}
              alt={featuredImage.alt}
              width={featuredImage.width}
              height={featuredImage.height}
              loading="eager"
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>
        ) : null}

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

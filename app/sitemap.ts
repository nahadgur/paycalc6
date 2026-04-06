import { MetadataRoute } from 'next'
import articles from '@/lib/articles.json'

const SALARY_AMOUNTS = [30000,40000,50000,60000,75000,100000,120000,150000,200000,300000,500000,800000,1000000]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://payecalculator.co.ke'
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                           lastModified: now, changeFrequency: 'monthly', priority: 1.0  },
    { url: `${baseUrl}/blog`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.9  },
    // Phase 1 — Tools
    { url: `${baseUrl}/p9-generator`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.95 },
    { url: `${baseUrl}/tax-calendar`,         lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    // Phase 2 — Hubs
    { url: `${baseUrl}/itax-2026`,            lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/statutory-changes`,    lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/tax-relief`,           lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/faq`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/employer-guide`,       lastModified: now, changeFrequency: 'monthly', priority: 0.87 },
    // Phase 3 — Regional & Budget
    { url: `${baseUrl}/kra-offices`,          lastModified: now, changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/budget-guide`,         lastModified: now, changeFrequency: 'monthly', priority: 0.86 },
  ]

  const salaryPages: MetadataRoute.Sitemap = SALARY_AMOUNTS.map(a => ({
    url: `${baseUrl}/salary/${a}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const blogPages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/blog/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  return [...staticPages, ...salaryPages, ...blogPages]
}

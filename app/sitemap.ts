import { MetadataRoute } from 'next'
import articles from '@/lib/articles.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://payecalculator.co.ke'
  const currentDate = new Date().toISOString()

  // Programmatic salary breakdown pages - keep in sync with
  // app/salary/[amount]/page.tsx -> SALARY_AMOUNTS
  const SALARY_AMOUNTS = [
    20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000,
    70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000,
    140000, 150000, 160000, 170000, 180000, 200000, 220000, 250000, 280000, 300000,
    350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000,
  ]

  // Static / landing pages (priority reflects commercial + search value)
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/payslip-generator`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/net-gross-calculator`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/bonus-calculator`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/raise-calculator`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/employer-cost-calculator`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/salary-comparison`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/guides`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/tax-calendar`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guides/statutory-changes`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/itax-2026`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guides/tax-relief`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guides/statutory-deductions`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guides/salary-breakdowns`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guides/employment-situations`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/nssf-calculator`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/mortgage-relief`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guides/employer-guide`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/budget-guide`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/p9-generator`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/kra-offices`, changeFrequency: 'monthly' as const, priority: 0.6 },
  ].map((p) => ({ ...p, lastModified: currentDate }))

  // Programmatic salary pages
  const salaryPages: MetadataRoute.Sitemap = SALARY_AMOUNTS.map((amount) => ({
    url: `${baseUrl}/salary/${amount}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog articles
  const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...salaryPages, ...blogPages]
}

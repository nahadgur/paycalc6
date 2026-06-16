/** @type {import('next').NextConfig} */
const nextConfig = {
  // Blog images are self-hosted under public/blog-images (downloaded from the
  // old autoblogging.ai CDN 2026-06-11), so no remote image host is needed.
  async redirects() {
    // The topical pillar guides moved under /guides/. Permanent-redirect the
    // old root URLs so links and any indexed pages follow to the new home.
    const moved = [
      'tax-relief',
      'employer-guide',
      'statutory-changes',
      'statutory-deductions',
      'salary-breakdowns',
      'employment-situations',
    ]
    const guideRedirects = moved.map((slug) => ({
      source: `/${slug}`,
      destination: `/guides/${slug}`,
      permanent: true,
    }))

    // Blog slug clean-ups (drop gratuitous listicle numbers). Keep the old URL
    // 301'ing so indexed pages and backlinks follow.
    const blogRedirects = [
      {
        source: '/blog/7-legal-ways-kenyan-employees-can-reduce-their-paye',
        destination: '/blog/legal-ways-to-reduce-paye-in-kenya',
        permanent: true,
      },
      {
        source: '/blog/the-complete-guide-to-nssf-contributions-in-kenya-for-2026',
        destination: '/blog/the-complete-guide-to-nssf-contributions-in-kenya',
        permanent: true,
      },
      {
        source: '/blog/key-kra-tax-deadlines-every-kenyan-should-know-in-2026',
        destination: '/blog/key-kra-tax-deadlines-every-kenyan-should-know',
        permanent: true,
      },
      // Orphaned/duplicate slugs picking up impressions in Search Console but
      // never published in the nav. 301 each to its topical equivalent so the
      // impressions land on a real page instead of a 404.
      {
        source: '/blog/how-to-calculate-your-shif-contribution-at-275-percent-without-errors',
        destination: '/blog/understanding-shif-deductions-in-kenya-and-what-replaced-nhif',
        permanent: true,
      },
      {
        source: '/blog/finance-act-2025-highlights-every-salaried-kenyan-should-understand',
        destination: '/blog/what-the-kenya-finance-bill-2025-means-for-your-salary',
        permanent: true,
      },
      {
        source: '/blog/mortgage-interest-relief-and-how-your-home-loan-can-lower-monthly-paye',
        destination: '/blog/claiming-mortgage-interest-relief-on-your-kenyan-tax-return',
        permanent: true,
      },
    ]

    // Force the canonical host: www serves live 200s today, so 301 every www
    // request to the bare apex (which metadataBase, the sitemap and all
    // canonicals already use). Belt-and-braces alongside the Vercel domain
    // redirect so the host is enforced in code too.
    const hostRedirect = {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.payecalculator.co.ke' }],
      destination: 'https://payecalculator.co.ke/:path*',
      permanent: true,
    }

    return [hostRedirect, ...guideRedirects, ...blogRedirects]
  },
  async headers() {
    // Security response headers (clears the Screaming Frog "missing header"
    // warnings). CSP is permissive enough to keep GA4, the Apps Script lead
    // webhook and inline JSON-LD working; tighten later if needed.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://script.google.com https://script.googleusercontent.com",
      "form-action 'self' https://script.google.com https://script.googleusercontent.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig

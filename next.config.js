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
    ]

    return [...guideRedirects, ...blogRedirects]
  },
}

module.exports = nextConfig

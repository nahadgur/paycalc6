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
    return moved.map((slug) => ({
      source: `/${slug}`,
      destination: `/guides/${slug}`,
      permanent: true,
    }))
  },
}

module.exports = nextConfig

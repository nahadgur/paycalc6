/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.autoblogging.ai',
      },
    ],
  },
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

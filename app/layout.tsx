import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import './globals.css'
import Image from "next/image"


export const metadata: Metadata = {
  title: {
    default: 'Kenya PAYE Calculator 2026 | Calculate Net Salary, NSSF, SHIF & Tax',
    template: '%s | Kenya PAYE Calculator'
  },
  description: 'Free Kenya PAYE calculator for 2026. Calculate your net salary, PAYE tax, NSSF, SHIF, and Housing Levy instantly. Updated with latest KRA tax bands and rates.',
  keywords: ['PAYE calculator Kenya', 'Kenya tax calculator', 'net salary calculator Kenya', 'NSSF calculator', 'SHIF calculator', 'KRA tax bands 2026'],
  authors: [{ name: 'PAYE Calculator Kenya' }],
  creator: 'PAYE Calculator Kenya',
  publisher: 'PAYE Calculator Kenya',
  metadataBase: new URL('https://payecalculator.co.ke'),
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://payecalculator.co.ke',
    siteName: 'Kenya PAYE Calculator',
    title: 'Kenya PAYE Calculator 2026 | Calculate Net Salary & Tax',
    description: 'Free Kenya PAYE calculator for 2026. Calculate your net salary, PAYE tax, NSSF, SHIF, and Housing Levy instantly.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kenya PAYE Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kenya PAYE Calculator 2026',
    description: 'Calculate your net salary, PAYE tax, NSSF, SHIF, and Housing Levy instantly.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
    name="google-site-verification"
    content="RTGtfmUJlOBad0COgiVkh4euoW5CO9sQCgkDwmnj_dM"
  />
        <link rel="icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* JSON-LD Schema */}
        <Script id="schema-software" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Kenya PAYE Calculator 2026",
            "url": "https://payecalculator.co.ke",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KES" },
            "description": "Free Kenya PAYE calculator for 2026. Calculate net salary, PAYE tax, NSSF, SHIF, and Housing Levy instantly.",
            "featureList": [
              "PAYE Tax Calculator",
              "Net to Gross Calculator",
              "Bonus Tax Calculator",
              "Employer Cost Calculator",
              "P9 Form Generator",
              "Tax Calendar"
            ],
            "inLanguage": "en-KE",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1200"
            }
          })}
        </Script>
        <Script id="schema-howto" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate PAYE Tax in Kenya 2026",
            "description": "Step-by-step guide to calculating PAYE, NSSF, SHIF, and Housing Levy deductions on your Kenyan salary.",
            "step": [
              { "@type": "HowToStep", "position": 1, "text": "Enter your monthly gross salary in the calculator" },
              { "@type": "HowToStep", "position": 2, "text": "Your NSSF is calculated at 6% of pensionable pay (capped at KES 72,000)" },
              { "@type": "HowToStep", "position": 3, "text": "SHIF is deducted at 2.75% of gross salary (minimum KES 300)" },
              { "@type": "HowToStep", "position": 4, "text": "Housing Levy is 1.5% of gross salary" },
              { "@type": "HowToStep", "position": 5, "text": "PAYE is applied to taxable income using 2026 KRA tax bands after personal relief of KES 2,400" }
            ]
          })}
        </Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BVFXE6F28R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BVFXE6F28R');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
  <Image
    src="/logo-256.png"
    alt="PAYE Calculator"
    width={32}
    height={32}
    priority
  />
  <span className="font-bold text-lg hidden sm:inline">PAYE Calculator</span>
</Link>
              <div className="flex items-center gap-1 md:gap-4">
                <Link href="/" className="text-stone-300 hover:text-white transition-colors text-sm font-medium px-2 py-1">
                  Calculator
                </Link>
                <Link href="/p9-generator" className="text-stone-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hidden sm:inline">
                  P9 Form
                </Link>
                <Link href="/tax-calendar" className="text-stone-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hidden md:inline">
                  Tax Calendar
                </Link>
                <Link href="/salary/100000" className="text-stone-300 hover:text-white transition-colors text-sm font-medium px-2 py-1 hidden md:inline">
                  Salary Guide
                </Link>
                <Link href="/blog" className="text-stone-300 hover:text-white transition-colors text-sm font-medium px-2 py-1">
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">KE</span>
                  </div>
                  <span className="font-bold text-lg">PAYE Calculator Kenya</span>
                </div>
                <p className="text-stone-400 text-sm max-w-md">
                  The most comprehensive PAYE calculator for Kenya. Calculate your net salary, tax, NSSF, SHIF, and Housing Levy with the latest 2026 rates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="text-stone-400 hover:text-white transition-colors">PAYE Calculator</Link></li>
                  <li><Link href="/p9-generator" className="text-stone-400 hover:text-white transition-colors">P9 Form Generator</Link></li>
                  <li><Link href="/tax-calendar" className="text-stone-400 hover:text-white transition-colors">KRA Tax Calendar</Link></li>
                  <li><Link href="/blog" className="text-stone-400 hover:text-white transition-colors">Tax Guides</Link></li>
                  <li><Link href="/blog/how-to-calculate-your-paye-tax-in-kenya" className="text-stone-400 hover:text-white transition-colors">How to Calculate PAYE</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Salary Breakdowns</h4>
                <ul className="space-y-2 text-sm">
                  {[50000, 75000, 100000, 150000, 200000].map(s => (
                    <li key={s}><Link href={`/salary/${s}`} className="text-stone-400 hover:text-white transition-colors">KES {(s/1000).toFixed(0)}K Salary</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Tax Guides</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/itax-2026" className="text-stone-400 hover:text-white transition-colors">KRA iTax 2026 Guide</Link></li>
                  <li><Link href="/statutory-changes" className="text-stone-400 hover:text-white transition-colors">SHIF &amp; NSSF Changes</Link></li>
                  <li><Link href="/tax-relief" className="text-stone-400 hover:text-white transition-colors">Tax Relief Guide</Link></li>
                  <li><Link href="/employer-guide" className="text-stone-400 hover:text-white transition-colors">Employer Guide</Link></li>
                  <li><Link href="/faq" className="text-stone-400 hover:text-white transition-colors">PAYE FAQ</Link></li>
                  <li><Link href="/kra-offices" className="text-stone-400 hover:text-white transition-colors">KRA Offices Kenya</Link></li>
                  <li><Link href="/budget-guide" className="text-stone-400 hover:text-white transition-colors">Budget Planner</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-stone-500 text-sm">
                © {new Date().getFullYear()} payecalculator.co.ke • Updated with 2026 Tax Rates
              </p>
              <p className="text-stone-600 text-xs mt-2">
                This calculator provides estimates only. Consult a qualified tax professional for official advice.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

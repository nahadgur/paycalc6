import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import NavCalculators from '@/components/NavCalculators'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kenya PAYE & Take-Home Pay Calculator 2026 | Net Salary',
    template: '%s | Kenya PAYE Calculator'
  },
  description: 'Work out your exact Kenya take-home pay in seconds. Free PAYE calculator on the 2026 KRA bands with NSSF, SHIF, Housing Levy and net to gross.',
  keywords: ['PAYE calculator Kenya', 'take home pay calculator Kenya', 'take home pay calculator', 'net pay calculator Kenya', 'net salary calculator Kenya', 'Kenya tax calculator', 'NSSF calculator', 'SHIF calculator', 'KRA tax bands 2026'],
  authors: [{ name: 'PAYE Calculator Kenya' }],
  creator: 'PAYE Calculator Kenya',
  publisher: 'PAYE Calculator Kenya',
  metadataBase: new URL('https://www.payecalculator.co.ke'),
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.payecalculator.co.ke',
    siteName: 'Kenya PAYE Calculator',
    title: 'Kenya PAYE Calculator 2026 | Calculate Net Salary & Tax',
    description: 'Free Kenya PAYE calculator for 2026. Calculate your net salary, PAYE tax, NSSF, SHIF, and Housing Levy instantly.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kenya PAYE Calculator' }],
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
  icons: {
    icon: [
      { url: '/logo-256.png', sizes: '256x256', type: 'image/png' },
    ],
    shortcut: '/logo-256.png',
    apple: '/logo-256.png',
  },
  verification: {
    google: [
      'RTGtfmUJlOBad0COgiVkh4euoW5CO9sQCgkDwmnj_dM',
      '89CXZSvy3OvCOYAkL7Yow-HWJHYinCLlABl1YMwKREA',
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BVFXE6F28R" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BVFXE6F28R');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.payecalculator.co.ke/#organization',
                  name: 'Kenya PAYE Calculator',
                  url: 'https://www.payecalculator.co.ke',
                  logo: 'https://www.payecalculator.co.ke/logo-512.png',
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.payecalculator.co.ke/#website',
                  url: 'https://www.payecalculator.co.ke',
                  name: 'Kenya PAYE Calculator',
                  publisher: { '@id': 'https://www.payecalculator.co.ke/#organization' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: 'https://www.payecalculator.co.ke/salary/{search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#111]">
        {/* Nav */}
        <nav className="sticky top-0 z-50 bg-white border-b border-[#eee]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2.5 group">
                <img src="/logo-256.png" alt="PAYE Calculator Kenya logo" className="w-7 h-7 rounded-md object-contain" width="28" height="28" />
                <span className="font-medium text-[13px] tracking-wide">PAYE.CALC</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-[10px] font-medium tracking-wider">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full pulse-dot" style={{ color: '#F04C40' }}></span>
                  2026
                </span>
              </Link>
              <div className="flex items-center gap-5 sm:gap-6">
                <NavCalculators />
                <Link href="/guides" className="text-[#555] hover:text-brand transition-colors text-[13px] font-medium">Guides</Link>
                <Link href="/blog" className="text-[#555] hover:text-brand transition-colors text-[13px] font-medium">Blog</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main>{children}</main>

        {/* Footer — Bold Poster red block, contained */}
        <div className="bg-white px-4 sm:px-6 pb-6">
          <footer className="max-w-5xl mx-auto bg-brand text-white rounded-2xl sm:rounded-3xl overflow-hidden px-5 sm:px-8 md:px-10 py-12 sm:py-14">
            {/* CTA band */}
            <div className="text-center mb-14">
              <h2 className="editorial-h text-[34px] sm:text-[44px] mb-3">
                Know your <span className="italic">exact</span> take-home.
              </h2>
              <p className="text-[13px] sm:text-sm opacity-90 mb-6 max-w-md mx-auto">
                Free Kenya PAYE calculator with the latest 2026 KRA rates.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 bg-[#111] text-white rounded-full font-medium text-[13px] hover:bg-black transition">
                  Calculate now →
                </Link>
                <Link href="/guides" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand rounded-full font-medium text-[13px] hover:bg-brand-50 transition">
                  Read the guides
                </Link>
              </div>
            </div>

            {/* Footer columns */}
            <div className="border-t border-white/25 pt-10 grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center p-1">
                    <img src="/logo-256.png" alt="PAYE Calculator Kenya logo" className="w-full h-full object-contain" width="20" height="20" />
                  </div>
                  <span className="font-medium text-[13px] tracking-wide">PAYE.CALC</span>
                </div>
                <p className="text-[11px] opacity-85 leading-relaxed max-w-xs">
                  The most comprehensive PAYE calculator for Kenya. Net salary, NSSF, SHIF and Housing Levy, with 2026 KRA rates.
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] opacity-75 mb-3 font-medium">CALCULATORS</p>
                <ul className="space-y-2 text-[12px]">
                  <li><Link href="/" className="opacity-90 hover:opacity-100 hover:underline">Net salary</Link></li>
                  <li><Link href="/net-gross-calculator" className="opacity-90 hover:opacity-100 hover:underline">Net to gross</Link></li>
                  <li><Link href="/bonus-calculator" className="opacity-90 hover:opacity-100 hover:underline">Bonus tax</Link></li>
                  <li><Link href="/raise-calculator" className="opacity-90 hover:opacity-100 hover:underline">Pay rise</Link></li>
                  <li><Link href="/employer-cost-calculator" className="opacity-90 hover:opacity-100 hover:underline">Employer cost</Link></li>
                  <li><Link href="/salary-comparison" className="opacity-90 hover:opacity-100 hover:underline">Salary comparison</Link></li>
                  <li><Link href="/salary/50000" className="opacity-90 hover:opacity-100 hover:underline">Salary breakdowns</Link></li>
                  <li><Link href="/nssf-calculator" className="opacity-90 hover:opacity-100 hover:underline">NSSF calculator</Link></li>
                  <li><Link href="/mortgage-relief" className="opacity-90 hover:opacity-100 hover:underline">Mortgage relief</Link></li>
                  <li><Link href="/p9-generator" className="opacity-90 hover:opacity-100 hover:underline">P9 generator</Link></li>
                  <li><Link href="/payslip-generator" className="opacity-90 hover:opacity-100 hover:underline">Payslip generator</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] opacity-75 mb-3 font-medium">RESOURCES</p>
                <ul className="space-y-2 text-[12px]">
                  <li><Link href="/tax-calendar" className="opacity-90 hover:opacity-100 hover:underline">Tax calendar</Link></li>
                  <li><Link href="/itax-2026" className="opacity-90 hover:opacity-100 hover:underline">iTax 2026 guide</Link></li>
                  <li><Link href="/guides/statutory-changes" className="opacity-90 hover:opacity-100 hover:underline">SHIF &amp; NSSF changes</Link></li>
                  <li><Link href="/guides/employer-guide" className="opacity-90 hover:opacity-100 hover:underline">Employer guide</Link></li>
                  <li><Link href="/faq" className="opacity-90 hover:opacity-100 hover:underline">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] opacity-75 mb-3 font-medium">GUIDES</p>
                <ul className="space-y-2 text-[12px]">
                  <li><Link href="/guides/statutory-deductions" className="opacity-90 hover:opacity-100 hover:underline">Statutory deductions</Link></li>
                  <li><Link href="/guides/tax-relief" className="opacity-90 hover:opacity-100 hover:underline">Tax savings &amp; reliefs</Link></li>
                  <li><Link href="/guides/salary-breakdowns" className="opacity-90 hover:opacity-100 hover:underline">Salary breakdowns</Link></li>
                  <li><Link href="/guides/employment-situations" className="opacity-90 hover:opacity-100 hover:underline">Employment situations</Link></li>
                  <li><Link href="/blog" className="opacity-90 hover:opacity-100 hover:underline">All articles →</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.15em] opacity-75 mb-3 font-medium">OFFICIAL</p>
                <ul className="space-y-2 text-[12px]">
                  <li><a href="https://www.kra.go.ke" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 hover:underline">KRA website</a></li>
                  <li><a href="https://itax.kra.go.ke" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 hover:underline">iTax portal</a></li>
                  <li><a href="https://www.nssf.or.ke" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 hover:underline">NSSF Kenya</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/20">
              <p className="text-[11px] opacity-75">
                © {new Date().getFullYear()} payecalculator.co.ke · Updated with 2026 KRA rates
              </p>
              <p className="text-[10px] opacity-60 mt-1">
                Estimates only. Consult a qualified tax professional for official advice.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: { absolute: 'KRA Tax Offices in Kenya 2026 | Find Your Branch' },
  description: 'Find your nearest Kenya Revenue Authority (KRA) tax office. Addresses, phone numbers, and opening hours for all KRA regional service centres across Kenya.',
  keywords: ['KRA office Nairobi','KRA office Mombasa','KRA office Kisumu','KRA Nakuru','KRA Eldoret','Kenya Revenue Authority offices'],
  alternates: { canonical: 'https://payecalculator.co.ke/kra-offices' },
}

type Office = {
  city: string
  region: string
  address: string
  po: string
  phone: string
  email?: string
  openingHours: string
  services: string[]
  nearestLandmark?: string
  googleMapsQuery: string
}

const OFFICES: Office[] = [
  {
    city: 'Nairobi',
    region: 'Nairobi Region',
    address: 'Times Tower, Haile Selassie Avenue, Nairobi CBD',
    po: 'P.O. Box 48240-00100',
    phone: '020 281 0000',
    email: 'crsc@kra.go.ke',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['PAYE enquiries', 'PIN registration & reactivation', 'Tax clearance certificates', 'Customs enquiries', 'Debt management', 'Objections & appeals', 'Domestic taxes'],
    nearestLandmark: 'Near Railways Club, Nairobi CBD',
    googleMapsQuery: 'Times+Tower+Nairobi+KRA',
  },
  {
    city: 'Nairobi — Upper Hill',
    region: 'Nairobi Region',
    address: 'Anniversary Towers, University Way, Nairobi',
    po: 'P.O. Box 48240-00100',
    phone: '0800 722 226',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE filing support', 'VAT registration', 'Income tax returns'],
    nearestLandmark: 'University Way, opposite Old Mutual building',
    googleMapsQuery: 'Anniversary+Towers+University+Way+Nairobi+KRA',
  },
  {
    city: 'Mombasa',
    region: 'Coast Region',
    address: 'Mombasa Revenue House, Nkrumah Road, Mombasa',
    po: 'P.O. Box 90198-80100',
    phone: '041 222 1076',
    email: 'crsc@kra.go.ke',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'Customs & border control', 'PAYE enquiries', 'PIN registration', 'Tax clearance', 'Port of Mombasa customs'],
    nearestLandmark: 'Nkrumah Road, near Treasury Square',
    googleMapsQuery: 'KRA+Mombasa+Revenue+House+Nkrumah+Road',
  },
  {
    city: 'Kisumu',
    region: 'Western Region',
    address: 'Mega City Mall, 2nd Floor, Kisumu',
    po: 'P.O. Box 1633-40100',
    phone: '057 202 4120',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE support', 'iTax assistance', 'PIN registration', 'Tax compliance'],
    nearestLandmark: 'Mega City Mall, Oginga Odinga Street',
    googleMapsQuery: 'KRA+Kisumu+Mega+City+Mall',
  },
  {
    city: 'Nakuru',
    region: 'Rift Valley Region',
    address: 'Tailored House, Kenyatta Avenue, Nakuru',
    po: 'P.O. Box 3004-20100',
    phone: '051 221 0108',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE & payroll queries', 'Tax clearance certificates', 'PIN registration', 'Local authority liaison'],
    nearestLandmark: 'Kenyatta Avenue, Nakuru Town Centre',
    googleMapsQuery: 'KRA+Nakuru+Tailored+House+Kenyatta+Avenue',
  },
  {
    city: 'Eldoret',
    region: 'North Rift Region',
    address: 'Zion Mall, Uganda Road, Eldoret',
    po: 'P.O. Box 2424-30100',
    phone: '053 203 1221',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE support', 'iTax registration', 'Tax compliance certificates', 'SME tax advisory'],
    nearestLandmark: 'Uganda Road, opposite Zion Mall',
    googleMapsQuery: 'KRA+Eldoret+Uganda+Road',
  },
  {
    city: 'Thika',
    region: 'Nairobi Region',
    address: 'Thika Greens Mall, Thika',
    po: 'P.O. Box 573-01000',
    phone: '067 203 1100',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE enquiries', 'PIN services', 'iTax support'],
    nearestLandmark: 'Thika Greens Mall, off Garissa Road',
    googleMapsQuery: 'KRA+Thika+Greens+Mall',
  },
  {
    city: 'Nyeri',
    region: 'Central Region',
    address: 'Nyeri Revenue House, Kimathi Way, Nyeri',
    po: 'P.O. Box 1065-10100',
    phone: '061 203 0561',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE support', 'Tax clearance', 'PIN registration'],
    nearestLandmark: 'Kimathi Way, Nyeri Town',
    googleMapsQuery: 'KRA+Nyeri+Revenue+House+Kimathi+Way',
  },
  {
    city: 'Meru',
    region: 'Mt Kenya Region',
    address: 'Meru Revenue Centre, Moi Avenue, Meru',
    po: 'P.O. Box 640-60200',
    phone: '064 203 1521',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['PAYE enquiries', 'Domestic taxes', 'iTax registration', 'Tax compliance'],
    nearestLandmark: 'Moi Avenue, Meru Town Centre',
    googleMapsQuery: 'KRA+Meru+Revenue+Centre+Moi+Avenue',
  },
  {
    city: 'Kisii',
    region: 'South Rift Region',
    address: 'KRA Revenue Centre, Hospital Road, Kisii',
    po: 'P.O. Box 2148-40200',
    phone: '058 203 0231',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PAYE support', 'PIN services'],
    nearestLandmark: 'Hospital Road, Kisii Town',
    googleMapsQuery: 'KRA+Kisii+Hospital+Road',
  },
  {
    city: 'Malindi',
    region: 'Coast Region',
    address: 'KRA Service Centre, Lamu Road, Malindi',
    po: 'P.O. Box 230-80200',
    phone: '042 213 0762',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['PAYE enquiries', 'Domestic taxes', 'Customs support', 'Tax clearance'],
    nearestLandmark: 'Lamu Road, Malindi Town',
    googleMapsQuery: 'KRA+Malindi+Lamu+Road',
  },
  {
    city: 'Garissa',
    region: 'North Eastern Region',
    address: 'KRA Revenue Office, Garissa Town',
    po: 'P.O. Box 1069-70100',
    phone: '046 202 0112',
    openingHours: 'Monday–Friday: 8:00 AM – 5:00 PM',
    services: ['Domestic taxes', 'PIN registration', 'PAYE support'],
    nearestLandmark: 'Garissa Town Centre',
    googleMapsQuery: 'KRA+Garissa+Revenue+Office',
  },
]

const ONLINE_SERVICES = [
  { service: 'PIN Registration & Reactivation', url: 'https://itax.kra.go.ke', note: 'Available 24/7 — no office visit needed' },
  { service: 'PAYE Returns (P10)', url: 'https://itax.kra.go.ke', note: 'File monthly by the 9th of each month' },
  { service: 'Income Tax Return Filing', url: 'https://itax.kra.go.ke', note: 'Annual deadline: June 30' },
  { service: 'Tax Clearance Certificate', url: 'https://itax.kra.go.ke', note: 'Instant for compliant taxpayers' },
  { service: 'Pay Tax (MPESA)', url: 'https://itax.kra.go.ke', note: 'Paybill 572572 — enter your KRA PIN as account number' },
  { service: 'Nil Return Filing', url: 'https://itax.kra.go.ke', note: 'Required even if you have zero income' },
]

const REGION_GROUPS = Array.from(new Set(OFFICES.map(o => o.region)))

export default function KRAOfficesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'KRA Tax Offices Kenya 2026',
    description: 'Addresses and contact details for Kenya Revenue Authority offices across Kenya.',
    url: 'https://payecalculator.co.ke/kra-offices',
    itemListElement: OFFICES.map((office, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'GovernmentOffice',
        name: `KRA ${office.city} Office`,
        address: { '@type': 'PostalAddress', streetAddress: office.address, addressLocality: office.city, addressCountry: 'KE' },
        telephone: office.phone,
      },
    })),
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">KRA Tax Offices in Kenya 2026</h1>
          <p className="text-stone-400 text-sm max-w-xl mx-auto leading-relaxed">
            Find your nearest KRA service centre. Most tax services are now available online via iTax 24/7 — visit an office only when you need in-person assistance.
          </p>
        </div>

        {/* Online first banner */}
        <section className="mb-10">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">💡 Do This Online First — Save the Trip</h2>
            <p className="text-stone-400 text-sm mb-4">Over 95% of KRA services are available via iTax at itax.kra.go.ke. Most Kenyans never need to visit a KRA office. Check whether your query can be handled online before making the journey.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {ONLINE_SERVICES.map(s => (
                <a key={s.service} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-xl p-3 transition-all group">
                  <div className="flex-1">
                    <p className="text-white text-xs font-semibold group-hover:text-emerald-400 transition-colors">{s.service}</p>
                    <p className="text-stone-500 text-xs mt-0.5">{s.note}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-sm">
              <span className="text-stone-400">KRA Toll-Free: <strong className="text-white">0800 722 226</strong></span>
              <span className="text-stone-400">Email: <strong className="text-white">callcentre@kra.go.ke</strong></span>
            </div>
          </div>
        </section>

        {/* Region navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {REGION_GROUPS.map(region => (
            <a key={region} href={`#${region.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:border-white/20 rounded-lg text-xs transition-colors">
              {region}
            </a>
          ))}
        </div>

        {/* Office cards by region */}
        {REGION_GROUPS.map(region => {
          const regionOffices = OFFICES.filter(o => o.region === region)
          return (
            <section key={region} id={region.toLowerCase().replace(/\s+/g, '-')} className="mb-10 scroll-mt-20">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-2 border-b border-white/10">
                <MapPin className="w-4 h-4 text-red-400" />
                {region}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {regionOffices.map(office => (
                  <div key={office.city} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="font-bold text-white mb-3">{office.city}</h3>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-start gap-2 text-stone-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-500" />
                        <div>
                          <p>{office.address}</p>
                          <p className="text-stone-500">{office.po}</p>
                          {office.nearestLandmark && <p className="text-stone-600 text-xs mt-0.5">{office.nearestLandmark}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-stone-400">
                        <Phone className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                        <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{office.phone}</a>
                      </div>
                      {office.email && (
                        <div className="flex items-center gap-2 text-stone-400">
                          <span className="w-3.5 h-3.5 shrink-0 text-stone-500 text-xs">@</span>
                          <a href={`mailto:${office.email}`} className="hover:text-white transition-colors text-xs">{office.email}</a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-stone-400">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                        <span className="text-xs">{office.openingHours}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-600 mb-2">Services available</p>
                      <div className="flex flex-wrap gap-1.5">
                        {office.services.slice(0, 4).map(s => (
                          <span key={s} className="text-xs bg-white/5 border border-white/10 text-stone-400 px-2 py-0.5 rounded">{s}</span>
                        ))}
                        {office.services.length > 4 && (
                          <span className="text-xs text-stone-500">+{office.services.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    <a href={`https://www.google.com/maps/search/?api=1&query=${office.googleMapsQuery}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      <MapPin className="w-3 h-3" /> View on Google Maps →
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* When to visit vs call */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-5">When to Visit vs When to Call vs When to Use iTax</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                label: '🏢 Visit in Person',
                color: 'border-red-500/20 bg-red-500/5',
                items: ['Complex objections or appeals', 'PIN reactivation with document issues', 'Tax debt negotiation', 'Stamp duty assessment', 'First-time PIN registration with identity issues'],
              },
              {
                label: '📞 Call 0800 722 226',
                color: 'border-amber-500/20 bg-amber-500/5',
                items: ['General PAYE queries', 'Penalty waiver applications', 'Status of pending returns', 'Password reset assistance', 'KRA system issues'],
              },
              {
                label: '💻 Use iTax Online',
                color: 'border-emerald-500/20 bg-emerald-500/5',
                items: ['File monthly P10 return', 'Submit annual income tax return', 'Pay PAYE and other taxes', 'Get tax clearance certificate', 'Register new PIN', 'File nil returns'],
              },
            ].map(col => (
              <div key={col.label} className={`border rounded-xl p-5 ${col.color}`}>
                <h3 className="font-bold text-white text-sm mb-3">{col.label}</h3>
                <ul className="space-y-1.5">
                  {col.items.map(item => (
                    <li key={item} className="text-xs text-stone-400 flex items-start gap-1.5">
                      <span className="text-stone-600 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <p className="text-stone-400 text-sm mb-4">Before visiting a KRA office, use our calculator to verify your PAYE figures.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-all">
            Calculate Your PAYE →
          </Link>
        </div>

        <p className="text-xs text-stone-600 text-center mt-6">
          Office locations and contact details verified April 2026. KRA offices may relocate — always confirm via kra.go.ke before visiting.
        </p>

        {/* Related */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-lg font-bold text-white mb-5">Related Tools &amp; Guides</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/itax-2026" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">🖥️</span>
              <span className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">KRA iTax 2026</span>
              <span className="text-stone-500 text-xs">File online — no office visit</span>
            </Link>
            <Link href="/tax-calendar" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">Tax Calendar</span>
              <span className="text-stone-500 text-xs">Know your filing deadlines</span>
            </Link>
            <Link href="/p9-generator" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-red-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">📄</span>
              <span className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">P9 Generator</span>
              <span className="text-stone-500 text-xs">Create your P9 before visiting</span>
            </Link>
            <Link href="/faq" className="flex flex-col gap-1 bg-white/5 border border-white/10 hover:border-stone-500/40 rounded-xl p-4 transition-all group">
              <span className="text-xl">❓</span>
              <span className="font-semibold text-white text-sm group-hover:text-stone-400 transition-colors">PAYE FAQ</span>
              <span className="text-stone-500 text-xs">Quick answers to common questions</span>
            </Link>
          </div>
        </section>

        {/* Related guides */}
        <section className="mt-14 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Do most tasks online first</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/itax-2026" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">💻</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">iTax 2026 Filing Guide</p>
                <p className="text-stone-500 text-xs mt-0.5">File your return without visiting an office</p>
              </div>
            </Link>
            <Link href="/tax-calendar" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📅</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">KRA Deadline Calendar</p>
                <p className="text-stone-500 text-xs mt-0.5">All monthly and annual filing dates</p>
              </div>
            </Link>
            <Link href="/p9-generator" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">📄</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">P9 Form Generator</p>
                <p className="text-stone-500 text-xs mt-0.5">Generate your P9 certificate online</p>
              </div>
            </Link>
            <Link href="/faq" className="flex items-start gap-3 bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all group">
              <span className="text-xl shrink-0">❓</span>
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">PAYE FAQ</p>
                <p className="text-stone-500 text-xs mt-0.5">Answers before you make the trip</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

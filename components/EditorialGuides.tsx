import Link from 'next/link'

const guides = [
  { href: '/guides/salary-breakdowns', mark: 'PAY', title: 'Your payslip, explained.', desc: 'Understand your gross salary, deductions and take-home pay.' },
  { href: '/guides/tax-relief', mark: '%', title: 'Tax relief that matters.', desc: 'Explore the qualifying deductions and reliefs that can reduce your tax.' },
  { href: '/guides/employer-guide', mark: 'WORK', title: 'Make payroll make sense.', desc: 'A practical guide to your responsibilities as an employer.' },
]
export default function EditorialGuides() {
  return (
    <section className="editorial-guides" aria-labelledby="money-guides-title">
      <div className="editorial-section-top"><h2 id="money-guides-title">Make sense of<br />your money.</h2><Link href="/guides">All money guides <span aria-hidden="true">↗</span></Link></div>
      <div className="editorial-guide-grid">
        {guides.map((guide, i) => <Link href={guide.href} key={guide.href} className="editorial-guide">
          <span className={`guide-cutout cutout-${i}`} aria-hidden="true"><span>{guide.mark}</span></span>
          <div><h3>{guide.title}</h3><p>{guide.desc}</p><span className="guide-read">Read the guide <span aria-hidden="true">→</span></span></div>
        </Link>)}
      </div>
    </section>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How payecalculator.co.ke collects, uses and protects your personal data under the Kenya Data Protection Act, 2019.',
  alternates: { canonical: 'https://www.payecalculator.co.ke/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="bg-white px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto blog-content">
        <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#111] mb-2" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Privacy Policy
        </h1>
        <p className="text-[13px] text-[#888] mb-8">Last updated: 11 June 2026</p>

        <p>
          This policy explains how payecalculator.co.ke (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal data, in line
          with the Kenya Data Protection Act, 2019. We try to collect as little as possible.
        </p>

        <h2>What we collect</h2>
        <p>
          The calculators themselves run entirely in your browser. The salary figures you type are not sent to us or
          stored on our servers.
        </p>
        <p>
          We only collect personal data when you choose to submit a form, such as the payslip generator. In that case we
          collect the name, email address and phone number you enter, plus the tool you used. We also collect anonymous,
          aggregated analytics (pages visited) once you accept analytics cookies.
        </p>

        <h2>How we use it</h2>
        <ul>
          <li>To deliver the file or result you asked for (for example, your payslip PDF).</li>
          <li>To send you relevant Kenyan tax, salary and money tips, and occasional offers, where you have agreed.</li>
          <li>To understand which calculators are useful and improve the site.</li>
        </ul>
        <p>We do not sell your personal data.</p>

        <h2>Where it is stored</h2>
        <p>
          Form submissions are stored in Google Workspace (Google Sheets), and analytics are processed by Google
          Analytics. These providers process data on our behalf under their own security and data-protection terms.
        </p>

        <h2>Your rights</h2>
        <p>
          Under the Data Protection Act, 2019 you can ask us to access, correct or delete the personal data we hold about
          you, and you can withdraw consent at any time. Every marketing email also includes an unsubscribe link.
        </p>

        <h2>Contact</h2>
        <p>
          To exercise any of these rights or ask a question, email{' '}
          <a href="mailto:hello@payecalculator.co.ke">hello@payecalculator.co.ke</a>. We respond within a reasonable
          period.
        </p>

        <h2>Changes</h2>
        <p>We may update this policy from time to time; the date at the top shows the latest version.</p>
      </div>
    </div>
  )
}

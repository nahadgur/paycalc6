# Research brief: Missing NSSF Contributions: What to Do

Research and review date: 25 October 2026.

## Intent and positioning

- Search intent: an employee can see a payslip deduction but cannot reconcile the corresponding NSSF credit, or believes an employer has failed to remit.
- This is a problem-resolution article. It deliberately leaves account login, statement retrieval and credential recovery to the companion /blog/how-to-check-your-nssf-contributions article.
- Primary calculator hub: /nssf-calculator (linked near opening and closing).
- Supporting guide: /guides/statutory-deductions.
- Secondary calculator: / for the wider PAYE/net-pay effect.
- Existing article links checked against lib/articles.json: /blog/the-complete-guide-to-nssf-contributions-in-kenya and /blog/how-to-read-your-kenyan-payslip.
- Suggested silo addition: statutory-deductions.
- No AGENTS.md found at repository root or the checked ancestors. No repository file modified by this drafting task.

## SERP observations

System1 searches were used because the topic involves current Kenyan financial and statutory obligations. Queries run:

1. site.nssf.or.ke missing contributions complaint remittance member employer
2. site.nssf.or.ke contact complaints contributions
3. site.nssf.or.ke 9th following month contributions employer Tier II
4. site.rba.go.ke NSSF Tier II contracting out employer approval
5. "missing NSSF contributions" Kenya employer statement
6. site.nssf.or.ke "Clarification on the Status" "2026"

Observed results:
- Official NSSF contact, employer, FAQ and self-service pages are the clearest primary sources for current channels and employer duties.
- Nonofficial results included an older 2022 payroll article about deductions that were not remitted, legal-service pages, and a result from NSSF Uganda. Country and date must be checked; none of those sources was used for the article's statutory claims.
- A third-party page labelled 2026 nevertheless repeated older earnings ceilings. This reinforces the choice to calculate only from the original NSSF Year 4 notice.
- The exact missing-contributions phrase returned relatively mixed results rather than a single verified Kenya-specific procedural guide. This is an observation from these searches, not a keyword-volume or ranking-difficulty claim.
- The practical gap is a clear evidence checklist that distinguishes payroll deductions, employer payment evidence, member allocation and approved Tier II destinations.

## Claim-to-source map

| Claim | Primary source | Verification and drafting treatment |
|---|---|---|
| Monthly employer contributions are due by the 9th day of the following month. | https://www.nssf.or.ke/employers | Official employer page states the deadline and electronic-return duty. Example September to 9 October is direct calendar application. No blanket posting SLA is inferred. |
| Employee and employer amounts are separate, at 6% within the applicable earnings bands; February 2026 starts Year 4. | https://gaa.go.ke/sites/default/files/2026-02/Notice%20To%20Employers%20%E2%80%94%20Year%204%20%282026%29%20NSSF%20Contribution%20Rates%20.pdf | Government-hosted copy of the original NSSF notice. Text read in full. KES 50,000 pensionable earnings gives KES 3,000 each and KES 6,000 combined. Worked example expressly assumes both tiers paid to NSSF and no prior-period adjustments. |
| Year 4 rates had not been withdrawn in the June clarification. | https://www.nssf.or.ke/clarification-on-the-status-of-nssf-contributions | Original image downloaded and visually inspected at /tmp/paye-nssf-clarification-june-2026.jpeg. June 4 statement says pending issues did not affect Year 4 contribution rates and warns against assuming reversion to KES 200. Used as a current-status cross-check, not as an unnecessary litigation discussion in the article. |
| Tier II can go to a qualifying contracted-out scheme, with employer application and RBA scheme qualification. | https://www.rba.go.ke/notice-to-stakeholders-on-nssf-act-2013/ | Official RBA notice explains employer application, Form C1 and reference scheme requirements. Article asks for approval and member contribution evidence instead of treating an ordinary workplace pension as proof of contracting out. |
| NSSF contacts: toll-free 0800 2212744; mobile 0709 583 000 / 0730 882 000; info@nssfkenya.co.ke; branch directory. | https://www.nssf.or.ke/contact | Directly opened current official contact page. No invented dedicated complaints email, payment account, WhatsApp route or response-time promise. |
| RBA generally expects written complaints and prior engagement with the relevant scheme party. | https://www.rba.go.ke/complaints-and-procedures/ | Official process states internal dispute resolution and written/formal complaint expectations. Article uses only for the separate approved private Tier II scheme branch of the problem. |

## Original practical material and inference boundaries

- Reconciliation sequence, payroll evidence checklist, sample message and recordkeeping steps are original practical suggestions.
- A missing entry is presented as a discrepancy to investigate, not proof of theft or non-remittance.
- An employer-wide receipt does not by itself demonstrate allocation to one employee: this is accounting reasoning, not an asserted NSSF processing rule.
- The article does not assert a normal posting delay, guaranteed tracing outcome, mandatory seven-day response or an automatic refund/interest entitlement.
- The reader is told to check which columns a statement actually shows; no unverified statement layout is assumed.
- Suggested request for a case/reference number is a recordkeeping recommendation, not a claim that every channel issues one.
- Personal-data safeguards are practical precautions; no unsupported claim about a particular NSSF upload channel is made.
- No legal penalties, court procedure, limitation period or litigation advice is included.

## Numbers

- Pensionable earnings: KES 50,000 for September 2026.
- Employee: 50,000 × 0.06 = KES 3,000.
- Employer: KES 3,000.
- Combined: KES 6,000.
- A private approved Tier II arrangement would require checking the separate scheme record; the draft does not apply the full KES 6,000 NSSF-only expectation to that case.

## Deliverable

JSON article object: lib/articles.json (25 October 2026 batch)
Fields: title, slug, metaTitle, metaDescription, content, publishedAt, reviewedAt.
Publication and review dates: 2026-10-25.


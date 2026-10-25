# Research brief: How to Check Your NSSF Contributions

Checked: 25 October 2026. Article object: `lib/articles.json (25 October 2026 batch)`.

## Search intent and scope

Searched live with system1 before drafting:

- `NSSF Kenya how to check contributions statement member self service portal` (official domain constraint)
- `how to check NSSF contributions Kenya statement online` (open query)
- `site:nssf.or.ke "*303#"`
- `site:nssf.or.ke "statement" "app"`
- `site:rba.go.ke "Tier II" "contracting"`

Observed results: NSSF's own self-service portal, member-access guidance and contributions-statement entry point; competing pages focus on online statements, phone/USSD and balances. Intent is practical access plus understanding whether payroll contributions appear. No ranking-volume claim is made. Secondary pages were used only to observe intent, not as authorities for financial facts.

Distinct angle: an official access route followed by a month-by-month payslip reconciliation, including employee versus employer share, account balances versus monthly contributions, and approved Tier II arrangements. Escalation is deliberately brief and links to the separate missing-contributions article. This avoids duplicating the established NSSF rates guide or the new missing-contributions article.

## Source map

| Claim or use | Primary source read | Evidence / limits |
|---|---|---|
| Portal contains the statement entry point | https://selfservice.nssf.or.ke/ | Member menu names “NSSF Contributions Statement”; web ref `turn5view0`. |
| Existing member certification and activation | https://www.nssf.or.ke/member-self-service | Existing Member eCert, branch approval/encoded key and Member Activation; `turn5view2`. |
| Lost credentials and activation requirement | https://selfservice.nssf.or.ke/member-resources/ | Recovery for activated accounts; recertification option; `turn5view1`. |
| Regular NSSF phone channels | https://www.nssf.or.ke/haba-haba-na-nssf | Current public page explicitly gives *303# and WhatsApp 0704 303303 for regular contributions, distinct from *254# for Haba Haba; `turn18view1`, lines 79–94. |
| Branch assistance | https://www.nssf.or.ke/branches | Official directory; `turn9view3`. No individual branch address/number reproduced. |
| Payroll period distinct from transaction date | https://selfservice.nssf.or.ke/employer-resources/ | Employer return includes employer number and payroll period; `turn18view2`, lines 90–100. Checking the contribution period is our practical inference, not a claim about a tested statement layout. |
| Free statement; retained number after changing employers; balance includes interest | https://www.nssf.or.ke/faqs | “How do I know how much…” and “What happens if I change…”; `turn12view0`, lines 67–78. Its old contribution-rate text was explicitly NOT used. |
| 6% each; example 50,000 × 6% = 3,000 employee + 3,000 employer | https://www.nssf.or.ke/notice-to-employers-year-4-2026-nssf-contribution-rates | Opened page `turn16view1`, then actually viewed linked notice image `turn18view3`: https://www.nssf.or.ke/wp-content/uploads/2026/02/Notice.png . Year 4 effective February 2026; 50,000 is within ceiling. Example assumes full September 2026 and both tiers paid to NSSF. |
| Approved Tier II contracting out can require separate scheme statement | https://www.rba.go.ke/notice-to-stakeholders-on-nssf-act-2013/ | RBA eligibility/application requirement, opened and found exact passage: `turn19view0` lines 577–582. The request to inspect the other scheme's statement is our practical recommendation. |

All source summaries in article are original paraphrases, with nearby official hyperlinks and a dated source list. No external page was copied.

## Verification limits and exclusions

- Public menus were inspected. No login, personal account, credential entry or authenticated screen access took place.
- The official `/nssf-statement/` endpoint timed out twice through the web fetcher. No claim that it is globally down: an access fallback is included, and exact post-login menu/button names are not invented.
- Portal download-manager links to the member/mobile guides returned 404. A search surfaced a 10-year-old mobile app PDF; it was not used to assert a current app workflow.
- The eCitizen landing page timed out. No statement-navigation path through eCitizen is claimed.
- Published USSD/WhatsApp identifiers were verified from NSSF's current public page, but live menus were not dialled and no exact option numbers or turnaround guarantees are asserted.
- No obsolete SMS code, payment instructions, withdrawal promises, remittance deadline or processing duration is included.
- The salary example is arithmetic based on the current notice; it is illustrative and does not claim to represent an inspected account.

## Internal linking and integration

Primary calculator hub: `/nssf-calculator` (contextual link near opening and final substantive paragraph). Secondary calculator: `/` for full PAYE and deductions.

Supporting links:

- `/guides/statutory-deductions`
- `/blog/the-complete-guide-to-nssf-contributions-in-kenya`
- `/blog/how-to-read-your-kenyan-payslip`
- `/blog/missing-nssf-contributions-what-to-do` (publication in this same batch required)

Add to statutory-deductions silo with calculator as main hub. Suitable inbound contextual links: established NSSF rates article's payroll-check section; existing payslip article's “Check contributions beyond the payslip” section. Parent agent owns shared repo edits.

## Deliverable

- Title: How to Check Your NSSF Contributions
- Slug: how-to-check-your-nssf-contributions
- Publication/review date: 2026-10-25
- Approximately 1,150 words including source list.
- Meta title 58 characters; description 149 characters.
- Existing repo AGENTS search returned no files; no ancestor AGENTS found in explicit checks.
- Read existing NSSF/payslip articles, current silos, content plan and relevant internal-link/CTA notes before drafting.

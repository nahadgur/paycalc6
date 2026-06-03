# PAYE Calculator (Kenya) — SEO & Growth: Proposed Changes

_Prepared 2 June 2026. Focus: SEO / organic growth. Repo: `nahadgur/paycalc6` → `payecalculator.co.ke`._

---

## 0. Repo sync status

Your local folder and GitHub `main` are **identical** — both at commit `006d1e9`, 19 commits. Nothing to reconcile.

---

## 1. Which Claude skills you need

You already have the **SearchFit SEO** and **Marketing** plugins installed. Most useful for this site, in order:

| Skill | Use it for |
|---|---|
| `searchfit-seo:technical-seo` | Sitemap, robots, indexation, crawlability, Core Web Vitals — your biggest issue area. |
| `searchfit-seo:seo-audit` | Repeatable full audit each time you ship. |
| `searchfit-seo:schema-markup` / `generate-schema` | Structured data (homepage schema added below). |
| `searchfit-seo:internal-linking` | Fix orphan pages (§3.3). |
| `searchfit-seo:on-page-seo` | **Title/meta CTR rewrites** — your single biggest lever per the GSC data (§2). |
| `searchfit-seo:content-strategy` / `content-brief` / `create-content` | Plan + write new programmatic and blog content. |
| `searchfit-seo:keyword-clustering` | Map the salary/deduction keyword universe before scaling `/salary/*`. |
| `searchfit-seo:ai-visibility` | Get cited inside ChatGPT/Claude/Perplexity answers (GEO/AEO). |
| `marketing:competitive-brief` | Ongoing competitor monitoring. |

The code fixes themselves needed no skill — applied directly with the file tools.

---

## 2. What your Google Search Console data says (last 6 months)

This reframes the whole priority list. Totals: **~384k impressions, ~2,570 clicks, ~0.67% CTR, average position ~6**.

**The core problem: you rank page 1 but below the top 3 on every money term, and CTR is very low.**

| Query | Clicks | Impressions | Position |
|---|---|---|---|
| paye calculator 2026 | 207 | 10,818 | **7.3** |
| paye calculator kenya 2026 | 181 | 6,468 | **7.1** |
| paye calculator kenya | 89 | 6,496 | **8.7** |
| salary calculator | 83 | 6,962 | 7.7 |
| paye calculator | 48 | 7,071 | **9.4** |
| net pay calculator | 8 | 4,689 | 8.7 |

Three takeaways drive everything below:

1. **You're stuck at position 7–9 on your highest-volume terms.** Moving the homepage into the top 3 is the biggest single win available — it would multiply clicks on terms you already rank for. Homepage today: 1,661 clicks, 158k impressions, **position 7.97**. This is what the schema, freshness, internal-linking and on-page work target.
2. **CTR is the other half.** Some pages have huge impressions and almost no clicks — e.g. `/blog/taxable-benefits-in-kind…` at **99,383 impressions but 0.16% CTR** (position 4.6), and `paye rates for high earners` at 15k impressions / 0.13%. Rewriting titles + meta descriptions on these is near-free traffic.
3. **The KES-100k salary blog post ranks position 3.6 with 260 clicks / 43k impressions.** This is hard proof that exact-salary pages work — and validates expanding the programmatic `/salary/[amount]` set (§3.5).

Other signals: **mobile converts ~2.4× better than desktop** (1.09% vs 0.45% CTR) — protect mobile UX. **US impressions are noise** (151k impressions, 0.03% CTR); your real audience is Kenya (2,313 clicks, 1.2% CTR) plus diaspora (UK, Germany, South Africa, Uganda). And there's clear demand for **"nssf new rates calculator 2026"** and **"mortgage relief calculator kenya"** (5–7% CTR) — two winnable niches.

---

## 3. Competitor landscape

| Competitor | Does well | Where you win / can beat them |
|---|---|---|
| **cleartax.co.ke** | PDF/CSV/email **payslip export**, bulk CSV payroll | You have richer charts; add export to match table stakes |
| **salarycalculator.co.ke** | **"Used by 15,000+ Kenyans"** social proof, payslip generator | You show no usage/social proof |
| **calculator.co.ke** | Tier I & II NSSF, **Raise Analyser, Loan Planner** | You have net→gross; add "what-if a raise" tools |
| **wingubox / aren.software** | Established payroll-brand authority | You're faster and more modern |
| **pna.co.ke** | States **"rates effective Feb 2026"** | **Your NSSF rate may be out of date — see §3.0** |
| **smarthr / netpaykenya / statum / afrotools** | Volume of long-tail pages | Your `/salary/*` generator can out-scale them |

Net: your calculator is among the **most feature-rich and best-designed** in the market (multi-tab charts, benefits-in-kind, reverse calc, employer cost). Your gaps are **technical SEO hygiene**, **data freshness**, and a couple of **trust/conversion features** rivals use as differentiators.

---

## 4. Proposed changes — prioritised

### 🔴 QUICK WINS

**3.0 — NSSF rate corrected to Feb 2026 Phase 4.** ✅ _Done & verified._
Confirmed across authoritative sources (Grant Thornton Tax Alert 1/2026, NSSF Kenya, PaySpace, CM Advocates): from **1 February 2026** the Upper Earnings Limit rose **72,000 → 108,000**, rate unchanged at 6%, so **max employee NSSF = KES 6,480/mo** (Tier I 540 + Tier II 5,940), up from 4,320. Updated the cap in **both** `components/PAYECalculator.tsx` and `app/salary/[amount]/page.tsx`. Because both tiers are 6%, the existing `min(gross, cap) × 6%` model is exactly correct at every salary level — verified: unchanged below 72k, KES 6,480 at gross ≥ 108k.
**NSSF blog article — rewritten.** ✅ _Done._ Replaced the old/inconsistent AI-generated body of `the-complete-guide-to-nssf-contributions…` with an accurate, well-structured article: correct Phase 4 figures (LEL 9,000, UEL 108,000, Tier I 540, Tier II 5,940, employee max 6,480, combined 12,960), a worked-examples table, a Phase 3 vs Phase 4 comparison, FAQ section, and internal links to the calculator, the KES-100k salary page and `/statutory-changes`. HTML tag-balanced and JSON-validated.

**3.1 — Comprehensive sitemap.** ✅ _Done._ `app/sitemap.ts` previously emitted only the homepage + blog posts. Every landing page (`/faq`, `/tax-calendar`, `/statutory-changes`, `/itax-2026`, `/tax-relief`, `/employer-guide`, `/budget-guide`, `/p9-generator`, `/kra-offices`) and all 13 `/salary/[amount]` pages were missing. Now all included.

**3.2 — Removed duplicate/conflicting sitemaps.** ✅ _Done._ You had a dynamic `app/sitemap.ts` **and** a static `public/sitemap.xml` (32 URLs, also missing the landing pages) **and** a stray root `sitemap.xml`, all claiming `/sitemap.xml`. The static `public/` file was shadowing the dynamic route, so your code-driven sitemap never served. Deleted both static files; `app/sitemap.ts` is now the single source of truth.

**3.3 — Fixed orphaned pages / internal linking.** ✅ _Done._ Important: `components/SiteNav.tsx` (the nice dropdown nav) is **dead code — never imported anywhere**. The real site-wide nav/footer lives in `app/layout.tsx` and linked only to `/` and `/blog` plus 3 blog posts. So every landing and salary page was **double-orphaned** (not in nav, not in sitemap) — discoverable only by luck. Added two footer columns (**CALCULATORS** and **RESOURCES**) linking salary breakdowns, P9 generator, tax relief, budget planner, tax calendar, iTax 2026, statutory changes, employer guide and FAQ across every page. _Optional follow-up: either wire up `SiteNav` into the layout for a proper header menu, or delete it to avoid confusion._

**3.4 — Added homepage structured data.** ✅ _Done._ Sub-pages had JSON-LD but the homepage (your #1 commercial page) had none. Added `WebApplication` + `FAQPage` + `BreadcrumbList` schema to `app/page.tsx` to compete for rich results and feed AI answer engines.

**3.5 — Title/meta CTR rewrites.** _[do next — biggest near-term traffic gain]_ Per §2, rewrite titles + meta descriptions on high-impression/low-CTR pages — starting with the homepage and `/blog/taxable-benefits-in-kind…` (99k impressions @ 0.16%). Use the year, "free", a number, and a clear benefit. Use `searchfit-seo:on-page-seo`.

### 🟠 STRATEGIC

**3.6 — Scale `/salary/[amount]` pages.** Only 13 amounts exist; the KES-100k page already proves the model (position 3.6). Expand to every 5k from 20k–300k then 50k steps to 1M (~70–90 pages), each with unique copy + breakdown + FAQ schema. Your single biggest scalable lever; update the `SALARY_AMOUNTS` array in both the page and `sitemap.ts` together.

**3.7 — Payslip / PDF export.** ✅ _Done._ Added a "Download payslip (PDF)" button to the calculator that opens a clean, print-only payslip sheet (gross, each deduction, net pay) via the browser's print-to-PDF — no new dependencies. Print CSS scoped in `globals.css`.

**3.8 — Trust & usage signals.** ✅ _Done._ Added a server-rendered "Updated 2 June 2026" badge and a sources line (KRA, NSSF, SHA) below the calculator, plus `dateModified` in the homepage schema. _Tip: swap in a real usage figure ("used by N Kenyans") once you have analytics to back it._

**3.9 — Niche calculator pages with proven demand.** ✅ _Done._ Built two dedicated, schema-rich landing pages targeting the high-CTR GSC queries: **`/nssf-calculator`** (Tier I/II breakdown table, 2026 rates, FAQ schema) and **`/mortgage-relief`** (KES 30,000 deduction, saving-by-band table, eligibility, FAQ schema). Both wired into the sitemap and footer, with internal links to the calculator and related guides. Also caught & fixed a related accuracy bug: the main calculator's `MAX_MORTGAGE_DEDUCTION` was still **25,000** — corrected to **30,000** (Tax Laws (Amendment) Act 2024, KES 360,000/yr).

**3.10 — "What-if" tools.** ✅ _Done (raise analyser)._ Added a **Raise** tab to the calculator: enter a % rise and see extra monthly take-home, the % of the increase you keep after tax, and the annual gain. (Net↔Gross already exists as the Reverse tab.)

**3.11 — GEO/AEO.** ✅ _Done (foundation)._ Added sitewide Organization + WebSite (with SearchAction) JSON-LD, plus a concise, quotable "How is PAYE calculated in Kenya in 2026?" answer block on the homepage for AI engines to cite. _Ongoing: run `searchfit-seo:ai-visibility` periodically to track mentions._

### 🟢 HOUSEKEEPING

**3.12 — De-dupe robots.** ✅ _Done._ Deleted `public/robots.txt`; the dynamic `app/robots.ts` is now the single source.
**3.13 — Canonical/redirects.** ⬜ _Your action:_ confirm `paycalc5-ik41.vercel.app` 301-redirects to `payecalculator.co.ke` so preview URLs don't get indexed (set in Vercel project settings).
**3.14 — Dead `SiteNav.tsx`.** ✅ _Done._ Deleted the unused component (its links were already replaced by the footer nav in §3.3).

---

## 5. Shipped so far

**Pass 1 — technical SEO:**
`app/sitemap.ts` (comprehensive, single source) · `app/page.tsx` (homepage JSON-LD: WebApplication + FAQPage + BreadcrumbList) · `app/layout.tsx` (footer internal links to all previously orphaned pages) · deleted `public/sitemap.xml` and root `sitemap.xml`.

**Pass 2 — CTR & programmatic scale:**
- Rewrote homepage title + meta description (benefit-led, "exact take-home in seconds").
- Rewrote titles + meta descriptions for the 5 worst high-impression / low-CTR blog pages (taxable benefits in kind — 99k impressions @ 0.16%; high earners; NSSF guide; insurance relief; net-to-gross). All year-corrected to 2026 and intent-led (`lib/articles.json`).
- Expanded `/salary/[amount]` from **13 → 39** pages (every 5k to 100k, then wider steps to 1M), kept `app/salary/[amount]/page.tsx` and `app/sitemap.ts` in exact sync.

**Build verification:** `articles.json` validated as well-formed JSON; the two salary arrays are byte-identical (39 entries); `app/page.tsx` parses clean. A full `next build` could **not** be completed in this sandbox (partial dependency install + the recharts-heavy client component exhausts memory here). **Please run `npm ci && npm run build` locally before deploying** — standard practice — then push.

**Awaiting your decision:** §3.0 NSSF rate — confirm 72k/4,320 vs 108k/6,480 and I'll update the calculators + blog in one consistent pass.

**Pass 3 — accuracy + new pages + housekeeping:**
- Fixed NSSF cap to KES 108,000 (max 6,480) in both calculators; rewrote the NSSF blog article to match.
- Fixed mortgage relief cap 25,000 → 30,000 in the main calculator.
- Built `/nssf-calculator` and `/mortgage-relief` landing pages (schema + internal links); added to sitemap + footer.
- Deleted `public/robots.txt` (dupe) and dead `components/SiteNav.tsx`.

**Pass 4 — features + GEO + trust:**
- Payslip PDF export (print-only sheet + button) in the calculator.
- **Raise** tab added to the calculator (what-if pay-rise analyser).
- Sitewide Organization + WebSite schema; homepage quotable answer block + "updated" trust badge with sources.

## 6. Status
Effectively the whole prioritised list is now shipped. Remaining is **your** call, not code:
- §3.13 Vercel → domain 301 redirect — **you've decided to skip** (the `.vercel.app` URL isn't indexed; treated as staging).
- Add a real usage figure to the trust badge once analytics support it.
- **Run `npm ci && npm run build` locally before deploying** — the sandbox can't complete a full build (partial deps + the recharts-heavy calculator OOMs here). All edits were structure-verified (tag/brace-balanced) and add no new dependencies.

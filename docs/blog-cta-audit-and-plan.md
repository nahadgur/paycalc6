# PayeCalc Blog Audit & CTA Routing Plan

**Date:** 15 June 2026
**Scope:** All 30 blog articles in `lib/articles.json`, rendered by `app/blog/[slug]/page.tsx`
**Goal:** Stop every blog CTA pointing at the homepage; route each post to its most relevant calculator.

**Status:** IMPLEMENTED 15 June 2026, then extended into a full silo restructure the same day. Each silo now declares a `hubHref` + `hubType` ('calculator' | 'guide') + `cta` in `lib/silos.ts`; 5 silos hub on a calculator (`/`, `/nssf-calculator`, `/salary-comparison`, `/employer-cost-calculator`, `/tax-calendar`), 2 keep a guide hub (`/guides/tax-relief`, `/guides/employment-situations`) but link prominently to their calculator. Blog template (`app/blog/[slug]/page.tsx`): both CTAs use `ctaForSpoke()`, the CTA-card heading/note now vary by calculator via `ctaCard()`, breadcrumb (visible + JSON-LD) points the middle node at the silo hub (Guides node dropped), "Keep reading" is same-silo, and per-post Article JSON-LD was added. Hub pages link DOWN to spokes via `SpokeGrid` (new `light` variant for white pages); the two guide hubs got a top calculator CTA. Broken `/statutory-changes` link fixed to `/guides/statutory-changes`. The two body `href="/"` links in the NSSF post were left as-is: both are anchored "Kenya PAYE calculator" with surrounding net-pay/SHIF/levy context, so `/` (the full PAYE calculator) is the correct destination, not `/nssf-calculator`.

**Final topology (15 June 2026, second pass):** confirmed a 3-tier hub-and-spoke with the calculator at the top of every silo. `Silo` now has `hubHref` (always a calculator) + optional `guideHref` (the pillar guide); `hubType` was dropped. All 7 silos hub on a calculator (tax-savings -> `/mortgage-relief`, employment-situations -> `/bonus-calculator` flipped from guide hubs). Link flow: blog spoke -> its guide (breadcrumb parent, falling back to the calculator for how-paye-works which has no guide) and -> its relevant calculator (CTA); guide -> calculator (Hero/CTA); calculator -> spokes (`SpokeGrid`). URL slugs were not touched, only breadcrumb targets and internal links.

---

## 1. Verdict: is the blog helping you?

Yes — structurally it is a strong asset, but it is leaking the conversions it earns.

The content base is genuinely good: 30 in-depth, Kenya-specific articles (7,000–44,000 characters each) covering the full PAYE journey, already organised into a clean 7-silo hub-and-spoke architecture (`lib/silos.ts`). That is the hard part, and it is done well. The problem is the last mile: a reader who finishes a 24,000-word guide on, say, NSSF contributions is sent to a generic homepage instead of the NSSF calculator. Every article does the same thing, so the blog drives traffic into a funnel that immediately loses topical intent.

In short: the blog earns attention; the CTA throws away the context that makes that attention convert.

---

## 2. The CTA problem (root cause)

The two visible "calculator" CTAs are **hardcoded in the template**, not per-article. In `app/blog/[slug]/page.tsx`:

1. The **top CTA card** — *"Your exact take-home / Open calculator →"* → `href="/"`
2. The **footer share strip** — *"Try the calculator →"* → `href="/"`

Because they live in the shared template, all 30 posts inherit the same homepage link regardless of topic. Fixing this once in the template (driven by a per-silo lookup) fixes all 30 posts at once.

A few smaller issues found in the same audit:

- **Duplicate internal links per post.** Every blog page links to the homepage **three times** — the "Home" breadcrumb (line 66), the top CTA card (line 100), and the footer strip (line 114), all `href="/"`. Repeating the same destination with the same intent dilutes link equity and reads as low-effort to search engines. Once the CTAs are routed to their topical calculators (section 3), these three links become three *distinct* destinations, which fixes this automatically.
- **One broken internal link.** Article body content links to `/statutory-changes`, which is not a route. The correct path is `/guides/statutory-changes`.
- **Two stray `href="/"` links** inside article body HTML — minor, but worth redirecting to the relevant calculator while you are in there.
- **Random "related articles."** The "Keep reading" block uses `Math.random()` to pick 3 posts, so it ignores the silo structure. Pointing it at same-silo articles would tighten internal linking and SEO.
- **Hardcoded meta.** Every post shows *"10 min read"* and *"Updated January 2026"*. Harmless, but it dates the whole blog the moment one reader notices.

None of these block the CTA fix; they are listed so you can batch them in the same pass.

---

## 3. The plan: per-silo CTA routing

The homepage (`/`) **is** your main PAYE / take-home calculator, so it is the correct destination for the genuine "how PAYE works" posts. Everything else should point to its matching tool. Below is the per-silo default you asked for — one CTA per silo, covering all 30 posts.

| # | Silo | Posts | CTA destination | CTA label |
|---|------|-------|-----------------|-----------|
| 1 | How PAYE Works | 3 | `/` (main take-home calculator) | "Calculate your exact take-home" |
| 2 | Statutory Deductions | 3 | `/` (shows NSSF + SHIF + Housing Levy breakdown) | "See your full deduction breakdown" |
| 3 | Tax Savings & Reliefs | 5 | `/` (reliefs reduce your taxable pay live) | "See how reliefs cut your PAYE" |
| 4 | Salary Breakdowns | 6 | `/salary-comparison` | "Compare salaries side by side" |
| 5 | Employment Situations | 6 | `/` (main calculator) | "Check your PAYE for your situation" |
| 6 | For Employers | 4 | `/employer-cost-calculator` | "Work out the true cost to employ" |
| 7 | News & Updates | 3 | `/` (recalculate on the latest rates) | "Recalculate on 2026 rates" |

### Optional per-article overrides (higher conversion)

The per-silo default is the simple version. If you want maximum topical match later, override these 8 posts to their exact tool — this is where the biggest intent-to-tool gap exists:

| Article | Silo default | Recommended override |
|---------|-------------|----------------------|
| working-backwards-from-net-to-gross-salary-in-kenya | `/` | `/net-gross-calculator` |
| the-complete-guide-to-nssf-contributions-in-kenya | `/` | `/nssf-calculator` |
| claiming-mortgage-interest-relief-on-your-kenyan-tax-return | `/` | `/mortgage-relief` |
| what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya | `/salary-comparison` | `/salary/50000` |
| take-home-pay-on-a-kes-100000-salary-in-kenya | `/salary-comparison` | `/salary/100000` |
| how-much-tax-do-you-pay-on-kes-150000-in-kenya | `/salary-comparison` | `/salary/150000` |
| the-real-cost-of-earning-kes-200000-in-kenya | `/salary-comparison` | `/salary/200000` |
| how-kenyan-employers-tax-your-bonus-and-13th-month-pay | `/` | `/bonus-calculator` |
| key-kra-tax-deadlines-every-kenyan-should-know | `/` | `/tax-calendar` |
| how-the-new-nssf-rates-affect-kenyan-workers | `/` | `/nssf-calculator` |
| filing-paye-returns-on-itax-in-kenya-without-getting-penalised | `/employer-cost-calculator` | `/p9-generator` |

Calculators available to route to: `/` (main PAYE), `/net-gross-calculator`, `/bonus-calculator`, `/employer-cost-calculator`, `/nssf-calculator`, `/mortgage-relief`, `/raise-calculator`, `/salary-comparison`, `/salary/[amount]`, `/p9-generator`, `/payslip-generator`, `/itax-2026`, `/tax-calendar`.

---

## 4. How to implement (when you're ready)

This is a plan-only document — no code has been changed. The fix is two small edits.

**Step 1 — add a CTA to each silo in `lib/silos.ts`.** Extend the `Silo` interface and each silo object:

```ts
export interface Silo {
  key: string
  title: string
  hubHref: string
  blurb: string
  spokes: string[]
  cta: { href: string; label: string }   // <- new
}

// example for the Statutory Deductions silo:
cta: { href: '/', label: 'See your full deduction breakdown' },
```

(Optional) add a per-slug override map for the 8 articles in section 3:

```ts
const CTA_OVERRIDES: Record<string, { href: string; label: string }> = {
  'the-complete-guide-to-nssf-contributions-in-kenya':
    { href: '/nssf-calculator', label: 'Calculate your NSSF contribution' },
  // ...rest of the overrides
}

export function ctaForSpoke(slug: string) {
  return CTA_OVERRIDES[slug] ?? siloForSpoke(slug)?.cta
    ?? { href: '/', label: 'Open calculator →' }
}
```

**Step 2 — use it in `app/blog/[slug]/page.tsx`.** Replace the two hardcoded `href="/"` CTAs:

```tsx
const cta = ctaForSpoke(params.slug)
// top card:
<Link href={cta.href} ...>{cta.label} →</Link>
// footer strip:
<Link href={cta.href} ...>{cta.label} →</Link>
```

**Step 3 (optional, same pass).** Fix the broken `/statutory-changes` link → `/guides/statutory-changes` in article content, redirect the 2 stray body `href="/"` links, and change "Keep reading" to prefer same-silo articles via `siloForSpoke()`.

**How to verify:** run `npm run build`, then spot-check one post per silo (e.g. `/blog/the-complete-guide-to-nssf-contributions-in-kenya`) and confirm both the top card and footer strip point to the mapped calculator, not `/`.

---

## 5. Suggested order of work

1. Add `cta` to all 7 silos + wire the template (fixes all 30 posts) — ~30 min.
2. Add the 8 per-article overrides — ~15 min.
3. Fix the broken link + same-silo related posts — ~15 min.
4. Build, spot-check, ship.

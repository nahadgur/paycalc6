# PAYE daily publication programme

Owner reconfirmation: 25 October 2026. Publish **three new, researched articles every day**, continuing without a chat reply. The publisher resumes on 26 October at approximately 08:00 Europe/London. A separate check runs at approximately 10:00 Europe/London. These are scheduled jobs, not a guarantee of successful execution; record and report failures.

## Source of truth

- Current `main`, `lib/articles.json`, `lib/silos.ts` and `docs/content-plan.json`.
- The content plan contains actual release dates, titles, slugs, primary calculator hubs and the next topic batch. It also identifies the existing publisher and verifier tasks; never create duplicate publishers.
- Keep research briefs and claim/source mappings in `docs/research/`. Read official, current Kenyan sources before drafting. Preserve distinctions between a proposal, enacted rule and actual implementation.
- Check for existing coverage and a current-day partial batch before writing. Continue unfinished work without duplicating topics or exceeding the current day's three. Do not backdate articles or relabel old articles as new releases.

## Calculators are the primary hubs

The owner's explicit instruction is that the site's various calculators are the main hubs. Each article must point to its closest relevant calculator. Guides support that relationship.

- NSSF statement and missing-contribution articles: `/nssf-calculator`.
- SHA/SHIF and general PAYE deduction articles: `/` (the PAYE calculator).
- Other topics: select the relevant existing net-to-gross, bonus, pay-rise, mortgage, salary-comparison or employer-cost calculator. Do not force a mortgage or NSSF calculator onto an unrelated article just because it shares a broad silo.
- Wire `ctaForSpoke` in `lib/silos.ts`; `calculatorHubForSpoke` uses the same destination for the article breadcrumb. Set a per-article override whenever the silo default is unsuitable.
- Put useful contextual calculator links in the article body. Add a direct reciprocal link from the calculator page in the same release. `SpokeGrid` supports `hubHref` to derive this automatically; guide grids can continue using `siloKey`.
- Add supporting guide and relevant sibling links, then update the appropriate blog category. Record the actual primary calculator URL in the release plan's `hub` field.

## Featured images are required

Every new article published on or after **25 October 2026** must have a relevant original or properly licensed featured image. Record its provenance in the research brief. Create or obtain the actual asset before publishing the article; a filename or an unrendered metadata reference does not complete this work.

- Store the optimised image in `public/blog-images/`, normally as `<slug>-featured.jpg`. The default social and editorial size is **1200 × 630 pixels**. JPEG, PNG and WebP are supported by the verification gate; use an appropriate format and optimise the file size without damaging the image.
- Set `featuredImage` to the public path, such as `/blog-images/<slug>-featured.jpg`; set `featuredImageAlt` to a meaningful description of what is visible, and set `featuredImageWidth` / `featuredImageHeight` to the actual positive intrinsic dimensions. Do not use a placeholder or repeat the article title as the alt text.
- Render the image and its alt text on the article and its blog-index card. Supply the same main image to Open Graph, the Twitter large-image card and Article structured data. Open Graph must include its width, height and alt; Twitter must include the alt too.
- Inspect the rendered article and index at desktop and mobile sizes. Check the image loads, the crop remains relevant, the aspect ratio is appropriate and text or important details are not cut off. Automated URL and signature checks do not replace this visual inspection.
- The build check verifies the local asset and rendered pages. The production check additionally fetches the self-hosted image and requires HTTP 200, a matching image MIME type and nonempty JPEG/PNG/WebP bytes. An HTML error page at an image URL is a failure.

Older releases retain their original dates and are not newly subject to this image gate. For a new release, missing images, alt text, dimensions, social metadata or schema images mean **PUBLISHING INCOMPLETE**, even when the article text is already accessible.

## Release gate

1. Write complete original articles, current official source links, metadata, genuine publication/review dates and appropriate contextual examples. Produce the relevant featured images and all required image fields above. Do not invent expertise, contacts, account screens, policy rules or statistics. Use the existing organisation attribution honestly.
2. Add all three articles, their image assets, hub/category wiring and research briefs atomically. Keep unrelated drafts unpublished. Update contextual inbound links from relevant existing articles without changing their original publication dates.
3. Run `npm run build`, `node scripts/check-blog-audit.cjs`, and `node scripts/check-daily-publishing.cjs --date=YYYY-MM-DD`.
4. Read the latest remote `main` before publishing. Push directly under the owner's standing authorisation with a matching-head lease; never overwrite intervening changes or bypass permissions.
5. Check Vercel's GitHub status for the exact commit. After deployment, run `node scripts/check-daily-publishing.cjs --live --date=YYYY-MM-DD`. This verifies actual production content, canonical and publication metadata, sitemap/index inclusion, links in both directions between the articles and their calculator hubs, and the featured images, alt text, social metadata, schema and actual image responses.
6. Report the three verified live URLs, calculator assignments, release commit and production outcome only after the full release gate passes. A scheduled trigger, completed run, saved draft, pushed commit or text-only page alone does not prove a complete publication.

## Failure and recovery

Every publisher run must return a visible result. If fewer than three articles go live, report **PUBLISHING INCOMPLETE**, the actual count, exact failing action/error and remaining work. Do not return an empty result or imply success.

The separate verifier checks the live batch and publisher state. Unless the owner has explicitly paused the programme, it may resume an unexpectedly disabled publisher and request one recovery run when no publisher run is already in progress. It must avoid overlapping runs and extra articles, and distinguish a requested recovery from a verified successful release. Report every unresolved shortfall. Lack of a chat reply is not an instruction to pause.

Tomorrow's next three planned topics after the 25 October release are **Personal Relief in Kenya Explained**, **How to Claim Tax Relief Through Payroll**, and **Documents Needed for PAYE Tax Relief**. They require current source checks before release; the general PAYE calculator is their primary hub unless the researched scope justifies a more specific calculator.

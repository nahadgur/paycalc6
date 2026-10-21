# Homepage and guide corrections — 21 October 2026

## Published scope

- Rewrote the six existing guide hubs using the shared server-rendered hub layout; retained URLs, their article lists and calculator links.
- Removed incorrect HELB tax deductions, double SHIF relief, extra pension allowance above the combined cap, unsupported savings totals and invented employer deadlines.
- Updated homepage title, calculation explanation, standard salary example, source link and review date. Added direct links to all six hubs and relevant calculator tasks.
- Corrected the shared calculator's SHIF/Housing Levy taxable-income deductions, combined NSSF/pension deduction limit, actual voluntary pension cash deduction and disability exemption treatment.
- Replaced unsupported car engine-size estimates and housing benefit caps with explicit payroll-confirmed taxable benefit inputs.
- Corrected all 39 salary landing-page calculations; generated their search descriptions from the calculated result instead of stale hardcoded amounts. Kept self-referencing canonical URLs.
- Rendered the net salary immediately instead of initially serving zero to non-JavaScript readers.
- Fixed guide breadcrumb structured data to point to each guide rather than its calculator.

## Validation

`node scripts/check-payroll.cjs` executes the actual UI and salary-page functions. It checks four independently calculated gross/net examples, pension deduction limits and cash payments, HELB treatment, disability exemption, declared benefits, zero pay and reverse salary calculations.

Run `npm run build` and `node scripts/check-blog-audit.cjs` after changes. All new hub and homepage internal destinations must exist in the generated route set.

## Scope limits

This is not an audit of every standalone tool. The P9 generator, standalone payslip generator, budget tool, tax calendar and iTax guide need their own review, including historical-period handling. The main calculator assumes resident employees, regular monthly cash pay and pensionable earnings equal to gross pay; special payroll cases require verified inputs. No ranking increase is promised.

## Sources

- https://www.kra.go.ke/individual/filing-paying/types-of-taxes/paye
- https://www.kra.go.ke/news-center/public-notices/2157-amendments-to-paye-computation-pursuant-to-the-tax-laws-amendment-act%2C-2024
- https://www.kra.go.ke/news-center/public-notices/2307-guidance-on-employer-obligations-in-applying-income-tax-deductions%2C-reliefs-and-exemptions
- NSSF Year 4 contribution notice linked on the statutory hubs.

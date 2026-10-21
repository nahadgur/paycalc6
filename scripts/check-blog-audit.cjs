// Run after npm run build: node scripts/check-blog-audit.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const articles = require('../lib/articles.json');
const redirects = require('../lib/blog-redirects.json');
const published = articles.filter(a => !a.draft);
assert.equal(published.length, 27);
assert.equal(articles.filter(a => a.draft).length, 4);
assert.equal(new Set(articles.map(a => a.slug)).size, articles.length);
const slugs = new Set(published.map(a => a.slug));
for (const a of published) {
  assert.equal(a.reviewedAt, '2026-10-21');
  assert(a.content.includes('Sources and review date'));
  for (const [, target] of a.content.matchAll(/href="\/blog\/([^"#?]+)/g)) assert(slugs.has(target), target);
  const rendered = fs.readFileSync(`.next/server/app/blog/${a.slug}.html`, 'utf8');
  assert(rendered.includes('21 October 2026'));
  assert(rendered.includes('2026-10-21'));
}
const sitemap = fs.readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
for (const r of redirects) {
  assert(!sitemap.includes(`<loc>https://www.payecalculator.co.ke${r.source}</loc>`));
  assert(slugs.has(r.destination.slice('/blog/'.length)));
  assert(!redirects.some(other => other.source === r.destination));
}
for (const a of articles.filter(a => a.draft)) assert(!sitemap.includes(`/blog/${a.slug}</loc>`));
// Independently checked monthly tax/net examples, using the published 8,333 band width.
const expected = [
  ['what-a-kes-50000-salary-actually-looks-like-after-tax-in-kenya', '5,845.85', '39,029.15'],
  ['take-home-pay-on-a-kes-100000-salary-in-kenya', '19,308.35', '70,441.65'],
  ['how-much-tax-do-you-pay-on-kes-150000-in-kenya', '33,526.85', '103,618.15'],
  ['the-real-cost-of-earning-kes-200000-in-kenya', '47,889.35', '137,130.65'],
];
for (const [slug, tax, net] of expected) {
  const content = articles.find(a => a.slug === slug).content;
  assert(content.includes(`<td>PAYE after personal relief</td><td>${tax}</td>`));
  assert(content.includes(`<td>Take-home pay</td><td>${net}</td>`));
}
console.log('PASS: 27 rendered articles, 5 redirects, 4 excluded drafts, metadata dates, internal links and salary examples.');

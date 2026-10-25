// Verify a real daily release after build, then repeat against production:
// node scripts/check-daily-publishing.cjs --date=2026-10-25 [--live]
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const articles = require('../lib/articles.json');
const plan = require('../docs/content-plan.json');

const BASE = 'https://www.payecalculator.co.ke';
const live = process.argv.includes('--live');
const date = process.argv.find(arg => arg.startsWith('--date='))?.slice(7)
  || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
const calculatorHubs = new Set([
  '/', '/nssf-calculator', '/net-gross-calculator', '/bonus-calculator',
  '/raise-calculator', '/employer-cost-calculator', '/mortgage-relief',
  '/salary-comparison', '/p9-generator', '/payslip-generator', '/tax-calendar',
]);
const pages = new Map();

function readPage(path) {
  if (!pages.has(path)) pages.set(path, (async () => {
    if (!live) {
      const file = path === '/sitemap.xml' ? 'sitemap.xml.body'
        : path === '/' ? 'index.html' : path.slice(1) + '.html';
      return fs.readFile('.next/server/app/' + file, 'utf8');
    }
    const response = await fetch(BASE + path, {
      headers: { 'Cache-Control': 'no-cache' },
      redirect: 'error',
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
    return response.text();
  })());
  return pages.get(path);
}

function hasLink(html, path) {
  return html.includes(`href="${path}"`) || html.includes(`href="${BASE}${path}"`);
}

function schemas(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => JSON.parse(match[1]));
}

async function main() {
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/, 'Use --date=YYYY-MM-DD');
  const batch = plan.batches.filter(batch => batch.date === date).flatMap(batch => batch.articles);
  assert.equal(batch.length, plan.dailyTarget, `${date}: expected ${plan.dailyTarget} release entries, found ${batch.length}`);
  assert.equal(new Set(batch.map(article => article.slug)).size, batch.length, 'Duplicate release entries');
  const datedArticles = articles.filter(article => !article.draft && article.publishedAt === date);
  assert.equal(datedArticles.length, plan.dailyTarget, `${date}: incorrect published article count`);
  const [index, sitemap] = await Promise.all([readPage('/blog'), readPage('/sitemap.xml')]);
  const results = await Promise.all(batch.map(async entry => {
    const article = datedArticles.find(article => article.slug === entry.slug);
    assert(article, `${entry.slug}: missing, draft or wrong publication date`);
    assert(calculatorHubs.has(entry.hub), `${entry.slug}: primary hub must be an existing calculator/tool`);
    assert(hasLink(article.content, entry.hub), `${entry.slug}: missing contextual calculator link`);
    assert(article.content.includes('Sources and review date'), `${entry.slug}: missing source section`);
    const path = '/blog/' + entry.slug;
    const [html, hub] = await Promise.all([readPage(path), readPage(entry.hub)]);
    assert(html.includes(article.title), `${entry.slug}: article content missing`);
    assert(html.includes(`rel="canonical" href="${BASE}${path}"`), `${entry.slug}: canonical mismatch`);
    assert(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html), `${entry.slug}: noindex`);
    const structured = schemas(html);
    const articleSchema = structured.find(schema => schema['@type'] === 'Article');
    const breadcrumb = structured.find(schema => schema['@type'] === 'BreadcrumbList');
    assert.equal(articleSchema?.datePublished, date, `${entry.slug}: schema publication date`);
    assert.equal(articleSchema?.dateModified, article.reviewedAt, `${entry.slug}: schema review date`);
    const parent = breadcrumb?.itemListElement?.at(-2);
    assert.equal(parent?.item, BASE + entry.hub, `${entry.slug}: calculator must be the breadcrumb parent`);
    assert(hasLink(html, entry.hub), `${entry.slug}: missing calculator CTA`);
    assert(hasLink(hub, path), `${entry.slug}: calculator does not link back`);
    assert(hasLink(index, path), `${entry.slug}: absent from blog index`);
    assert(sitemap.includes(`<loc>${BASE}${path}</loc>`), `${entry.slug}: absent from sitemap`);
    if (entry.supportingGuide) {
      const guide = await readPage(entry.supportingGuide);
      assert(hasLink(guide, path), `${entry.slug}: absent from supporting guide`);
    }
    return { title: article.title, url: BASE + path, calculatorHub: BASE + entry.hub };
  }));
  console.log(JSON.stringify({ status: 'PASS', mode: live ? 'production' : 'built', date, count: results.length, articles: results }, null, 2));
}

// Agent environments may require their configured outbound proxy. Node's
// fetch does not use it automatically unless this supported option is enabled.
const hasProxy = ['HTTPS_PROXY', 'HTTP_PROXY', 'https_proxy', 'http_proxy']
  .some(name => Boolean(process.env[name]));
if (live && hasProxy && process.allowedNodeEnvironmentFlags.has('--use-env-proxy')
  && !process.execArgv.includes('--use-env-proxy')) {
  const { spawnSync } = require('node:child_process');
  const child = spawnSync(process.execPath,
    [...process.execArgv, '--use-env-proxy', __filename, ...process.argv.slice(2)],
    { stdio: 'inherit' });
  if (child.error) console.error('PUBLISHING INCOMPLETE:', child.error.message);
  process.exitCode = child.status ?? 1;
} else {
  main().catch(error => {
    const cause = error.cause?.message ? ` (${error.cause.message})` : '';
    console.error('PUBLISHING INCOMPLETE:', error.message + cause);
    process.exitCode = 1;
  });
}

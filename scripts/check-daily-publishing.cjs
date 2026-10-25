// Verify a real daily release after build, then repeat against production:
// node scripts/check-daily-publishing.cjs --date=2026-10-25 [--live]
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const articles = require('../lib/articles.json');
const plan = require('../docs/content-plan.json');

const BASE = 'https://www.payecalculator.co.ke';
const FEATURED_IMAGES_REQUIRED_FROM = '2026-10-25';
const live = process.argv.includes('--live');
const date = process.argv.find(arg => arg.startsWith('--date='))?.slice(7)
  || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
const calculatorHubs = new Set([
  '/', '/nssf-calculator', '/net-gross-calculator', '/bonus-calculator',
  '/raise-calculator', '/employer-cost-calculator', '/mortgage-relief',
  '/salary-comparison', '/p9-generator', '/payslip-generator', '/tax-calendar',
]);
const pages = new Map();
const images = new Map();

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

function decodeHtml(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()];
    const code = entity[1].toLowerCase() === 'x'
      ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return code <= 0x10ffff ? String.fromCodePoint(code) : '';
  });
}

function elements(html, tag) {
  // Read actual rendered elements, not serialised component data in scripts.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  return [...markup.matchAll(new RegExp('<' + tag + '\\b[^>]*>', 'gi'))].map(match => {
    const attrs = {};
    for (const attr of match[0].matchAll(/([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      attrs[attr[1].toLowerCase()] = decodeHtml(attr[2] ?? attr[3]);
    }
    return attrs;
  });
}

function originalImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    let url = new URL(decodeHtml(value), BASE);
    // Next Image can render the original asset through its optimisation route.
    if (url.origin === BASE && url.pathname === '/_next/image') {
      const original = url.searchParams.get('url');
      if (!original) return null;
      url = new URL(original, BASE);
    }
    return url.origin + url.pathname;
  } catch {
    return null;
  }
}

function imageMime(bytes, label) {
  assert(bytes.length > 32, label + ': image is empty or too small');
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (bytes.toString('ascii', 0, 4) === 'RIFF'
    && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  assert.fail(label + ': expected JPEG, PNG or WebP bytes; HTML and other responses are not images');
}

function readImage(path) {
  if (!images.has(path)) images.set(path, (async () => {
    let bytes;
    let contentType;
    if (!live) {
      bytes = await fs.readFile('public' + path);
    } else {
      const response = await fetch(BASE + path, {
        headers: { 'Cache-Control': 'no-cache' },
        redirect: 'error',
        signal: AbortSignal.timeout(20000),
      });
      assert.equal(response.status, 200, path + ': image HTTP ' + response.status);
      contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      assert.match(contentType, /^image\//, path + ': response must have an image MIME type');
      bytes = Buffer.from(await response.arrayBuffer());
    }
    const detected = imageMime(bytes, path);
    const extension = path.split('.').at(-1).toLowerCase();
    const expected = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[extension];
    assert.equal(detected, expected, path + ': image signature does not match its file extension');
    if (live) assert.equal(contentType, detected, path + ': image MIME type does not match its bytes');
    return { bytes: bytes.length, contentType: detected };
  })());
  return images.get(path);
}

async function verifyFeaturedImage(article, html, index, articleSchema) {
  const label = article.slug;
  const path = article.featuredImage;
  assert.equal(typeof path, 'string', label + ': missing featuredImage');
  assert.match(path, /^\/blog-images\/[^?#]+\.(?:jpe?g|png|webp)$/i,
    label + ': featuredImage must be a self-hosted image path under /blog-images/');
  assert.equal(new URL(path, BASE).pathname, path, label + ': featuredImage must use a canonical asset path');
  const alt = article.featuredImageAlt;
  assert(typeof alt === 'string' && alt.trim().length >= 20 && alt.trim().split(/\s+/).length >= 4
    && alt.trim().toLowerCase() !== article.title.toLowerCase()
    && !/\b(?:placeholder|todo|tbd|lorem ipsum)\b/i.test(alt),
  label + ': featuredImageAlt must meaningfully describe the image, not repeat the title or a placeholder');
  assert(Number.isInteger(article.featuredImageWidth) && article.featuredImageWidth > 0,
    label + ': featuredImageWidth must be a positive integer');
  assert(Number.isInteger(article.featuredImageHeight) && article.featuredImageHeight > 0,
    label + ': featuredImageHeight must be a positive integer');
  const expected = BASE + path;
  const articleImages = elements(html, 'img').filter(image => originalImageUrl(image.src) === expected);
  assert(articleImages.length, label + ': featured image missing from rendered article');
  assert(articleImages.every(image => image.alt === alt), label + ': rendered featured-image alt mismatch');
  const indexImages = elements(index, 'img').filter(image => originalImageUrl(image.src) === expected);
  assert(indexImages.length, label + ': featured image missing from blog index');
  assert(indexImages.every(image => image.alt === alt), label + ': blog-index featured-image alt mismatch');
  const meta = elements(html, 'meta');
  function metaValue(name) {
    const value = meta.find(item => item.property === name || item.name === name)?.content;
    assert(value, label + ': missing ' + name + ' metadata');
    return value;
  }
  assert.equal(originalImageUrl(metaValue('og:image')), expected, label + ': Open Graph image mismatch');
  assert.equal(originalImageUrl(metaValue('twitter:image')), expected, label + ': Twitter image mismatch');
  assert.equal(metaValue('og:image:alt'), alt, label + ': Open Graph image alt mismatch');
  assert.equal(metaValue('twitter:image:alt'), alt, label + ': Twitter image alt mismatch');
  assert.equal(Number(metaValue('og:image:width')), article.featuredImageWidth, label + ': Open Graph image width mismatch');
  assert.equal(Number(metaValue('og:image:height')), article.featuredImageHeight, label + ': Open Graph image height mismatch');
  assert.equal(metaValue('twitter:card'), 'summary_large_image', label + ': Twitter must use the large-image card');
  const schemaImage = Array.isArray(articleSchema?.image) ? articleSchema.image[0] : articleSchema?.image;
  const schemaUrl = typeof schemaImage === 'string' ? schemaImage : schemaImage?.url || schemaImage?.contentUrl;
  assert.equal(originalImageUrl(schemaUrl), expected, label + ': Article schema featured image mismatch');
  await readImage(path);
  return expected;
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
    const featuredImage = date >= FEATURED_IMAGES_REQUIRED_FROM
      ? await verifyFeaturedImage(article, html, index, articleSchema) : undefined;
    return { title: article.title, url: BASE + path, calculatorHub: BASE + entry.hub, featuredImage };
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

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const expectedOrigin = process.env.SITE_URL || 'https://geo.nmc-interactive.com';

const failures = [];
const articleImages = new Map();

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  const filePath = resolve(dist, relativePath);
  assert(existsSync(filePath), `Missing build artifact: dist/${relativePath}`);
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function validateArticleImages(directory = resolve(root, 'src/content/docs')) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      validateArticleImages(filePath);
      continue;
    }
    if (!/\.mdx?$/.test(entry.name)) continue;

    const content = readFileSync(filePath, 'utf8');
    const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const image = frontmatter?.[1].match(/^image:\s*["'](.*?)["']\s*$/m)?.[1];
    const label = relative(root, filePath);
    assert(Boolean(image), `${label} is missing its page-specific image.`);
    if (!image) continue;

    assert(!articleImages.has(image), `${label} reuses article image ${image} from ${articleImages.get(image)}.`);
    articleImages.set(image, label);
    assert(
      existsSync(resolve(root, 'public', image.replace(/^\/+/, ''))),
      `${label} references a missing image asset: ${image}`
    );
  }
}

const requiredArtifacts = [
  'index.html',
  'sitemap/index.html',
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
  'llms-full.txt',
  '404.html',
  '_redirects',
  'geo-fundamentals/what-is-geo/index.html',
];

for (const artifact of requiredArtifacts) {
  assert(existsSync(resolve(dist, artifact)), `Missing build artifact: dist/${artifact}`);
}

validateArticleImages();

const sitemapXml = read('sitemap.xml');
const robotsTxt = read('robots.txt');
const llmsTxt = read('llms.txt');
const llmsFullTxt = read('llms-full.txt');
const redirectsFile = read('_redirects');
const notFoundPage = read('404.html');
const tutorialsPage = read('sitemap/index.html');
const sampleArticle = read('geo-fundamentals/what-is-geo/index.html');
const wranglerToml = readFileSync(resolve(root, 'wrangler.toml'), 'utf8');

assert(sitemapXml.includes('<urlset'), 'sitemap.xml is not a valid urlset document.');
assert(sitemapXml.includes('<lastmod>'), 'sitemap.xml is missing <lastmod> freshness signals.');
assert(robotsTxt.includes('Sitemap:'), 'robots.txt is missing the Sitemap directive.');
for (const aiCrawler of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Baiduspider', 'Bytespider', 'Sogou web spider']) {
  assert(robotsTxt.includes(`User-agent: ${aiCrawler}`), `robots.txt is missing an explicit rule for ${aiCrawler}.`);
}
assert(llmsTxt.startsWith('# '), 'llms.txt must start with an H1 (llmstxt.org format).');
assert(llmsTxt.includes('> Tutorial-first knowledge base'), 'llms.txt is missing the blockquote summary (llmstxt.org format).');
assert(llmsTxt.includes('## Primary Entry Points'), 'llms.txt is missing the Primary Entry Points section.');
assert(llmsFullTxt.includes('/geo-fundamentals/what-is-geo/geo-definition-framework/'), 'llms-full.txt is missing detail-level URLs.');
assert(redirectsFile.includes('/llm.txt') && redirectsFile.includes('301'), '/llm.txt → /llms.txt 301 redirect is missing from _redirects.');
assert(notFoundPage.includes('Error 404'), '404.html is missing or incomplete.');
assert(tutorialsPage.includes('HTML Sitemap'), 'Tutorials sitemap page was not generated correctly.');
assert(sampleArticle.includes('application/ld+json'), 'Sample article page is missing JSON-LD.');
assert(sampleArticle.includes('rel="canonical"'), 'Sample article page is missing a canonical link.');
assert(sampleArticle.includes('BreadcrumbList'), 'Sample article page is missing BreadcrumbList JSON-LD.');
assert(sampleArticle.includes('datePublished'), 'Sample article page is missing datePublished JSON-LD.');
assert(!tutorialsPage.includes('/docs/strategies'), 'Tutorials sitemap still references stale /docs/strategies routes.');
assert(!tutorialsPage.includes('/docs/advanced'), 'Tutorials sitemap still references stale /docs/advanced routes.');
assert(wranglerToml.includes('name = "geo"'), 'wrangler.toml is not configured for the expected Cloudflare Pages property name "geo".');

assert(
  sitemapXml.includes(expectedOrigin),
  `sitemap.xml is not using the expected production origin: ${expectedOrigin}`
);
assert(
  robotsTxt.includes(expectedOrigin),
  `robots.txt is not using the expected production origin: ${expectedOrigin}`
);
assert(
  sampleArticle.includes(expectedOrigin),
  `Sample article page is not using the expected production origin: ${expectedOrigin}`
);

if (failures.length > 0) {
  console.error('Site validation failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Site validation passed.');

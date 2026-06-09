import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const expectedOrigin = process.env.SITE_URL || 'https://geo.nmc-interactive.com';

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  const filePath = resolve(dist, relativePath);
  assert(existsSync(filePath), `Missing build artifact: dist/${relativePath}`);
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

const requiredArtifacts = [
  'index.html',
  'sitemap/index.html',
  'sitemap.xml',
  'robots.txt',
  'llms.txt',
  'geo-fundamentals/what-is-geo/index.html',
];

for (const artifact of requiredArtifacts) {
  assert(existsSync(resolve(dist, artifact)), `Missing build artifact: dist/${artifact}`);
}

const sitemapXml = read('sitemap.xml');
const robotsTxt = read('robots.txt');
const llmsTxt = read('llms.txt');
const tutorialsPage = read('sitemap/index.html');
const sampleArticle = read('geo-fundamentals/what-is-geo/index.html');
const wranglerToml = readFileSync(resolve(root, 'wrangler.toml'), 'utf8');

assert(sitemapXml.includes('<urlset'), 'sitemap.xml is not a valid urlset document.');
assert(robotsTxt.includes('Sitemap:'), 'robots.txt is missing the Sitemap directive.');
assert(llmsTxt.includes('## Canonical Pillars'), 'llms.txt is missing the canonical pillar section.');
assert(tutorialsPage.includes('HTML Sitemap'), 'Tutorials sitemap page was not generated correctly.');
assert(sampleArticle.includes('application/ld+json'), 'Sample article page is missing JSON-LD.');
assert(sampleArticle.includes('rel="canonical"'), 'Sample article page is missing a canonical link.');
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

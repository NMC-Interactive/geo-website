// Parity check between live content frontmatter URLs and docs/articles/SITEMAP.md.
// Usage: node scripts/check-parity.mjs

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const files = execFileSync('find', ['src/content/docs', '-name', '*.md'], { cwd: root, encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

const live = new Set();
const spokes = new Map();
const detailsPerSpoke = new Map();

for (const file of files) {
  const content = readFileSync(resolve(root, file), 'utf8');
  const url = content.match(/^url:\s*"([^"]+)"/m)?.[1];
  if (url) live.add(url);
  const spoke = content.match(/^spoke:\s*"([^"]+)"/m)?.[1];
  if (spoke) spokes.set(spoke, content.match(/^parent_pillar:\s*"([^"]+)"/m)?.[1] ?? '');
  const parentSpoke = content.match(/^parent_spoke:\s*"([^"]+)"/m)?.[1];
  if (parentSpoke) detailsPerSpoke.set(parentSpoke, (detailsPerSpoke.get(parentSpoke) ?? 0) + 1);
}

const sitemapMd = readFileSync(resolve(root, 'docs/articles/SITEMAP.md'), 'utf8');
const planned = new Set(
  [...sitemapMd.matchAll(/`(\/[a-zA-Z0-9\-]+\/?(?:[a-zA-Z0-9\-]+\/?)*)`/g)].map((m) => m[1])
);

const missing = [...planned].filter((u) => !live.has(u));
const extra = [...live].filter((u) => !planned.has(u));

console.log(`live content pages: ${live.size}`);
console.log(`URLs listed in SITEMAP.md: ${planned.size}`);
console.log(`planned but missing from content: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`content URLs not listed in SITEMAP.md: ${extra.length ? extra.join(', ') : 'none'}`);
console.log('spokes:', spokes.size);
console.log('details per spoke:');
for (const [spoke, count] of [...detailsPerSpoke.entries()].sort()) {
  console.log(`  ${spoke}: ${count}`);
}
const odd = [...detailsPerSpoke.entries()].filter(([, count]) => count !== 3);
console.log(odd.length ? `spokes without exactly 3 details: ${odd.map(([s]) => s).join(', ')}` : 'every spoke has exactly 3 details');

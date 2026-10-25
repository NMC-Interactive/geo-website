// Backfill pubDate/updatedDate frontmatter for content files from git history.
// pubDate    = first commit that touched the file (oldest)
// updatedDate = last commit that touched the file (newest)
// Existing frontmatter values are never overwritten (idempotent).
//
// Usage: node scripts/backfill-dates.mjs [--write]
// Without --write it prints a dry-run diff summary.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = resolve(root, 'src/content/docs');
const write = process.argv.includes('--write');

function collectMarkdown(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) collectMarkdown(path, out);
    else if (/\.mdx?$/.test(entry.name)) out.push(path);
  }
  return out;
}

function gitDates(file) {
  const rel = relative(root, file);
  const lines = execFileSync('git', ['log', '--follow', '--format=%cI', '--', rel], {
    cwd: root,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean);
  if (lines.length === 0) return null;
  return {
    pub: lines[lines.length - 1].slice(0, 10),
    updated: lines[0].slice(0, 10),
  };
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { exists: false, body: content };
  return { exists: true, frontmatter: match[1], rest: content.slice(match[0].length) };
}

const files = collectMarkdown(contentDir);
let changed = 0;
let failed = 0;
const samples = [];

for (const file of files) {
  const dates = gitDates(file);
  if (!dates) {
    console.error(`no git history for ${relative(root, file)}`);
    failed++;
    continue;
  }
  const original = readFileSync(file, 'utf8');
  const { exists, frontmatter, rest } = parseFrontmatter(original);
  if (!exists) {
    console.error(`no frontmatter in ${relative(root, file)}`);
    failed++;
    continue;
  }

  let fm = frontmatter;
  const lines = [];
  if (!/^pubDate:\s*\S/m.test(fm)) lines.push(`pubDate: ${dates.pub}`);
  if (!/^updatedDate:\s*\S/m.test(fm)) lines.push(`updatedDate: ${dates.updated}`);
  if (lines.length === 0) continue;

  // Append new keys at the end of the frontmatter block (before closing ---).
  fm = fm.replace(/\s*$/, '') + '\n' + lines.join('\n');
  const next = `---\n${fm}\n---${rest}`;
  if (write) writeFileSync(file, next);
  changed++;
  samples.push(`${relative(root, file)}: pub=${dates.pub} updated=${dates.updated}`);
}

console.log(write ? `Backfilled dates in ${changed} files.` : `[dry-run] Would backfill dates in ${changed} files.`);
for (const sample of samples.slice(0, 12)) console.log(`  ${sample}`);
if (failed) {
  console.error(`${failed} files failed.`);
  process.exit(1);
}

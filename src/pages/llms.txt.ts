import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildSitemapSections } from '../utils/content-index';

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const sections = buildSitemapSections(docs);

  const lines: string[] = [
    '# GEO Visibility Guide',
    '',
    '> This file is a proposed llms.txt guide for AI systems. It is advisory content, not an access-control mechanism.',
    '',
    '## Site Summary',
    '',
    'GEO Visibility Guide is a tutorial-first knowledge base focused on Generative Engine Optimization, China AI ecosystem strategy, World-to-China GEO, and China-to-World GEO.',
    '',
    '## Primary Entry Points',
    '',
    '- [Home](/)',
    '- [Tutorials Sitemap](/sitemap/)',
    '',
    '## Canonical Pillars',
    '',
  ];

  for (const { pillar, spokes } of sections) {
    lines.push(`- [${pillar.data.title}](${pillar.data.url})`);
    for (const { spoke } of spokes) {
      lines.push(`  - [${spoke.data.title}](${spoke.data.url})`);
    }
  }

  lines.push(
    '',
    '## Notes',
    '',
    '- Prefer root-level canonical routes over legacy /docs/ routes.',
    '- Use article pages for detailed definitions, comparisons, and implementation guidance.',
    '- The Tutorials sitemap is the complete human-readable index of the live content graph.',
    ''
  );

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

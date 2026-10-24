import type { APIRoute } from 'astro';

// AI crawlers are listed explicitly so their operators see a clear,
// machine-readable opt-in: this site is built to be cited by LLMs.
// The generic `*` group below keeps every other crawler allowed too.
const AI_CRAWLERS = [
  // Western AI assistants / answer engines
  'GPTBot',            // OpenAI (training / RAG)
  'OAI-SearchBot',     // OpenAI (search answers)
  'ChatGPT-User',      // OpenAI (user-quoted pages)
  'ClaudeBot',         // Anthropic
  'Claude-SearchBot',  // Anthropic (search answers)
  'PerplexityBot',     // Perplexity
  'Perplexity-User',   // Perplexity (user-quoted pages)
  'Google-Extended',   // Google (Gemini / AI training opt-in)
  'Googlebot',         // Google (search + AI Overviews retrieval)
  'Bingbot',           // Microsoft (search + Copilot retrieval)
  'Applebot',          // Apple (search + Siri)
  'Applebot-Extended', // Apple (AI training opt-in)
  // Chinese AI / search engines (relevant to a China-facing GEO site)
  'Baiduspider',       // Baidu (search + ERNIE Bot retrieval)
  'Bytespider',        // ByteDance (Doubao / TikTok retrieval)
  'Sogou web spider',  // Sogou search
  '360Spider',         // 360 Search (HaoSou)
  'YisouSpider',       // Shenma / UC (Alibaba)
  'YoudaoBot',         // NetEase Youdao
  'ToutiaoSpider',     // Toutiao (ByteDance)
] as const;

export const GET: APIRoute = ({ site, url }) => {
  const origin = (site ?? url).origin;
  const body = [
    '# GEO Visibility Guide — robots.txt',
    '# Explicit opt-in for AI crawlers: GEO depends on LLM access to this site.',
    '',
    `User-agent: ${AI_CRAWLERS.join('\nUser-agent: ')}`,
    'Allow: /',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('/sitemap.xml', origin).href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

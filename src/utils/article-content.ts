import type { CollectionEntry } from 'astro:content';
import { getAuthorById, ORGANIZATION_NAME } from './site';

type DocEntry = CollectionEntry<'docs'>;

export interface SourceItem {
  label: string;
  url: string;
  type?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

const KNOWN_ENTITIES = [
  'ChatGPT',
  'Perplexity',
  'Google Gemini',
  'DeepSeek',
  'Doubao',
  'Baidu',
  'WeChat',
  'LinkedIn',
  'Google AI Overviews',
  'structured data',
  'entity authority',
  'answer retrieval',
];

export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^>+\s?/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_#>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractSummary(markdown: string, fallbackTitle?: string): string {
  const paragraphs = markdown
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !part.startsWith('#'))
    .filter((part) => !part.startsWith('---'));

  const candidate = paragraphs.find((part) => part.length > 120) ?? paragraphs[0] ?? fallbackTitle ?? '';
  const plain = markdownToPlainText(candidate);
  if (plain.length <= 280) return plain;

  const shortened = plain.slice(0, 280);
  const sentenceBoundary = Math.max(shortened.lastIndexOf('. '), shortened.lastIndexOf('? '), shortened.lastIndexOf('! '));
  if (sentenceBoundary > 140) {
    return shortened.slice(0, sentenceBoundary + 1).trim();
  }

  const wordBoundary = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, wordBoundary > 0 ? wordBoundary : 280).trim()}...`;
}

export function estimateReadTime(markdown: string): string {
  const words = markdownToPlainText(markdown).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function formatDate(date?: Date): string | undefined {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}

export function inferEntities(entry: DocEntry): string[] {
  const body = entry.body ?? '';
  const found = new Set<string>();
  found.add(entry.data.title.replace(/:.+$/, '').trim());
  if (entry.data.cluster) found.add(entry.data.cluster);

  for (const entity of KNOWN_ENTITIES) {
    if (body.toLowerCase().includes(entity.toLowerCase())) {
      found.add(entity);
    }
  }

  return Array.from(found).slice(0, 8);
}

export function getSchemaTypes(entry: DocEntry, hasFaq: boolean): string {
  return hasFaq ? 'Article + Organization + FAQPage' : 'Article + Organization';
}

export function buildArticleJsonLd(input: {
  entry: DocEntry;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  published?: string;
  updated?: string;
  faq?: FaqItem[];
}) {
  const author = getAuthorById(input.entry.data.author);
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.entry.data.title,
    description: input.description,
    mainEntityOfPage: input.canonicalUrl,
    url: input.canonicalUrl,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.profiles.linkedin.url,
      sameAs: Object.values(author.profiles).map((profile) => profile.url),
    },
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
    },
    image: input.imageUrl,
    datePublished: input.published,
    dateModified: input.updated ?? input.published,
  };

  if (!input.faq?.length) return [article];

  return [
    article,
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: input.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];
}

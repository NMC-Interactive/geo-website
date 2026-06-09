import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    url: z.string(),
    cluster: z.string().optional(),
    // Pillar tier
    pillar: z.number().optional(),
    related_pillars: z.array(z.string()).optional(),
    related_spokes: z.array(z.string()).optional(),
    // Spoke tier
    spoke: z.string().optional(),
    parent_pillar: z.string().optional(),
    // Detail tier
    detail: z.string().optional(),
    parent_spoke: z.string().optional(),
    // Optional enrichment the agent can add
    description: z.string().optional(),
    excerpt: z.string().optional(),
    summary: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    readTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
    entities: z.array(z.string()).optional(),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string(),
      type: z.string().optional(),
    })).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};

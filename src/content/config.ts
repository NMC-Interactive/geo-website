import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
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
    pubDate: z.coerce.date().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    readTime: z.string().optional(),
  }),
});

export const collections = {
  docs: docsCollection,
};

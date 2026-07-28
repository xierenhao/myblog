import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['ai', 'football', 'fragments']),
    excerpt: z.string(),
    subtitle: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    coverIcon: z.string().optional(),
    coverTimeline: z.number().optional(),
    coverKeyword: z.string().optional(),
    coverData: z.array(z.number()).optional(),
    coverDiagram: z.string().optional(),
    coverMotif: z.enum(['loop', 'viewfinder', 'strata', 'curve', 'multiline', 'weeknum', 'keyword', 'firstChar']).optional(),
    coverMultiline: z.array(z.array(z.number())).optional(),
    coverWeek: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { posts };

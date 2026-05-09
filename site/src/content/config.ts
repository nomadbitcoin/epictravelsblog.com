import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Epic Travels Blog'),
    tags: z.array(z.string()).min(0).max(10),
    category: z.enum(['destination', 'guide', 'tips', 'adventure']),
    featured_image: z.object({
      src: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number(),
    }).optional(),
    affiliate_disclosure: z.boolean().default(false),
    draft: z.boolean().default(false),
    targetKeyword: z.string().optional(),
  }),
});

export const collections = {
  'posts': postsCollection,
};

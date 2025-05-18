import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blogs = defineCollection({
  loader: glob({ base: './src/content/blogs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    alt: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    keywords: z.array(z.string()),
    category: z.string(),
  }),
});

export const collections = { blogs };

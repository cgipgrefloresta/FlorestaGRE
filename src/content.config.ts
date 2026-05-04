import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { materialSchema, topicSchema } from './lib/contentSchemas';

const topicsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/topics" }),
  schema: topicSchema,
});

const materialsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/materials" }),
  schema: materialSchema,
});

export const collections = {
  topics: topicsCollection,
  materials: materialsCollection,
};

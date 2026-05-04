import { z } from 'zod';

const downloadUrlSchema = z.string().refine((value) => {
  if (value.startsWith('/files/')) {
    return true;
  }

  return z.string().url().safeParse(value).success;
}, {
  message: 'downloadUrl precisa ser um caminho local em /files/ ou uma URL válida.',
});

export const topicSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(8),
  summary: z.string().min(3).optional(),
  order: z.number().int().nonnegative().default(0),
  status: z.enum(['draft', 'published']).default('published'),
});

export const materialSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  topicId: z.string().min(2),
  subcategories: z.array(z.string().min(2)).default([]),
  tags: z.array(z.string().min(2)).default([]),
  thumbnail: z.string().startsWith('/images/materials/').optional(),
  downloadUrl: downloadUrlSchema,
  publishedDate: z.coerce.date(),
  year: z.number().int().min(2000).max(2100).optional(),
  edition: z.string().regex(/^\d{4}(?:\.\d+)?$/).optional(),
  subcategory: z.string().min(2).optional(),
  order: z.number().int().nonnegative().default(0),
  published: z.boolean().default(true),
  sourceName: z.string().min(2).optional(),
  sourceType: z.string().min(2).optional(),
}).refine((data) => data.summary || data.description, {
  message: 'Material precisa ter summary ou description.',
});

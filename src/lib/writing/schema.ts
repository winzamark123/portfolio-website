import { z } from 'zod';

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_DOCUMENT_BYTES = 512 * 1024;
export const idSchema = z.string().uuid();
export const slugSchema = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,119}$/);
const dateSchema = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}, 'Choose a valid date.');

export const contentSchema = z.object({
  title: z.string().max(200),
  slug: z.union([slugSchema, z.literal('')]),
  date: z.union([dateSchema, z.literal('')]),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  markdown: z.string().max(MAX_DOCUMENT_BYTES),
});

export const publicationSchema = z.object({
  path: z.string().regex(/^public\/blog\/[^/]+\.mdx?$/),
  fileSha: z.string().regex(/^[a-f0-9]{40}$/),
  commitSha: z.string().regex(/^[a-f0-9]{40}$/),
  revision: idSchema,
  publishedAt: z.string().datetime(),
});

export const draftSchema = contentSchema.extend({
  id: idSchema,
  revision: idSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publication: publicationSchema.nullable(),
});

export const savedDraftSchema = z.object({
  draft: draftSchema,
  etag: z.string().min(1),
});

export const draftListSchema = z.array(
  draftSchema.pick({
    id: true,
    title: true,
    updatedAt: true,
    revision: true,
    publication: true,
  })
);

export const saveRequestSchema = z.object({
  content: contentSchema,
  etag: z.string().min(1),
});

export const publicationStatusSchema = z.object({
  state: z.enum(['pending', 'success', 'failure', 'unknown']),
  url: z.string().url(),
});

export type Draft = z.infer<typeof draftSchema>;
export type DraftContent = z.infer<typeof contentSchema>;
export type SavedDraft = z.infer<typeof savedDraftSchema>;

export function slugify({ title }: { title: string }) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

export function postSlug({ filename }: { filename: string }) {
  return filename
    .replace(/\.(mdx|md)$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function draftContent({ draft }: { draft: DraftContent }) {
  return contentSchema.parse(draft);
}

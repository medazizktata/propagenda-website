import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens');

// Forms here submit every field as a stringified value (see ServiceEditorForm's
// submit()), including booleans as the literal strings "true"/"false" -- so
// z.coerce.boolean() would be wrong (Boolean("false") is true). Compare the
// string explicitly instead.
const stringBoolean = z
  .string()
  .transform((value) => value === 'true')
  .default(false);

export const videoEditorSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, 'Title is required').max(200),
  category: z.string().trim().min(1, 'Category is required').max(120),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isShowreel: stringBoolean,
  src: z.string().trim(),
  poster: z.string().trim().min(1, 'Poster is required'),
  orientation: z.enum(['landscape', 'portrait']),
  width: z.coerce.number().int().min(1).max(10000),
  height: z.coerce.number().int().min(1).max(10000),
  duration: z.string().trim().max(20),
  client: z.string().trim().max(200),
  description: z.string().trim().max(2000),
  placeholder: stringBoolean,
});

export type VideoEditorInput = z.infer<typeof videoEditorSchema>;

export function buildVideoPayload(input: VideoEditorInput) {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    sort_order: input.sortOrder,
    is_showreel: input.isShowreel ? 1 : 0,
    src: input.src,
    poster: input.poster,
    orientation: input.orientation,
    width: input.width,
    height: input.height,
    duration: input.duration || null,
    client: input.client || null,
    description: input.description || null,
    placeholder: input.placeholder ? 1 : 0,
  };
}

export function emptyVideoEditorValues(): VideoEditorInput {
  return {
    slug: '',
    title: '',
    category: '',
    sortOrder: 0,
    isShowreel: false,
    src: '',
    poster: '',
    orientation: 'landscape',
    width: 1280,
    height: 720,
    duration: '',
    client: '',
    description: '',
    placeholder: false,
  };
}

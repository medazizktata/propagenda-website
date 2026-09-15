/**
 * D1 stores JSON columns as TEXT (see d1/migrations/0001_cms_content_tables.sql).
 * The existing `map*Row` functions in lib/cms/mappers.ts were written against
 * Supabase's shape, where jsonb columns already deserialize to JS values — parsing
 * these columns back to objects here lets that mapper layer stay unchanged.
 */
export function parseJsonColumns<T extends Record<string, unknown>>(
  row: Record<string, unknown>,
  jsonColumns: readonly (keyof T)[],
): T {
  const result: Record<string, unknown> = { ...row };
  for (const col of jsonColumns) {
    const value = result[col as string];
    if (typeof value === 'string') {
      result[col as string] = JSON.parse(value);
    }
  }
  return result as T;
}

export const CASE_STUDY_JSON_COLUMNS = [
  'scope_items', 'gallery', 'seo', 'deliverables', 'results', 'quote', 'accent',
] as const;

export const SERVICE_JSON_COLUMNS = [
  'scope_items', 'gallery', 'seo', 'tiers', 'event_checklist', 'extended_bullets',
  'related_work', 'tertiary_cta', 'hub',
] as const;

/** Inverse of parseJsonColumns, for admin writes: stringify the columns D1
    stores as TEXT before INSERT/UPDATE, leaving already-scalar columns (and
    null) untouched. */
export function stringifyJsonColumns<T extends Record<string, unknown>>(
  payload: T,
  jsonColumns: readonly (keyof T)[],
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...payload };
  for (const col of jsonColumns) {
    const value = result[col as string];
    if (value !== null && value !== undefined && typeof value !== 'string') {
      result[col as string] = JSON.stringify(value);
    }
  }
  return result;
}

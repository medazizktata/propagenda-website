/**
 * One-time follow-up to scripts/upload-media-to-r2.sh: rewrites the local-path
 * media references already sitting in D1 (case_studies.hero_image/gallery,
 * services.gallery + hub.image/preview, video_projects.src/poster) into the
 * relative R2 object keys the upload script actually used, so
 * lib/r2/resolveMediaUrl.ts's "no leading slash => R2 key" rule applies.
 *
 * Local path prefix -> R2 key prefix (must match upload-media-to-r2.sh exactly):
 *   /images/work/...      -> case-study-media/...
 *   /images/clients/...   -> clients/...
 *   /images/portfolio/... -> portfolio/...
 *   /videos/...           -> videos/...
 *
 * Writes the generated SQL to a file for review -- does not execute it. Apply
 * with `wrangler d1 execute propagenda-cms --remote --file <path>` after
 * checking it looks right.
 */
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const PREFIX_MAP: [string, string][] = [
  ['/images/work/', 'case-study-media/'],
  ['/images/clients/', 'clients/'],
  ['/images/portfolio/', 'portfolio/'],
  ['/images/video-posters/', 'video-posters/'],
  ['/videos/', 'videos/'],
];

function rewrite(path: string): string {
  for (const [from, to] of PREFIX_MAP) {
    if (path.startsWith(from)) return to + path.slice(from.length);
  }
  return path; // leave unrecognized paths untouched rather than guess
}

function rewriteDeep(value: unknown): unknown {
  if (typeof value === 'string') return rewrite(value);
  if (Array.isArray(value)) return value.map(rewriteDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewriteDeep(v)]));
  }
  return value;
}

function d1Json(remote: boolean, sql: string): any {
  const flag = remote ? '--remote' : '--local';
  const out = execSync(
    `npx wrangler d1 execute propagenda-cms ${flag} --json --command ${JSON.stringify(sql)}`,
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 50 },
  );
  return JSON.parse(out);
}

/** SQL string literal, or the literal NULL for a null/undefined JS value. */
function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return `'${text.replace(/'/g, "''")}'`;
}

function main() {
  const remote = process.argv.includes('--remote');
  const lines: string[] = [];

  const caseStudies = d1Json(remote, 'SELECT id, hero_image, gallery FROM case_studies;')[0].results;
  for (const row of caseStudies) {
    const heroImage = row.hero_image ? rewrite(row.hero_image) : null;
    const gallery = rewriteDeep(JSON.parse(row.gallery));
    lines.push(
      `UPDATE case_studies SET hero_image = ${sqlLiteral(heroImage)}, gallery = ${sqlLiteral(gallery)} WHERE id = ${row.id};`,
    );
  }

  const services = d1Json(remote, 'SELECT id, gallery, hub FROM services;')[0].results;
  for (const row of services) {
    const gallery = rewriteDeep(JSON.parse(row.gallery));
    const hub = row.hub ? rewriteDeep(JSON.parse(row.hub)) : null;
    lines.push(`UPDATE services SET gallery = ${sqlLiteral(gallery)}, hub = ${sqlLiteral(hub)} WHERE id = ${row.id};`);
  }

  const videos = d1Json(remote, 'SELECT id, src, poster FROM video_projects;')[0].results;
  for (const row of videos) {
    lines.push(
      `UPDATE video_projects SET src = ${sqlLiteral(rewrite(row.src))}, poster = ${sqlLiteral(rewrite(row.poster))} WHERE id = ${row.id};`,
    );
  }

  writeFileSync('d1/rewrite-media-keys.sql', lines.join('\n') + '\n');
  console.log(`Wrote d1/rewrite-media-keys.sql (${lines.length} statements) against ${remote ? 'REMOTE' : 'LOCAL'}.`);
}

main();

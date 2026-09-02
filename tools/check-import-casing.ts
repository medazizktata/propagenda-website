/**
 * Case-sensitive import path check.
 *
 * macOS/APFS is usually case-insensitive, so `@/components/ui/button` resolves
 * to `Button.tsx` locally and hides Linux/CF build failures. This walks tracked
 * source files and fails if an `@/` import does not match a real path byte-for-byte.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC_ROOTS = ['app', 'components', 'hooks', 'lib', 'content', 'tools', 'scripts'].map((d) =>
  join(ROOT, d),
);

const IMPORT_RE =
  /(?:from|import)\s*(?:\(\s*)?['"](@\/[^'"]+)['"]|require\(\s*['"](@\/[^'"]+)['"]\s*\)/g;

const EXT_CANDIDATES = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
const INDEX_CANDIDATES = [
  '/index.ts',
  '/index.tsx',
  '/index.js',
  '/index.jsx',
  '/index.mjs',
];

function collectFiles(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === '.open-next') continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) collectFiles(path, acc);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(path)) acc.push(path);
  }
  return acc;
}

/** Resolve an `@/` import to an absolute path using exact-case filesystem lookups. */
function resolveAtImport(specifier: string): string | null {
  const rel = specifier.slice(2); // drop "@/"
  const base = join(ROOT, rel);

  for (const ext of EXT_CANDIDATES) {
    const candidate = `${base}${ext}`;
    if (fileExistsExact(candidate)) return candidate;
  }
  for (const idx of INDEX_CANDIDATES) {
    const candidate = `${base}${idx}`;
    if (fileExistsExact(candidate)) return candidate;
  }
  return null;
}

/**
 * `existsSync` is case-insensitive on macOS. Walk each path segment and require
 * the directory listing to contain the exact spelling.
 */
function fileExistsExact(absPath: string): boolean {
  const normalized = resolve(absPath);
  if (!normalized.startsWith(ROOT + sep) && normalized !== ROOT) return false;

  const parts = relative(ROOT, normalized).split(sep).filter(Boolean);
  let cursor = ROOT;
  for (const part of parts) {
    let entries: string[];
    try {
      entries = readdirSync(cursor);
    } catch {
      return false;
    }
    if (!entries.includes(part)) return false;
    cursor = join(cursor, part);
  }
  try {
    return statSync(cursor).isFile() || statSync(cursor).isDirectory();
  } catch {
    return false;
  }
}

function extractImports(source: string): string[] {
  const found = new Set<string>();
  for (const match of source.matchAll(IMPORT_RE)) {
    const spec = match[1] ?? match[2];
    if (spec) found.add(spec);
  }
  return [...found];
}

function main() {
  const files = SRC_ROOTS.flatMap((dir) => collectFiles(dir));
  const errors: string[] = [];

  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const relFile = relative(ROOT, file);
    for (const spec of extractImports(source)) {
      if (!resolveAtImport(spec)) {
        errors.push(`${relFile}: cannot resolve "${spec}" (case-sensitive)`);
      }
    }
  }

  if (errors.length) {
    console.error(`❌ Case-sensitive import check failed (${errors.length}):\n`);
    for (const e of errors) console.error(`  ${e}`);
    console.error(
      '\nLinux/CF builds are case-sensitive. Rename the file to match the import, or fix the import path.',
    );
    process.exit(1);
  }

  console.log(`✓ Case-sensitive imports OK (${files.length} files scanned)`);
}

main();

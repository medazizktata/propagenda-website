import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PATHS } from './config';
import { isMain } from './lib/is-main';
import type { CheckResult } from './lib/runner';

const FORBIDDEN_IN_CONTENT = [
  {
    pattern: '@/lib/supabase/server',
    hint: 'Use createSupabaseStaticClient from @/lib/supabase/static for build-safe public CMS reads.',
  },
  {
    pattern: "from 'next/headers'",
    hint: 'Dynamic request APIs (cookies, headers) break generateStaticParams and other build-time reads.',
  },
  {
    pattern: 'from "next/headers"',
    hint: 'Dynamic request APIs (cookies, headers) break generateStaticParams and other build-time reads.',
  },
];

function collectFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) collectFiles(path, acc);
    else if (/\.(ts|tsx)$/.test(path)) acc.push(path);
  }
  return acc;
}

function checkPatterns(file: string, patterns: typeof FORBIDDEN_IN_CONTENT): string[] {
  const source = readFileSync(file, 'utf8');
  const rel = relative(PATHS.root, file);
  return patterns.flatMap(({ pattern, hint }) =>
    source.includes(pattern) ? [`${rel}: forbidden "${pattern}" — ${hint}`] : [],
  );
}

export function checkStaticContent(): CheckResult {
  const result: CheckResult = { name: 'static-content', errors: [], warnings: [] };

  for (const file of collectFiles(join(PATHS.root, 'lib/content'))) {
    result.errors.push(...checkPatterns(file, FORBIDDEN_IN_CONTENT));
  }

  for (const file of collectFiles(join(PATHS.root, 'app')).filter((f) => f.endsWith('page.tsx'))) {
    const source = readFileSync(file, 'utf8');
    if (!source.includes('generateStaticParams')) continue;

    result.errors.push(
      ...checkPatterns(file, [
        {
          pattern: '@/lib/supabase/server',
          hint: 'generateStaticParams runs at build time — use static CMS clients instead.',
        },
        {
          pattern: "from 'next/headers'",
          hint: 'generateStaticParams runs at build time — cookies() and headers() are not allowed.',
        },
        {
          pattern: 'from "next/headers"',
          hint: 'generateStaticParams runs at build time — cookies() and headers() are not allowed.',
        },
      ]),
    );
  }

  return result;
}

if (isMain('check-static-content')) {
  const { printResult, exitFromResults } = await import('./lib/runner');
  const result = checkStaticContent();
  printResult(result);
  exitFromResults([result]);
}

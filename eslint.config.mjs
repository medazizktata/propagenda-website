import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'reference/**',
      'scripts/.venv-ig/**',
      'scripts/node_modules/**',
      'tools/pdf-extractor/**',
      'docs/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    files: ['lib/content/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/supabase/server',
              message:
                'Use createSupabaseStaticClient from @/lib/supabase/static — server client calls cookies() and breaks build-time reads.',
            },
            {
              name: 'next/headers',
              importNames: ['cookies', 'headers', 'draftMode'],
              message:
                'Dynamic request APIs are not safe in content loaders used by generateStaticParams.',
            },
          ],
        },
      ],
    },
  },
];

export default config;

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'reference/**',
      'scripts/**',
      'tools/**',
      'docs/**',
    ],
  },
  ...nextCoreWebVitals,
];

export default config;

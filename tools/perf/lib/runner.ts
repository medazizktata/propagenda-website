export type CheckResult = {
  name: string;
  errors: string[];
  warnings: string[];
};

export function printResult(result: CheckResult): void {
  for (const warning of result.warnings) console.warn(`  ⚠ ${warning}`);
  for (const error of result.errors) console.error(`  ✗ ${error}`);
}

export function exitFromResults(results: CheckResult[]): void {
  const errors = results.flatMap((r) => r.errors);
  const warnings = results.flatMap((r) => r.warnings);

  console.log('');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('All perf checks passed.');
    process.exit(0);
  }

  console.log(
    `Perf summary: ${errors.length} error(s), ${warnings.length} warning(s)`,
  );
  process.exit(errors.length > 0 ? 1 : 0);
}

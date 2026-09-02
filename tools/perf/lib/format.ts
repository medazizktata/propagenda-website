export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ok(message: string): void {
  console.log(`OK  ${message}`);
}

export function warn(message: string): void {
  console.warn(`WARN  ${message}`);
}

export function fail(message: string): void {
  console.error(`FAIL  ${message}`);
}

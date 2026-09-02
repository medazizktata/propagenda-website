export function isMain(name: string): boolean {
  return (process.argv[1] ?? '').includes(name);
}

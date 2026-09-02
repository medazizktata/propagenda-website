import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walkFiles(path, acc);
    else acc.push(path);
  }
  return acc;
}

export function rel(root: string, file: string): string {
  return relative(root, file);
}

export function ext(file: string): string {
  const i = file.lastIndexOf('.');
  return i === -1 ? '' : file.slice(i).toLowerCase();
}

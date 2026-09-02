import { execSync } from 'node:child_process';

export type VideoProbe = {
  width: number;
  height: number;
  duration: number;
  fps: number;
};

function parseFps(raw: string): number {
  const [num, den] = raw.split('/').map(Number);
  if (!num || !den) return 0;
  return num / den;
}

/** Returns null when ffprobe is unavailable or the file is unreadable. */
export function probeVideo(filePath: string): VideoProbe | null {
  try {
    const json = execSync(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -show_entries format=duration -of json "${filePath}"`,
      { encoding: 'utf8' },
    );
    const parsed = JSON.parse(json) as {
      streams?: Array<{ width?: number; height?: number; r_frame_rate?: string }>;
      format?: { duration?: string };
    };
    const stream = parsed.streams?.[0];
    if (!stream?.width || !stream.height) return null;

    return {
      width: stream.width,
      height: stream.height,
      duration: Number(parsed.format?.duration ?? 0),
      fps: parseFps(stream.r_frame_rate ?? '0/1'),
    };
  } catch {
    return null;
  }
}

export function is4K(width: number, height: number): boolean {
  const long = Math.max(width, height);
  const short = Math.min(width, height);
  return long >= 3840 && short >= 2160;
}

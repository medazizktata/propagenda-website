/**
 * Seven marks, one family.
 *
 * These are lucide-react's glyphs, not hand-drawn ones — the previous set was hand-coded canvas
 * paths and this codebase's own comments flagged them as needing improvement. lucide draws every
 * icon on a 24-unit grid at a 2-unit stroke with `fill: none` and round caps and joins: the same
 * "one outline, one weight, nothing filled" discipline this atlas already wants, just authored by
 * a dedicated icon set instead of approximated here. `fromLucide` replays each icon's own node
 * list (the `path` / `circle` / `rect` primitives lucide-react's `createLucideIcon` consumes)
 * through this module's existing canvas helpers, scaled so the effective stroke lands on
 * `ICON_STROKE` — the weight already tuned for the worst case this set has to survive.
 *
 * That worst case doesn't change with the source: a 60px face raked 30 degrees away from camera.
 * Anything with thin hairlines, interior counters, or fine detail is still unreadable there,
 * which is why each pick below is one of lucide's plainer, chunkier marks rather than its most
 * literal one.
 */

export type IconDraw = (ctx: CanvasRenderingContext2D) => void;

/** The grid every mark is drawn on. The caller scales the context so 100 units == the icon box. */
export const ICON_GRID = 100;
/** Stroke weight in grid units. Heavy enough to survive a 60px face at a 30 degree rake. */
export const ICON_STROKE = 7;

/** lucide's own coordinate space: every icon in its set is authored on this grid. */
const LUCIDE_GRID = 24;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.stroke();
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

/** The three primitive shapes lucide's node lists actually use across the seven icons below. */
type LucideShape =
  | { tag: 'path'; d: string }
  | { tag: 'circle'; cx: number; cy: number; r: number }
  | { tag: 'rect'; x: number; y: number; width: number; height: number; rx: number };

/**
 * Replays a lucide icon's node list at this atlas's stroke weight.
 *
 * The context arrives already scaled to the 100-unit grid with `lineWidth` set to `ICON_STROKE`
 * for that space. Rescaling further, to lucide's native 24-unit grid, would inflate that stroke
 * by 100/24 along with every coordinate; dividing it back out here is what makes the glyphs land
 * at this family's weight instead of lucide's own, while still letting every `d` string below be
 * pasted verbatim from lucide-react's source.
 */
function fromLucide(shapes: readonly LucideShape[]): IconDraw {
  return (ctx) => {
    ctx.save();
    const scale = ICON_GRID / LUCIDE_GRID;
    ctx.scale(scale, scale);
    ctx.lineWidth = ICON_STROKE / scale;
    for (const shape of shapes) {
      if (shape.tag === 'path') {
        ctx.stroke(new Path2D(shape.d));
      } else if (shape.tag === 'circle') {
        circle(ctx, shape.cx, shape.cy, shape.r);
      } else {
        roundRect(ctx, shape.x, shape.y, shape.width, shape.height, shape.rx);
      }
    }
    ctx.restore();
  };
}

/** Branding — lucide's `stamp`: an inked mark and the block that presses it. */
const branding = fromLucide([
  { tag: 'path', d: 'M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13' },
  {
    tag: 'path',
    d: 'M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z',
  },
  { tag: 'path', d: 'M5 22h14' },
]);

/** Public Relations — lucide's `rss`: a signal broadcast from a fixed source. */
const publicRelations = fromLucide([
  { tag: 'path', d: 'M4 11a9 9 0 0 1 9 9' },
  { tag: 'path', d: 'M4 4a16 16 0 0 1 16 16' },
  { tag: 'circle', cx: 5, cy: 19, r: 1 },
]);

/** Online & Offline Marketing — lucide's `target`: reach, aimed. */
const marketing = fromLucide([
  { tag: 'circle', cx: 12, cy: 12, r: 10 },
  { tag: 'circle', cx: 12, cy: 12, r: 6 },
  { tag: 'circle', cx: 12, cy: 12, r: 2 },
]);

/** Websites — lucide's `globe`: the web, literally. */
const websites = fromLucide([
  { tag: 'circle', cx: 12, cy: 12, r: 10 },
  { tag: 'path', d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' },
  { tag: 'path', d: 'M2 12h20' },
]);

/** Mobile Applications — lucide's `smartphone`: a handset. */
const mobile = fromLucide([
  { tag: 'rect', x: 5, y: 2, width: 14, height: 20, rx: 2 },
  { tag: 'path', d: 'M12 18h.01' },
]);

/** Events — lucide's `ticket`, perforation and all. */
const events = fromLucide([
  {
    tag: 'path',
    d: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z',
  },
  { tag: 'path', d: 'M13 5v2' },
  { tag: 'path', d: 'M13 17v2' },
  { tag: 'path', d: 'M13 11v2' },
]);

/** Photography & Videography — lucide's `camera`: a body, a raised finder, a lens. */
const photography = fromLucide([
  {
    tag: 'path',
    d: 'M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z',
  },
  { tag: 'circle', cx: 12, cy: 13, r: 3 },
]);

/** Indexed to match CUBE_SERVICES. */
export const SERVICE_ICONS: readonly IconDraw[] = [
  branding,
  publicRelations,
  marketing,
  websites,
  mobile,
  events,
  photography,
];

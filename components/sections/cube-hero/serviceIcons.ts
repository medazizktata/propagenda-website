/**
 * Seven marks, one family.
 *
 * Every icon is drawn on the same 100x100 grid with the same stroke weight, the same round caps
 * and joins, and exactly one solid accent shape. That last rule is what holds the set together:
 * each mark is an outline with a single filled dot somewhere inside it, so seven different
 * subjects still read as one designed system rather than seven borrowed glyphs.
 *
 * They are built for the worst case, not the best: a 60px face raked 30 degrees away from camera.
 * That rules out thin hairlines, interior detail and anything that depends on a counter staying
 * open — hence four or fewer elements each, and a 7-unit stroke that stays above a pixel even on
 * the smallest cube in the field.
 */

export type IconDraw = (ctx: CanvasRenderingContext2D) => void;

/** The grid every mark is drawn on. The caller scales the context so 100 units == the icon box. */
export const ICON_GRID = 100;
/** Stroke weight in grid units. Heavy enough to survive a 60px face at a 30 degree rake. */
export const ICON_STROKE = 7;

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

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

/** Branding — a seal: a struck mark held inside a ring. */
const branding: IconDraw = (ctx) => {
  circle(ctx, 50, 50, 36);
  ctx.beginPath();
  ctx.moveTo(50, 32);
  ctx.lineTo(68, 50);
  ctx.lineTo(50, 68);
  ctx.lineTo(32, 50);
  ctx.closePath();
  ctx.fill();
};

/** Public Relations — a signal leaving a source and widening as it travels. */
const publicRelations: IconDraw = (ctx) => {
  dot(ctx, 26, 74, 9);
  for (const radius of [26, 46, 66]) {
    ctx.beginPath();
    // Canvas angles run clockwise with y down, so -90deg to 0deg sweeps from straight up
    // round to the right: a quarter of broadcast, aimed out of the corner.
    ctx.arc(26, 74, radius, -Math.PI / 2, 0);
    ctx.stroke();
  }
};

/** Online & Offline Marketing — two channels overlapping, with the audience in the middle. */
const marketing: IconDraw = (ctx) => {
  circle(ctx, 36, 50, 27);
  circle(ctx, 64, 50, 27);
  dot(ctx, 50, 50, 8);
};

/** Websites — a browser window. */
const websites: IconDraw = (ctx) => {
  roundRect(ctx, 10, 20, 80, 60, 11);
  ctx.beginPath();
  ctx.moveTo(10, 40);
  ctx.lineTo(90, 40);
  ctx.stroke();
  dot(ctx, 23, 30, 5);
};

/** Mobile Applications — a handset. */
const mobile: IconDraw = (ctx) => {
  roundRect(ctx, 28, 8, 44, 84, 13);
  ctx.beginPath();
  ctx.moveTo(42, 22);
  ctx.lineTo(58, 22);
  ctx.stroke();
  dot(ctx, 50, 78, 5.5);
};

/** Events — a ticket, perforation and all. */
const events: IconDraw = (ctx) => {
  roundRect(ctx, 8, 27, 84, 46, 11);
  ctx.beginPath();
  for (const y of [34, 47, 60]) {
    ctx.moveTo(66, y);
    ctx.lineTo(66, y + 6);
  }
  ctx.stroke();
  dot(ctx, 34, 50, 8);
};

/** Photography & Videography — a body, a raised finder, a lens. */
const photography: IconDraw = (ctx) => {
  roundRect(ctx, 8, 28, 84, 58, 12);
  ctx.beginPath();
  ctx.moveTo(26, 28);
  ctx.lineTo(26, 18);
  ctx.lineTo(46, 18);
  ctx.lineTo(46, 28);
  ctx.stroke();
  circle(ctx, 50, 57, 19);
  dot(ctx, 50, 57, 7);
};

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

import type { CSSProperties } from 'react';
import { cn } from './cn';

type BrandPatternVariant = 'dense' | 'tiled' | 'frame' | 'strip';
type BrandPatternHalf = 'left' | 'right';

interface BrandPatternProps {
  variant?: BrandPatternVariant;
  /**
   * Show only one half of the pattern sheet, split at the vertical width-midpoint, so
   * different sections show different portions of the artwork. Ignored for `tiled`.
   */
  half?: BrandPatternHalf;
  /** Unused now (kept for call-site compatibility). */
  id?: string;
  className?: string;
}

// The real brand pattern sheet (deconstructed monogram — orange gradient + outline),
// exported from the brand's patterns/ folder.
const PATTERN_SRC = "url('/images/brand/pattern-sheet.svg')";
// A wide deconstructed-monogram ribbon, recoloured to Propagenda orange and tight-cropped
// to its content (~4.1:1), so it fills a full-bleed band edge-to-edge (brand PDF pattern
// system) instead of floating small in empty canvas.
const STRIP_SRC = "url('/images/brand/pattern-ribbon-orange.svg')";

/**
 * Brand background pattern using the official pattern asset.
 *  - dense : full-bleed cover (hero backdrop; caller sets opacity)
 *  - tiled : subtle repeat behind section content
 *  - frame : cover accent
 *  - strip : wide orange monogram band (contain, top-anchored) — horizontal accent
 * Pass `half` on dense/frame to reveal just the left or right half of the sheet.
 */
export function BrandPattern({ variant = 'dense', half, className }: BrandPatternProps) {
  let style: CSSProperties;
  if (variant === 'strip') {
    // Sit the ribbon at the band's full height and tile it horizontally, so the marks stay
    // a consistent bold size and run edge-to-edge no matter the band height or viewport.
    style = {
      backgroundImage: STRIP_SRC,
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat-x',
    };
  } else if (variant === 'tiled') {
    style = { backgroundImage: PATTERN_SRC, backgroundSize: '820px auto', backgroundRepeat: 'repeat' };
  } else if (half) {
    // Sizing the sheet to 200% width makes it span 2× the container, so the pattern is
    // effectively split down the middle; `left`/`right` then reveals the first/second
    // half (scaled to fill the width, vertically centre-cropped).
    style = {
      backgroundImage: PATTERN_SRC,
      backgroundSize: '200% auto',
      backgroundPosition: `${half} center`,
      backgroundRepeat: 'no-repeat',
    };
  } else {
    style = {
      backgroundImage: PATTERN_SRC,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -z-0 overflow-hidden',
        variant === 'tiled' && 'opacity-[0.07]',
        variant === 'frame' && 'opacity-30',
        className,
      )}
      style={style}
    />
  );
}

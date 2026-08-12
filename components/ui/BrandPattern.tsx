import type { CSSProperties } from 'react';
import { cn } from './cn';

type BrandPatternVariant = 'dense' | 'tiled' | 'frame' | 'strip';
type BrandPatternHalf = 'left' | 'right';

interface BrandPatternProps {
  variant?: BrandPatternVariant;
  /**
   * Show only one half of the pattern sheet, split at the vertical width-midpoint, so
   * different sections show different portions of the artwork. Ignored for `strip`.
   */
  half?: BrandPatternHalf;
  /** Unused now (kept for call-site compatibility). */
  id?: string;
  className?: string;
}

// Official brand pattern sheet (deconstructed monogram — orange gradient + outline).
const PATTERN_SRC = "url('/images/brand/pattern-sheet.svg')";
// Wide deconstructed-monogram ribbon for full-bleed horizontal bands.
const STRIP_SRC = "url('/images/brand/pattern-ribbon-orange.svg')";

/**
 * Brand background pattern using the official pattern asset.
 *  - dense / tiled / frame : compositional sheet cover (manifesto look) — even fill, no sparse stamps
 *  - strip : wide orange monogram band (contain, top-anchored)
 * Pass `half` to reveal just the left or right half of the sheet.
 */
export function BrandPattern({ variant = 'dense', half, className }: BrandPatternProps) {
  let style: CSSProperties;

  if (variant === 'strip') {
    style = {
      backgroundImage: STRIP_SRC,
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat-x',
    };
  } else if (half) {
    // 200% width → sheet spans 2× the container; left/right reveals one half.
    style = {
      backgroundImage: PATTERN_SRC,
      backgroundSize: '200% auto',
      backgroundPosition: `${half} center`,
      backgroundRepeat: 'no-repeat',
    };
  } else {
    // Cover the surface as one composition (same energy as ManifestoSection),
    // not a sparse 820px tile grid with dead zones between stamps.
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
        variant === 'tiled' && 'opacity-[0.12]',
        variant === 'frame' && 'opacity-30',
        className,
      )}
      style={style}
    />
  );
}

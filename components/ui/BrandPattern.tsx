type BrandPatternVariant = 'dense' | 'tiled' | 'frame' | 'strip';
type BrandPatternHalf = 'left' | 'right';

interface BrandPatternProps {
  variant?: BrandPatternVariant;
  half?: BrandPatternHalf;
  id?: string;
  className?: string;
}

/** Decorative brand pattern — disabled site-wide (flat #121212 surfaces). */
export function BrandPattern(_props: BrandPatternProps) {
  return null;
}

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#f58b27',
          hover: '#e07d1f',
          muted: 'rgba(245, 139, 39, 0.15)',
          50: 'rgba(245, 139, 39, 0.08)',
          100: 'rgba(245, 139, 39, 0.15)',
          200: 'rgba(245, 139, 39, 0.25)',
        },
        navy: '#0f151f',
        charcoal: '#252525',
        surface: {
          DEFAULT: '#252525',
          deep: '#000000',
          elevated: '#0f151f',
          light: '#ffffff',
        },
        primary: '#f58b27',
        secondary: '#0f151f',
        accent: '#f58b27',
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.65)',
          subtle: 'rgba(255, 255, 255, 0.45)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.12)',
          strong: 'rgba(255, 255, 255, 0.25)',
          accent: '#f58b27',
        },
        input: '#f7f8fb',
        error: '#dc2626',
        success: '#16a34a',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'var(--font-poppins)', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1', letterSpacing: '0.02em' }],
        xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        // Brand-faithful display scale: roomier leading (~0.9) + wider tracking than SMV's
        // tight-condensed 0.73. Sizes tempered from the extreme 31vw toward bold-but-legible.
        'display-xs': ['clamp(1.9rem, 4.6vw, 4.25rem)', { lineHeight: '0.95', letterSpacing: '0.02em' }],
        'display-sm': ['clamp(2.4rem, 6.8vw, 6rem)', { lineHeight: '0.92', letterSpacing: '0.02em' }],
        'display-md': ['clamp(2.9rem, 9vw, 9rem)', { lineHeight: '0.9', letterSpacing: '0.02em' }],
        'display-lg': ['clamp(3.6rem, 12vw, 14rem)', { lineHeight: '0.9', letterSpacing: '0.02em' }],
        'display-xl': ['clamp(4.5rem, 15vw, 18rem)', { lineHeight: '0.9', letterSpacing: '0.02em' }],
        'display-2xl': ['clamp(5rem, 18vw, 22rem)', { lineHeight: '0.9', letterSpacing: '0.02em' }],
        'nav-mobile': ['clamp(3rem, 15vw, 8rem)', { lineHeight: '0.78', letterSpacing: '0.015em' }],
        'nav-mobile-landscape': ['clamp(2rem, 7.5vw, 5rem)', { lineHeight: '0.78', letterSpacing: '0.015em' }],
      },
      letterSpacing: {
        // "tracking-display" — referenced by DisplayHeading (was undefined/dead).
        // Roomy tracking for big brand caps (PDF caps are widely spaced, not condensed).
        display: '0.02em',
        label: '0.18em',
      },
      spacing: {
        // Large, near-extreme page gutters (content sits well inside the edges).
        'gutter-d': 'clamp(4rem, 14vw, 22rem)',
        'gutter-m': '2.5rem',
        header: '56px',
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        footer: '24px',
        pill: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
        md: '0 4px 12px rgba(0, 0, 0, 0.5)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.6)',
        glow: '0 0 1.7px #f58b27',
        'glow-laptop': '0 0 1.3px #f58b27',
        'inset-autofill': 'inset 0 0 0 30px #ffffff',
        footer: '0 0 2px 0 #000000',
      },
      screens: {
        xs: '449px',
        'md-max': { max: '767px' },
        'lg-max': { max: '1023px' },
        laptop: '1366px',
        'laptop-max': { max: '1365px' },
        desktop: '1600px',
        'desktop-max': { max: '1599px' },
        wide: '1920px',
        'wide-max': { max: '1919px' },
        ultrawide: '1921px',
      },
      maxWidth: {
        prose: '37.1134vw',
        'prose-fixed': '712px',
        'content-column': '700px',
        'form-min': '345px',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
        normal: '300ms',
        /** Default hover in/out duration — use with `transition-hover` / `duration-hover`. */
        hover: '300ms',
        slow: '500ms',
        cinematic: '5000ms',
        pswp: '333ms',
      },
      transitionTimingFunction: {
        /** Smooth ease-out for hover enter + leave (symmetric, no snap-back). */
        hover: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      zIndex: {
        grain: '1',
        content: '2',
        header: '100',
        overlay: '500',
        navbox: '1000',
        lightbox: '1500',
        loader: '9000',
      },
      opacity: {
        // Subtle SMV-style film grain over the whole app.
        grain: '0.16',
        'grain-hover': '0.18',
        'char-dim': '0.1',
      },
      animation: {
        'loader-glitch': 'glitch 0.2s ease',
        'line-wipe': 'lineWipe 0.4s ease forwards',
        'page-cover': 'pageCover 0.34s cubic-bezier(0.76,0,0.24,1) forwards',
        'page-reveal': 'pageReveal 0.46s cubic-bezier(0.76,0,0.24,1) forwards',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'bright-flash': 'brightFlash 1s ease-out',
        'bright-flash-fast': 'brightFlash 0.7s ease-out',
        'spin-slow': 'spin 1.2s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85', transform: 'translateX(1px)' },
        },
        lineWipe: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
        // SMV-style route transition, split into two independently-triggered halves so the
        // screen is covered BEFORE navigation and only revealed once the new page is ready.
        pageCover: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        pageReveal: {
          '0%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'top' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(105%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        brightFlash: {
          '0%': { filter: 'brightness(5)' },
          '100%': { filter: 'brightness(1)' },
        },
      },
    },
  },
  plugins: [
    // Shared hover surface: apply `transition-hover` on anything that uses hover styles
    // so enter + leave ease the same (colors, opacity, transform, shadow, filter…).
    function hoverTransitionPlugin({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        '.transition-hover': {
          'transition-property':
            'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
          'transition-timing-function': 'cubic-bezier(0.22, 1, 0.36, 1)',
          'transition-duration': '300ms',
        },
      });
    },
  ],
};

export default config;

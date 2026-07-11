export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-loader focus:rounded-lg focus:bg-orange focus:px-4 focus:py-2 focus:text-black"
    >
      Skip to main content
    </a>
  );
}

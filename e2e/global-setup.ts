/**
 * Warm every route once before tests run, so Turbopack's first-compile happens
 * outside the assertions (dev-mode compiles mid-test read as hydration flakes).
 */
export default async function globalSetup() {
  const base = 'http://localhost:4000';
  const routes = ['/', '/about', '/services', '/work', '/contact'];
  for (const route of routes) {
    try {
      await fetch(base + route);
    } catch {
      /* webServer will surface real availability problems */
    }
  }
}

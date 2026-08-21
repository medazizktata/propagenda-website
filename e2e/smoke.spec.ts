import { test, expect, type Page } from '@playwright/test';

const ROUTES = ['/', '/about', '/services', '/work', '/contact'];

// The intro loader plays once per session; seed the flag so tests skip it.
async function prime(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('pg-init-loader-seen', '1');
    } catch {
      /* ignore */
    }
  });
}

test.describe('console hygiene', () => {
  for (const route of ROUTES) {
    test(`no console errors on ${route}`, async ({ page }) => {
      test.skip(test.info().project.name !== 'desktop', 'desktop only');
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(String(err)));
      await prime(page);
      await page.goto(route, { waitUntil: 'networkidle' });
      // Scroll through the page so scroll-triggered sections mount too.
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (const f of [0.25, 0.5, 0.75, 1]) {
          window.scrollTo({ top: h * f, behavior: 'instant' as ScrollBehavior });
          await new Promise((r) => setTimeout(r, 250));
        }
      });
      expect(errors, `console errors on ${route}:\n${errors.join('\n')}`).toEqual([]);
    });
  }
});

test.describe('navigation', () => {
  test('menu opens and is visible (mobile + tablet)', async ({ page }) => {
    test.skip(test.info().project.name === 'desktop', 'overlay nav is sub-lg only');
    await prime(page);
    await page.goto('/');
    const burger = page.getByRole('button', { name: 'Open menu' });
    await expect(burger).toBeVisible();
    await burger.click();
    // The overlay must actually be interactable — this catches breakpoint
    // mismatches where the button renders but the menu stays hidden. Assert the
    // Home link: it is the one nav item never hidden by soft-launch page flags.
    const menu = page.locator('#mobile-menu');
    await expect(menu.getByRole('link', { name: /home/i }).first()).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('desktop nav is visible, hamburger is not', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    await prime(page);
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  });
});

test.describe('brand + accessibility invariants', () => {
  test('primary CTA is ink-on-orange (WCAG contrast law)', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    await prime(page);
    await page.goto('/');
    const cta = page.getByRole('link', { name: 'Contact Us' }).first();
    await expect(cta).toBeVisible();
    const { color, bg } = await cta.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, bg: s.backgroundColor };
    });
    expect(bg).toBe('rgb(245, 139, 39)'); // brand orange
    expect(color).toBe('rgb(20, 20, 20)'); // ink — white here fails WCAG at 2.44:1
  });

  test('book-a-call links to a real scheduling target', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    await prime(page);
    await page.goto('/contact');
    const external = /^https:\/\//;
    const link = page.getByRole('link', { name: 'BOOK A CALL' }).first();
    await expect(link).toHaveAttribute('href', external);
    await expect(link).toHaveAttribute('target', '_blank');
    const footerLink = page.locator('footer').getByRole('link', { name: /book a call/i });
    await expect(footerLink).toHaveAttribute('href', external);
    await page.goto('/');
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior }));
    await expect(
      page.locator('main').getByRole('link', { name: /book a call/i }).first(),
    ).toHaveAttribute('href', external, { timeout: 10_000 });
  });

  test('footer closes with the brand verdict', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    await prime(page);
    await page.goto('/about');
    await expect(page.getByText(/looking for the\s*better future/i)).toBeVisible();
  });
});

test.describe('contact API', () => {
  const valid = {
    name: 'E2E Test',
    company: 'Guardrail Co',
    email: 'e2e@example.com',
    source: 'Other',
    budget: 'Not sure yet',
    timeframe: 'Flexible',
    message: 'E2E TEST — full pipeline check, send is dev-skipped.',
  };

  test('rejects malformed JSON with 400, not 500', async ({ request }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    const res = await request.post('/api/contact', {
      headers: { 'content-type': 'application/json' },
      data: 'not-json{',
    });
    expect(res.status()).toBe(400);
  });

  test('rejects tampered enums with per-field errors', async ({ request }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    const res = await request.post('/api/contact', {
      data: { ...valid, budget: 'HACKED' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.fieldErrors?.budget).toBeTruthy();
  });

  test('honeypot submissions get a fake success (no send)', async ({ request }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    const res = await request.post('/api/contact', {
      data: { ...valid, website: 'spam-bot-filled-this' },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test('valid brief succeeds end-to-end (send dev-skipped by CONTACT_SEND_ENABLED gate)', async ({
    request,
  }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    const res = await request.post('/api/contact', { data: valid });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain('Thank you');
  });
});

test.describe('contact form', () => {
  test('empty submit surfaces validation errors, fields are labelled', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'desktop only');
    await prime(page);
    await page.goto('/contact');
    // The form sits below the fold behind a scroll reveal — bring it on stage first.
    await page.locator('#contact-form').scrollIntoViewIfNeeded();
    // Every field reachable by its visible label.
    for (const label of ['Your name', 'Your email', 'Tell us about the project']) {
      await expect(page.getByLabel(label, { exact: false })).toBeVisible({ timeout: 10_000 });
    }
    await page.getByRole('button', { name: /send the brief/i }).click();
    // Server-action validation round-trips and marks fields invalid.
    await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible({ timeout: 15_000 });
  });
});

import { test as base } from '@playwright/test';

export const test = base.extend<{ loggedInPage: import('@playwright/test').Page }>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await use(page);
  },
});

import { test, expect } from '@playwright/test';
import fs from 'fs';

const storageStatePath = 'storageState.json';
const baseURL = process.env.BASE_URL || 'https://practicesoftwaretesting.com/login';
const email = process.env.USER_EMAIL || 'customer@practicesoftwaretesting.com';
const password = process.env.USER_PASSWORD || 'welcome01';

test('login and save storage state', async ({ page }) => {
  await page.goto(baseURL);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard|home/);
  const state = await page.context().storageState();
  fs.writeFileSync(storageStatePath, JSON.stringify(state, null, 2));
  expect(fs.existsSync(storageStatePath)).toBeTruthy();
});

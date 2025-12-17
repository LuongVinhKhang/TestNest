import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.BASE_URL || 'https://practicesoftwaretesting.com/login');
  await page.fill('input[name="email"]', process.env.USER_EMAIL!);
  await page.fill('input[name="password"]', process.env.USER_PASSWORD!);
  await page.click('button[type="submit"]');
  // Wait for login to complete (adjust selector as needed)
  await page.waitForURL(/dashboard|home/);
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
  console.log('Saved storage state to storageState.json');
})();

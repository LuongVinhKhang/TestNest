

import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'user@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'password123';


test('Login with valid credentials (submit button)', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", TEST_EMAIL);
  await expect(page.locator("input[name='email']")).toHaveValue(TEST_EMAIL);
  await page.fill("input[name='password']", TEST_PASSWORD);
  await expect(page.locator("input[name='password']")).toHaveValue(TEST_PASSWORD);
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/dashboard/);
});


test('Login with valid credentials (Login button)', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", TEST_EMAIL);
  await expect(page.locator("input[name='email']")).toHaveValue(TEST_EMAIL);
  await page.fill("input[name='password']", TEST_PASSWORD);
  await expect(page.locator("input[name='password']")).toHaveValue(TEST_PASSWORD);
  await page.click("button:has-text('Login')");
  await expect(page).toHaveURL(/dashboard/);
});


test('Login and land on patient dashboard', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill("input[name='email']", TEST_EMAIL);
  await expect(page.locator("input[name='email']")).toHaveValue(TEST_EMAIL);
  await page.fill("input[name='password']", TEST_PASSWORD);
  await expect(page.locator("input[name='password']")).toHaveValue(TEST_PASSWORD);
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/dashboard\/patient/);
});


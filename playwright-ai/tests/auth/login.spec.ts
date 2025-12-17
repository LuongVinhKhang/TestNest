import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

const validEmail = process.env.USER_EMAIL || 'customer@practicesoftwaretesting.com';
const validPassword = process.env.USER_PASSWORD || 'welcome01';
const invalidPassword = 'wrongpassword';
const unregisteredEmail = 'notfound@example.com';

// Login test cases

test.describe('Login', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
    await expect(page).toHaveURL(/dashboard|home/);
  });

  test('should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(validEmail, invalidPassword);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid/i);
  });

  test('should show error for unregistered email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(unregisteredEmail, validPassword);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/not found|invalid/i);
  });

  test('should show error for empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/required/i);
  });
});

import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../page-objects/RegistrationPage';

const randomEmail = () => `user${Date.now()}@example.com`;
const validPassword = 'TestPassword123!';

// Registration test cases

test.describe('Registration', () => {
  test('should register with valid data', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.register('Test', 'User', randomEmail(), validPassword);
    await expect(page).toHaveURL(/dashboard|home|welcome/);
  });

  test('should show error for existing email', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.register('Test', 'User', 'customer@practicesoftwaretesting.com', validPassword);
    await expect(registrationPage.errorMessage).toBeVisible();
    await expect(registrationPage.errorMessage).toContainText(/already exists|taken/i);
  });

  test('should show error for missing fields', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.register('', '', '', '');
    await expect(registrationPage.errorMessage).toBeVisible();
    await expect(registrationPage.errorMessage).toContainText(/required/i);
  });

  test('should show error for weak password', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
    await registrationPage.register('Test', 'User', randomEmail(), '123');
    await expect(registrationPage.errorMessage).toBeVisible();
    await expect(registrationPage.errorMessage).toContainText(/weak|invalid/i);
  });
});

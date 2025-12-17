# Copilot Instructions for playwright-ai

## Project Overview
This project is a Playwright + TypeScript automation suite targeting https://practicesoftwaretesting.com/. It follows strict QA best practices and is organized for maintainability, reliability, and CI-readiness.

## Architecture & Structure
- **Test specs**: `tests/` — All test cases are implemented here, grouped by suite (e.g., `auth`, `product_catalog`, `cart_and_checkout`).
- **Page Objects**: `page-objects/` (or `pages/`) — Encapsulate UI operations and locators. Use Playwright's locator API and prefer stable selectors (semantic roles, visible text).
- **Config**: `playwright.config.ts` — Central config, sets base URL, retries, trace, and reporter settings.
- **Helpers/Utils**: `utils/` — Shared helpers (data, API, etc.).
- **Fixtures**: `fixtures/` (optional) — Custom Playwright fixtures for reusable setup.

## Key Conventions
- **Test Design**: Each test case is mapped to a spec file and a clear `describe/it` block. Use Markdown tables for manual test case documentation.
- **Page Object Model**: Page objects expose high-level methods (e.g., `login`, `addProductToCart`). Locators use Playwright's `getByRole`, `getByLabel`, or stable text selectors. Avoid brittle XPath and arbitrary timeouts.
- **Test Data**: Prefer inline data or JSON files. If unsure, ask for user preference.
- **Reporting & CI**: Tests are CI-ready; config enables retries and trace on failure. Reporting is handled via Playwright's built-in reporters.

## Developer Workflows
- **Install dependencies**: `npm install`
- **Run all tests**: `npx playwright test`
- **Run specific suite**: `npx playwright test tests/auth/login.spec.ts`
- **Debug**: Use Playwright's trace viewer and built-in debugging tools.

## Patterns & Examples
- **Selectors**: Use semantic selectors, e.g.:
  ```ts
  page.getByRole('button', { name: 'Login' })
  page.getByLabel('Email')
  page.locator('text=Add to Cart')
  ```
- **Test Structure**:
  ```ts
  test('should login with valid credentials', async ({ page }) => {
    // Arrange
    await page.goto('/login');
    // Act
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    // Assert
    await expect(page).toHaveURL('/dashboard');
  });
  ```
- **Page Object Example**:
  ```ts
  class LoginPage {
    constructor(private page: Page) {}
    async login(email: string, password: string) {
      await this.page.fill('input[name="email"]', email);
      await this.page.fill('input[name="password"]', password);
      await this.page.click('button[type="submit"]');
    }
  }
  ```

## Special Notes
- **Do not invent selectors**; base them on visible text or semantic roles. If unknown, state assumptions in comments.
- **Never skip plan steps**; always update `plan.md` and wait for explicit user approval before executing.
- **Summarize each completed step and mark it in `plan.md`**.

## References
- See `plan.md` for workflow, standards, and step-by-step execution rules.
- All code must be runnable, strictly typed, and follow Playwright best practices.

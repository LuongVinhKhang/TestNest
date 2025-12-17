# Automation Architecture for playwright-ai

## Folder Structure
```
playwright-ai/
├── playwright.config.ts
├── tests/
│   ├── auth/
│   │   └── login.spec.ts
│   ├── product_catalog/
│   │   └── add_to_cart.spec.ts
│   └── ...
├── page-objects/
│   ├── LoginPage.ts
│   ├── ProductListingPage.ts
│   ├── CartPage.ts
│   └── ...
├── fixtures/
│   └── custom-fixtures.ts (optional)
├── utils/
│   ├── testData.ts
│   ├── apiClient.ts
│   └── ...
└── .github/
    └── copilot-instructions.md
```

## Naming Conventions
- **Specs**: `tests/<suite>/<feature>.spec.ts` (e.g., `tests/auth/login.spec.ts`)
- **Page Objects**: `page-objects/<PageName>.ts` (e.g., `LoginPage.ts`)
- **Fixtures**: `fixtures/<name>.ts`
- **Helpers/Utils**: `utils/<name>.ts`

## Test Data Strategy
- Use inline data for simple cases (e.g., credentials in test files or page objects)
- For complex scenarios, use JSON files or TypeScript modules in `utils/testData.ts`
- Sensitive data (e.g., credentials) should be managed via environment variables or `.env` files if needed for CI

## Environment & Config Handling
- Base URL and config in `playwright.config.ts`
- Use Playwright's environment variable support for credentials and environment-specific settings
- Example:
  ```ts
  // playwright.config.ts
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com/',
    trace: 'on',
    retries: 2,
  }
  ```

## Reusable Utilities
- **Login helper**: Method in `LoginPage.ts` or a shared function in `utils/`
- **API client**: For backend validation, place in `utils/apiClient.ts`
- **Data generators**: Factory functions in `utils/` for dynamic test data

## Best Practices
- Page objects encapsulate UI operations only; test logic stays in spec files
- Use Playwright's locator API (`getByRole`, `getByLabel`, etc.) for selectors
- Avoid hardcoded waits; use Playwright's built-in waiting mechanisms
- All code must be strictly typed and runnable

---

**Next:** Map Phase 1 test cases to automated tests.

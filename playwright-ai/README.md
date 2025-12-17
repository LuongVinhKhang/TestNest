# playwright-ai

Playwright + TypeScript automation suite for https://practicesoftwaretesting.com/

## Setup
## Advanced Usage

## Generating storageState.json for Authenticated Tests

To use pre-authenticated browser state:

### Option 1: Run Playwright test to generate storage state automatically
```sh
npx playwright test tests/auth/generateStorageState.spec.ts
```
This will create `storageState.json` in the project root.

### Option 2: Run the script (manual)
```sh
npx tsx scripts/saveStorageState.ts
```

Ensure `playwright.config.ts` includes:
```ts
use: {
   storageState: 'storageState.json',
   // ...other options
}
```
Now your tests will run with a logged-in session.

- Use custom fixtures from `fixtures/` for shared setup (e.g., `auth-fixture.ts` for logged-in tests).
- To use Google Sheets reporting, configure Google API credentials and sheet ID in `utils/googleSheetReporter.ts`, then add to `playwright.config.ts` reporters.

Example for using fixture:
```ts
import { test } from '../fixtures/auth-fixture';
test('my test', async ({ loggedInPage }) => {
   // Use loggedInPage for tests that require login
});
```

Example for custom reporter:
```ts
// playwright.config.ts
import { GoogleSheetReporter } from './utils/googleSheetReporter';
export default {
   reporter: [ ['html'], [new GoogleSheetReporter()] ]
};
```

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in credentials as needed.
3. Run all tests:
   ```sh
   npx playwright test
   ```
4. Lint and format:
   ```sh
   npm run lint
   npm run format
   ```
5. SonarQube scan:
   ```sh
   npm run sonar
   ```

## Conventions
- See `AUTOMATION_CONVENTIONS.md` for code, test, and review standards.
- All commits and pushes are checked by lefthook (see parent project config).
- All code must pass lint, format, and SonarQube checks before merge.

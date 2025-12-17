# Automation Conventions

## Code Style & Structure
- Use strict TypeScript everywhere
- All files must pass ESLint and Prettier checks before commit/push
- Use named exports for all modules
- Prefer async/await for Playwright actions

## Test Structure
- Each test case maps to a single `it` block
- Use `describe` for grouping by feature/suite
- Use Playwright fixtures for setup/teardown
- No duplicated login/setup code; use helpers/fixtures

## Naming
- Spec files: `<feature>.spec.ts` in suite folders
- Page objects: `<PageName>.ts` in `page-objects/`
- Helper files: `<name>.ts` in `utils/`

## Selector Usage
- Use Playwright's locator API: `getByRole`, `getByLabel`, `getByText`
- Never use brittle selectors (XPath, index-based, etc.)
- If selector is unclear, add a comment with reasoning/assumption

## Review & Quality
- All code must be reviewed before merge
- Lint, format, and SonarQube checks must pass (block commit/push if not)
- Use lefthook (from parent project) for pre-commit/pre-push hooks
- No skipped tests in main branch
- Add comments for any workaround or non-obvious logic

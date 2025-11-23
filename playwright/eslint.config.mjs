// eslint.config.mjs
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default defineConfig(
  // Base JS rules
  eslint.configs.recommended,

  // TypeScript rules (incl. type-aware rules)
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

  // Project-wide language options (TS project service, globals)
  {
    files: ['core/**/*.ts', 'pom/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        // Let typescript-eslint auto-detect the right tsconfig per file
        // (recommended in 2025)  [oai_citation:0‡typescript-eslint.io](https://typescript-eslint.io/getting-started/typed-linting/)
        projectService: true,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // Playwright rules only for test files
  {
    ...playwright.configs['flat/recommended'], // official flat config preset  [oai_citation:1‡UNPKG](https://app.unpkg.com/eslint-plugin-playwright%401.2.0/files/README.md?utm_source=chatgpt.com)
    files: ['test/**/*.ts'],
  },
);
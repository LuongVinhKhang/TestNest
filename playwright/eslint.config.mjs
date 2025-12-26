import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
  // TypeScript and JS base
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // Project-wide rules
  {
    files: ["**/*.{js,cjs,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: "./tsconfig.json" },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: { import: importPlugin },
    rules: {
      "import/no-unresolved": "error",
      "import/order": ["error", { "newlines-between": "always" }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
  // Playwright rules for all test files
  playwright.configs["flat/all"],
  // Prettier compatibility
  eslintConfigPrettier,
  // Custom rules and ignores
  {
    rules: {
      // ...your custom rules here...
      "playwright/no-useless-not": "error",

      "no-unused-vars": "off", // use @typescript-eslint/no-unused-vars (below) instead
      "no-param-reassign": ["error", { props: false }],
      "max-classes-per-file": ["error", 1], // single responsibility principle
      "no-use-before-define": "off",
      "no-useless-call": "error",
      "no-useless-escape": "error", // prevent unnecessary code
      "no-useless-rename": "error", // prevent unnecessary code
      "no-useless-return": "error",
      "prefer-spread": "error", // convention, brevity
      "prefer-template": "error", // convention, readability
      yoda: "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "playwright/valid-title": "off",
      "playwright/no-skipped-test": [
        "off",
        {
          allowConditional: true,
        },
      ],
      "playwright/no-page-pause": "error", // avoid accidental pauses
      "playwright/no-nested-step": "off", // to reflect test structure
      "playwright/no-wait-for-timeout": "error", // encourage better waiting strategies
    },
    ignores: [
      "node_modules/",
      "package-lock.json",
      "pnpm-lock.yaml",
      "eslint.config.mjs",
      "playwright-report/",
    ],
  },
);

// eslint.config.mjs
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
  //
  // 1) Base JS
  //
  eslint.configs.recommended,

  //
  // 2) TypeScript (including type-aware rules)
  //
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  //
  // 3) Default project-wide rules for TS files
  //
  {
    files: ["core/**/*.ts", "pom/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parserOptions: {
        // Auto-detect tsconfig through TypeScript Project Service
        projectService: true,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Import rules
      "import/no-unresolved": "error",
      "import/order": ["error", { "newlines-between": "always" }],

      // General project rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": "warn",
    },
  },

  //
  // 4) Playwright only for test files
  //
  {
    ...playwright.configs["flat/recommended"],
    files: ["test/**/*.ts"],
  },

  //
  // 5) Prettier compatibility (turns off ESLint formatting rules)
  //
  eslintConfigPrettier
);

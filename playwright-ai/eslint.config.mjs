import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginImport from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

const compat = new FlatCompat();

export default [
  ...compat.extends('eslint:recommended'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:playwright/recommended'),
  ...compat.extends('plugin:node/recommended'),
  ...compat.extends('plugin:import/recommended'),
  ...compat.extends('prettier'),
  {
    plugins: {
      playwright: eslintPluginPlaywright,
      node: eslintPluginNode,
      import: eslintPluginImport,
      prettier: eslintConfigPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'playwright/no-force': 'error',
      'node/no-unsupported-features/es-syntax': 'off',
      'import/no-unresolved': 'error',
      'import/order': ['error', { "newlines-between": "always" }],
      'no-unused-vars': 'error',
      'no-console': 'warn'
    }
  }
];

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const sortImports = require('eslint-plugin-simple-import-sort');
const flatConfigPrettier = require('eslint-config-prettier/flat');

module.exports = [
  // ignore generated and external files
  flatConfigPrettier,
  { ignores: ['**/node_modules/**', '**/dist/**', '.turbo/**', '.pnpm-store/**'] },

  // apply to all TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.base.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'simple-import-sort': sortImports,
    },
    rules: {
      // recommended TS rules
      ...tsPlugin.configs.recommended.rules,
      // imports sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // turn off conflicting rules
      'import/order': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: {
      'import/resolver': {
        typescript: { project: ['./tsconfig.base.json'] },
      },
    },
  },
];

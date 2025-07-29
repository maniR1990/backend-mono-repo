const path = require('path');

module.exports = [
  require('eslint-config-prettier/flat'),
  { ignores: ['**/node_modules/**', '**/dist/**', '.turbo/**', '.pnpm-store/**'] },

  // auth-mw
  {
    files: ['packages/auth-mw/**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: path.resolve(__dirname, 'packages/auth-mw/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: require('eslint-plugin-import'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
    },
    rules: {
      ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/order': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [path.resolve(__dirname, 'packages/auth-mw/tsconfig.json')],
        },
      },
    },
  },

  // core
  {
    files: ['packages/core/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.resolve(__dirname, 'packages/core/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [path.resolve(__dirname, 'packages/core/tsconfig.json')],
        },
      },
    },
  },

  // user-auth
  {
    files: ['services/user-auth/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.resolve(__dirname, 'services/user-auth/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [path.resolve(__dirname, 'services/user-auth/tsconfig.json')],
        },
      },
    },
  },

  // products
  {
    files: ['services/products/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: path.resolve(__dirname, 'services/products/tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [path.resolve(__dirname, 'services/products/tsconfig.json')],
        },
      },
    },
  },
];

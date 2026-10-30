// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import { fixupConfigRules } from '@eslint/compat'
import globals from 'globals'
import eslint from '@eslint/js'

import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import jestDomPlugin from 'eslint-plugin-jest-dom'
import importPlugin from 'eslint-plugin-import'

// eslint-plugin-react, eslint-plugin-import and eslint-plugin-jsx-a11y call context methods that
// ESLint 10 removed (such as context.getFilename). fixupConfigRules adds them back. Drop the
// wrapper from each plugin once it releases ESLint 10 support.
/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...fixupConfigRules(reactPlugin.configs.flat.recommended),
  reactHooksPlugin.configs.flat['recommended-latest'],
  testingLibraryPlugin.configs['flat/react'],
  jestDomPlugin.configs['flat/recommended'],
  ...fixupConfigRules(importPlugin.flatConfigs.recommended),
  ...fixupConfigRules(jsxA11yPlugin.flatConfigs.recommended),
  {
    settings: {
      react: {
        version: 'detect',
      },
      // Resolvers run in order. node ignores package.json "exports", so ESM-only packages such as
      // uuid and the per-icon @iconify-icons/mdi entries fall through to typescript. typescript
      // can't go first: it prefers .d.ts files, and import/named then misses exports that
      // src/components/generic/Table/table.d.ts and @types/lodash don't declare. Leaving "types"
      // out of conditionNames resolves to the JavaScript file for the same reason, and keeps every
      // @iconify-icons/mdi icon from resolving to the one shared data.d.ts (import/no-duplicates).
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          conditionNames: ['import', 'require', 'browser', 'default'],
        },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    },
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      camelcase: 'off',
      curly: 'error',
      'no-underscore-dangle': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-boolean-value': 'off',

      'react/jsx-key': [
        1,
        {
          checkFragmentShorthand: true,
        },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error', // please never override this rule, even locally
      // React Compiler rules that existing code breaks in about 50 files. Warn until that code
      // is fixed, then remove these lines so the preset's 'error' applies.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/static-components': 'warn',

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-undef-init': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      'no-useless-return': 'off',

      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          assert: 'either',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      'no-param-reassign': 'error',
      'react/no-danger': 'error',
      'max-nested-callbacks': ['error', { max: 3 }],
      'consistent-return': 'error',
    },
  },
  { languageOptions: { globals: { ...globals.browser } } },
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx', 'src/setupTests.js'],
    languageOptions: { globals: { ...globals.vitest, ...globals.node } },
  },
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(js|jsx|ts|tsx)'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
]

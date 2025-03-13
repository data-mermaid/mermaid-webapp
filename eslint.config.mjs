import globals from 'globals'
import eslint from '@eslint/js'

import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import jestDomPlugin from 'eslint-plugin-jest-dom'
import importPlugin from 'eslint-plugin-import'

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  reactPlugin.configs.flat.recommended,
  reactHooksPlugin.configs['recommended-latest'],
  testingLibraryPlugin.configs['flat/react'],
  jestDomPlugin.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,
  jsxA11yPlugin.flatConfigs.recommended,

  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', 'ts', 'tsx'],
        },
      },
      'import/extensions': ['.js', '.jsx', 'ts', 'tsx'],
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
      'react-hooks/exhaustive-deps': 'error',

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
      'no-param-reassign': ['error', { props: true }],
      'react/no-danger': 'error',
      'max-nested-callbacks': ['error', { max: 3 }],
      'consistent-return': 'error',
    },
  },
  { languageOptions: { globals: { ...globals.browser } } },
  {
    files: ['**/*.test.js', '**/*.test.jsx', 'src/setupTests.js'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
]

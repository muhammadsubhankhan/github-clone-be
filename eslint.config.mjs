import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
  ),
  {
    ignores: [
      '**/dist/*',
      'tsconfig.json',
      '.lintstagedrc.cjs',
      'eslint.config.mjs',
    ],
  },
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/prefer-default-export': 'off',
      'import/order': 'off',
      'max-classes-per-file': 'off',
      'import/no-cycle': 'off',
      'import/no-extraneous-dependencies': 'off',
      'class-methods-use-this': 'off',
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'no-console': [
        'error',
        {
          allow: ['warn'],
        },
      ],

      '@typescript-eslint/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
    },
  },
];

const importPlugin = require('eslint-plugin-import');
const eslint = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const { fixupConfigRules } = require('@eslint/compat');
const tseslint = require('typescript-eslint');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  ...fixupConfigRules(
    compat.extends('plugin:prettier/recommended', 'prettier'),
  ),
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.{ts,js,mjs}'],

    languageOptions: {
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        NodeJS: true,
        jest: true,
        ...globals.browser,
        ...globals.node,
      },

      parser: tseslint.parser,
      ecmaVersion: 6,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },

    settings: {
      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*.test.ts', '**/*.spec.ts', 'eslint.config.js'],
        },
      ],
      'import/no-unresolved': 'error',

      '@typescript-eslint/prefer-nullish-coalescing': 'off',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            // Built-in imports (come from NodeJS native) go first
            'external',
            // <- External imports
            'internal',
            // <- Absolute imports
            ['sibling', 'parent'],
            // <- Relative imports, the sibling and parent types they can be mingled together
            'index',
            // <- index imports
            'unknown',
            // <- unknown
          ],
          'newlines-between': 'always',
          alphabetize: {
            /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
            order: 'asc',
            /* ignore case. Options: [true, false] */
            caseInsensitive: true,
          },
        },
      ],
      // 'unicorn/prefer-ternary': ['error', 'only-single-line'],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_next',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',

      'no-await-in-loop': 0,

      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],

      'no-restricted-syntax': [
        'error',
        'ForInStatement',
        'LabeledStatement',
        'WithStatement',
      ],
      'import/prefer-default-export': 0,
      'class-methods-use-this': 0,

      'import/default': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
];

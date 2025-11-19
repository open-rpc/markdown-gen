import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import globals from "globals";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  eslint.configs.recommended,
  // Add ignores as a separate config object
  {
    ignores: [
      "package.json",
      "node_modules/",
      "**/dist/",
      "dist/",
      "docs/",  // This will now work
      "build/",
      "coverage/",
      "*.config.js",
      "**/*.config.ts",
      "vitest.config.ts",
      "vite.config.ts",
      "build.ts",
      "**/build.ts",
      "bun.lockb",
      "packages/example-site/",
    ]
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './packages/markdown-generator/tsconfig.json',
          './packages/docusaurus-plugin/tsconfig.json',
          './packages/json-schema-renderer/tsconfig.json',
          './packages/json-schema-renderer/tsconfig.eslint.json'
        ],
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.node,
        ...globals.es6,
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prettier': prettierPlugin
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prettier/prettier': 'error'
    },
    settings: { }
  },
  prettierConfig
];

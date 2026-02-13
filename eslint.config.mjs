// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
<<<<<<< HEAD
    ignores: ['eslint.config.mjs'],
=======
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**', 'prod-boilertask/**'],
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
<<<<<<< HEAD
      sourceType: 'commonjs',
=======
      sourceType: 'module',
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
<<<<<<< HEAD
=======
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
      '@typescript-eslint/require-await': 'warn',
>>>>>>> 942d8da489735a8b7ecaa49c6c20563f43f51616
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);

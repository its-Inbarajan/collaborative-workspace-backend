import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig({
  ignores: [
    'dist',
    'node_modules',
    '**/*.d.ts'
  ]
}, [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals:
        globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },
  tseslint.configs.recommended
]);

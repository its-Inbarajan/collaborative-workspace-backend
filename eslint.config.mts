import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals:
        globals.node,
      // {
      //   process: 'readonly',
      //   __dirname: 'readonly',
      //   module: 'readonly',
      //   require: 'readonly'
      // }
    },
    ignores: [
      'dist',
      'node_modules',
      '**/*.d.ts'
    ]
  },
  tseslint.configs.recommended,
]);

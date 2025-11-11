import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // React rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // Next.js specific
      "@next/next/no-img-element": "off",
      "@next/next/no-page-custom-font": "off",

      // General rules
      "no-console": "off",
      "prefer-const": "off",
      "no-unused-expressions": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      ".turbo/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "src/components/ui/**",
      "src/test/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default eslintConfig;
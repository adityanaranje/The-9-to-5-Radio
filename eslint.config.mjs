import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { env: { browser: true, node: true, es2020: true } },
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "eslint:recommended"),
];

export default eslintConfig;

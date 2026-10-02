import eslint from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["dist/", "coverage/"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Ultimo: spegne le regole di stile che andrebbero in conflitto con Prettier
  prettier,
);

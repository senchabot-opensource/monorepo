import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import tailwindcss from "eslint-plugin-tailwindcss";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: [
        ...nextCoreWebVitals,
        ...compat.extends("prettier"),
        ...compat.extends("plugin:tailwindcss/recommended")
    ],

    plugins: {
        tailwindcss,
    },

    settings: {
        tailwindcss: {
            callees: ["cn", "cva"],
            config: "tailwind.config.js",
        },
    },

    rules: {
        "tailwindcss/no-custom-classname": "off",
        "tailwindcss/classnames-order": "off",
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
        parser: tsParser,
    },
}]);
import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettier.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: ["dist/*", "coverage/*", "node_modules/*"],
  },
  {
    files: ["**/*.test.js"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },
];

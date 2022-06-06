module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "sort-imports": "off",
    "prefer-const": [
      "warn",
      {
        destructuring: "all",
      },
    ],
    "@typescript-eslint/consistent-type-assertions": [
      "warn",
      {
        assertionStyle: "never",
      },
    ],
    indent: "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        varsIgnorePattern: "(^_)",
        argsIgnorePattern: "(^_)",
        args: "all",
      },
    ],
  },
};

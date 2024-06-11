const packageJson = require("./package.json");

/** @type {import('jest').Config} */
module.exports = {
  displayName: packageJson.name,
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/__tests__/*.test.ts"],
};

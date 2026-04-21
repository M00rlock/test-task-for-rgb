import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  coverageDirectory: "../coverage",
  collectCoverageFrom: ["**/*.ts", "!**/*.dto.ts", "!**/*.module.ts", "!**/main.ts"]
};

export default config;

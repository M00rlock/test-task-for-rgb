/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  rootDir: "src",
  testRegex: ".*\\.spec\\.tsx?$",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }]
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.css$": "<rootDir>/../__mocks__/fileMock.js"
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  coverageDirectory: "../coverage"
};

module.exports = config;

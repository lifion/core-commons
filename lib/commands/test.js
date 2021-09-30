'use strict';

const path = require('path');

async function handler() {
  const cfg = {
    collectCoverage: true,
    collectCoverageFrom: ['**/*.js'],
    coverageDirectory: path.resolve(process.cwd(), 'coverage'),
    coverageReporters: ['clover', 'lcov', 'text'],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    rootDir: path.resolve(process.cwd(), 'lib'),
    testEnvironment: 'node'
  };
  process.argv.push('--config', JSON.stringify(cfg));
  require('jest/bin/jest');
}

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Run tests with Jest.',
  handler
};

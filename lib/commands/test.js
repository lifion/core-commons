'use strict';

const merge = require('merge-options');
const path = require('path');

const { loadConfig } = require('../utils');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Run tests with Jest.',
  handler: async () => {
    const { $ } = await import('zx/core');
    if (process.argv[2] === command) {
      process.argv.splice(2, 1);
    }
    $.verbose = false;
    await $`mkdir -p ./reports`;
    const { test } = await loadConfig();
    const baseCfg = {
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
      testEnvironment: 'node',
      testMatch: ['**/*.test.js']
    };
    const cfg = merge(baseCfg, test);
    process.argv.push('--config', JSON.stringify(cfg));
    require('jest/bin/jest');
  }
};

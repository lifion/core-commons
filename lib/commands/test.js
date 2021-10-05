'use strict';

const merge = require('merge-options');
const path = require('path');
const { $ } = require('zx');

const { loadConfig } = require('../utils');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Run tests with Jest.',
  handler: async () => {
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
      testEnvironment: 'node'
    };
    const cfg = merge(baseCfg, test);
    process.argv.push('--config', JSON.stringify(cfg));
    require('jest/bin/jest');
  }
};

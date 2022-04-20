'use strict';

const path = require('path');
const { $ } = require('zx');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Check the codebase with ESLint.',
  handler: async () => {
    process.env.FORCE_COLOR = '3';
    if (process.argv[2] === command) {
      process.argv.splice(2, 1);
    }
    process.argv.push(...[['.'], ['--ext', '.js,.json,.md'], ['--ignore-pattern', '!.*.*']].flat());
    try {
      $.verbose = false;
      await $`./node_modules/.bin/eslint ${process.argv.slice(2)}`;
    } catch (/** @type {*} */ err) {
      const { exitCode, stdout } = err;
      console.error(stdout.replace('\n', '').trimEnd());
      process.exit(exitCode);
    }
  }
};

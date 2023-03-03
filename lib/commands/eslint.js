'use strict';

const path = require('path');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Check the codebase with ESLint.',
  handler: async () => {
    const { $, ProcessOutput } = await import('zx/core');
    process.env.FORCE_COLOR = '3';
    if (process.argv[2] === command) {
      process.argv.splice(2, 1);
    }
    process.argv.push(...[['.'], ['--ext', '.js,.json,.md'], ['--ignore-pattern', '!.*.*']].flat());
    try {
      $.verbose = false;
      await $`./node_modules/.bin/eslint ${process.argv.slice(2)}`;
    } catch (err) {
      if (err instanceof ProcessOutput) {
        const { exitCode, stderr, stdout } = err;
        const out = stdout?.toString() || stderr?.toString() || '';
        console.error(out.replace('\n', '').trimEnd());
        process.exit(exitCode || 1);
      } else {
        throw err;
      }
    }
  }
};

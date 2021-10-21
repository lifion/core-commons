'use strict';

const path = require('path');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Check the codebase with ESLint.',
  handler: async () => {
    if (process.argv[2] === command) {
      process.argv.splice(2, 1);
    }
    process.argv.push(...[['.'], ['--ext', '.js,.json,.md'], ['--ignore-pattern', '!.*.*']].flat());
    require('eslint/bin/eslint');
  }
};

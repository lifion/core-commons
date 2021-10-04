'use strict';

const path = require('path');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Check the codebase with ESLint.',
  handler: async () => {
    process.argv.push(...[['.'], ['--ext', '.js,.json,.md'], ['--ignore-pattern', '!.*.*']].flat());
    require('eslint/bin/eslint');
  }
};

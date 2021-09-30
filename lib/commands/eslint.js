'use strict';

const path = require('path');

async function handler() {
  process.argv.push(
    ...[['.'], ['--ext', '.js,.json,.md'], ['--ignore-pattern', '!.*.*']].flatMap((i) => i)
  );
  require('eslint/bin/eslint');
}

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Check the codebase with ESLint.',
  handler
};

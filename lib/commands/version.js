'use strict';

const path = require('path');

async function handler() {
  process.argv.push(
    ...[
      ['--package'],
      ['--commit-limit', 'false'],
      ['--template', path.resolve(__dirname, '../../shared/CHANGELOG.hbs')]
    ].flatMap((i) => i)
  );
  require('auto-changelog');
}

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Generate the changelog.',
  handler
};

'use strict';

const path = require('path');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Generate the changelog.',
  handler: async () => {
    const { $ } = await import('zx/core');
    $.verbose = false;
    process.argv.push(
      ...[
        ['--commit-limit', 'false'],
        ['--package'],
        ['--template', path.resolve(__dirname, '../../shared/CHANGELOG.hbs')]
      ].flat()
    );
    require('auto-changelog');
    process.once('beforeExit', async () => {
      try {
        await $`git add ./CHANGELOG.md`;
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }
};

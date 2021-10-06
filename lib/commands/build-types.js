'use strict';

const path = require('path');
const { $ } = require('zx');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Build the types with TypeScript.',
  handler: async () => {
    $.verbose = false;
    const cli = path.relative(process.cwd(), path.resolve(__dirname, '../../bin/cli.js'));
    await $`${cli} clean-types`;
    process.argv.push('--emitDeclarationOnly');
    require('typescript/bin/tsc');
  }
};

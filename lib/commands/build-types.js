'use strict';

const path = require('path');
const { $ } = require('zx');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Build the types with TypeScript.',
  handler: async () => {
    $.verbose = false;
    await Promise.all(
      ['./app', './bin', './lib'].map((i) =>
        $`find ${i} -name '*.d.ts' -exec rm {} \\;`.catch(() => {})
      )
    );
    if (process.argv.slice(-1)[0] === command) {
      process.argv.splice(2, 1);
    }
    process.argv.push('--emitDeclarationOnly');
    require('typescript/bin/tsc');
  }
};

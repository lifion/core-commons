'use strict';

const path = require('path');
const { $ } = require('zx');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Delete all the types generated with TypeScript.',
  handler: async () => {
    $.verbose = false;
    await Promise.all(
      ['./app', './bin', './lib'].map((i) =>
        $`find ${i} -name '*.d.ts' -exec rm {} \\;`.catch(() => {})
      )
    );
  }
};

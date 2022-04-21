'use strict';

const path = require('path');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Delete all the types generated with TypeScript.',
  handler: async () => {
    const { $ } = await import('zx');
    $.verbose = false;
    await Promise.all(
      ['./app', './bin', './lib'].map((i) =>
        $`find ${i} -name '*.d.ts' -exec rm {} \\;`.catch(() => {})
      )
    );
  }
};

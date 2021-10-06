'use strict';

const path = require('path');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Check the types with TypeScript.',
  handler: async () => {
    process.argv.push('--noEmit');
    require('typescript/bin/tsc');
  }
};

'use strict';

const path = require('path');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Check the types with TypeScript.',
  handler: async () => {
    if (process.argv.slice(-1)[0] === command) {
      process.argv.splice(2, 1);
    }
    process.argv.push('--noEmit');
    require('typescript/bin/tsc');
  }
};

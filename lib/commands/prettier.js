'use strict';

const path = require('path');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Format the codebase with Prettier.',
  handler: async () => {
    if (process.argv[2] === command) {
      process.argv.splice(2, 1);
    }
    const exts = ['hbs', 'js', 'json', 'md', 'ts'];
    process.argv.push('--write', `**/*.{${exts.join(',')}}`, '.*rc', '!coverage/**/*');
    require('prettier/bin-prettier');
  }
};

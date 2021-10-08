'use strict';

const path = require('path');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Format the codebase with Prettier.',
  handler: async () => {
    const exts = ['hbs', 'js', 'json', 'md', 'ts'];
    if (process.argv.slice(-1)[0] === command) {
      process.argv.splice(2, 1);
    }
    process.argv.push('--write', `**/*.{${exts.join(',')}}`, '.*rc', '!coverage/**/*');
    require('prettier/bin-prettier');
  }
};

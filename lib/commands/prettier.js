'use strict';

const path = require('path');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Format the codebase with Prettier.',
  handler: async () => {
    const exts = ['hbs', 'js', 'json', 'md', 'ts'];
    process.argv.push('--write', `**/*.{${exts.join(',')}}`, '.*rc', '!reports/*');
    require('prettier/bin-prettier');
  }
};

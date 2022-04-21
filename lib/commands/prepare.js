'use strict';

const path = require('path');

const { pathFromCwd } = require('../utils');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Run configuration and project preparation tasks',
  handler: async () => {
    const { $ } = await import('zx');
    $.verbose = false;
    const excludesFile = pathFromCwd(__dirname, '../../shared/git-ignore.txt');
    await $`git config core.excludesFile ${excludesFile}`;
    const hooksPath = pathFromCwd(__dirname, '../../shared/git-hooks');
    await $`git config core.hooksPath ${hooksPath}`;
    require('check-engines/bin/check-engines');
  }
};

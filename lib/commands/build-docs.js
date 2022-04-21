'use strict';

const jsdocToMd = require('jsdoc-to-markdown');
const path = require('path');
const { readFile, writeFile } = require('fs').promises;

const { fileExists, loadConfig } = require('../utils');

const command = path.parse(__filename).name;

module.exports = {
  command,
  describe: 'Builds the README.md file from the JSDoc in the codebase.',
  handler: async () => {
    const { $ } = await import('zx');
    if (process.argv[2] === command) {
      process.argv.splice(2, 1);
    }
    $.verbose = false;
    const cwd = process.cwd();
    const readmePath = path.resolve(cwd, 'README.md');
    const { docs } = await loadConfig();
    const { files, headingDepth, noGfm, template } = docs || {};
    const templatePath = template || path.resolve(cwd, 'docs', 'templates', 'README.hbs');
    if (!(await fileExists(templatePath))) return;
    const templateData = await readFile(templatePath, 'utf8');
    const cfg = {
      files: (Array.isArray(files) && files) || ['./lib/**/*.js'],
      'heading-depth': headingDepth ?? 2,
      'no-gfm': noGfm ?? false,
      template: templateData
    };
    const output = await jsdocToMd.render(cfg);
    await writeFile(readmePath, output, 'utf8');
    const cli = path.relative(process.cwd(), path.resolve(__dirname, '../../bin/cli.js'));
    await $`${cli} prettier`;
    await $`git add ./README.md`;
  }
};

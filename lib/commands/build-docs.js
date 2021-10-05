'use strict';

const jsdocToMd = require('jsdoc-to-markdown');
const path = require('path');
const { $ } = require('zx');
const { readFile, writeFile } = require('fs').promises;

const { loadConfig } = require('../utils');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Builds the README.md file from the JSDoc in the codebase.',
  handler: async () => {
    $.verbose = false;
    const cwd = process.cwd();
    const readmePath = path.resolve(cwd, 'README.md');
    const { docs } = await loadConfig();
    const { files, headingDepth, noGfm, template } = docs || {};
    const templatePath = template || path.resolve(cwd, 'docs', 'templates', 'README.hbs');
    const templateData = await readFile(templatePath, 'utf8');
    const cfg = {
      files: (Array.isArray(files) && files) || ['./lib/**/*.js'],
      'heading-depth': headingDepth ?? 2,
      'no-gfm': noGfm ?? false,
      template: templateData
    };
    const output = await jsdocToMd.render(cfg);
    await writeFile(readmePath, output, 'utf8');
    await $`git add ./README.md`;
  }
};

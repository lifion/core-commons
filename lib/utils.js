'use strict';

const { cosmiconfig } = require('cosmiconfig');
const { readFile } = require('fs').promises;

const { name } = require('../package.json');

/**
 * Reads the configuration for this tool from the target package.json file.
 *
 * @returns {Promise<Object>}
 */
async function readConfig() {
  try {
    const { filepath } = await cosmiconfig(name, {
      searchPlaces: ['package.json']
    }).search();
    const pkg = JSON.parse(await readFile(filepath, 'utf8'));
    return pkg[name];
  } catch {
    return {};
  }
}

module.exports = { readConfig };

'use strict';

const path = require('path');
const { cosmiconfig } = require('cosmiconfig');
const { readFile } = require('fs').promises;

const { name } = require('../package.json');

/**
 * Loads the configuration for this tool from the target package.json file.
 *
 * @returns {Promise<Object>}
 */
async function loadConfig() {
  try {
    const { filepath } = await cosmiconfig(name, {
      searchPlaces: ['package.json']
    }).search();
    const pkg = JSON.parse(await readFile(filepath, 'utf8'));
    return pkg[name] || {};
  } catch {
    return {};
  }
}

/**
 * Resolves a relative from the current working dir to the given path parts.
 *
 * @param {...string} args - The path parts.
 * @returns {string}
 */
function pathFromCwd(...args) {
  return path.relative(process.cwd(), path.resolve(...args));
}

module.exports = { loadConfig, pathFromCwd };

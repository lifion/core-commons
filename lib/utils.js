'use strict';

const path = require('path');
const { cosmiconfig } = require('cosmiconfig');
const { readFile, writeFile } = require('fs').promises;

const { name } = require('../package.json');

const PKG_FILE = 'package.json';

/**
 * Loads the configuration for this tool from the target package.json file.
 *
 * @returns {Promise<*>}
 */
async function loadConfig() {
  try {
    /** @type {*} */
    const { filepath } = await cosmiconfig(name, {
      searchPlaces: [PKG_FILE]
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

/**
 * Loads the contents of the package.json file at the target folder.
 *
 * @returns {Promise<*>}
 */
async function loadPackage() {
  const filePath = path.resolve(process.cwd(), PKG_FILE);
  return JSON.parse(await readFile(filePath, 'utf8'));
}

/**
 * Stores the given object as the package.json file at the target folder.
 *
 * @param {*} pkg - The contents to store.
 * @returns {Promise<void>}
 */
async function storePackage(pkg) {
  const filePath = path.resolve(process.cwd(), PKG_FILE);
  const pkgStr = `${JSON.stringify(pkg, null, 2)}\n`;
  return writeFile(filePath, pkgStr, 'utf8');
}

module.exports = { loadConfig, loadPackage, pathFromCwd, storePackage };

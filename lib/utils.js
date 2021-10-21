'use strict';

const path = require('path');
const prettier = require('prettier');
const { cosmiconfig } = require('cosmiconfig');
const { constants, promises } = require('fs');

const { name } = require('../package.json');

const { access, readFile, writeFile } = promises;
const { F_OK, R_OK } = constants;

/**
 * Loads the configuration for this tool from the target package.json file.
 *
 * @returns {Promise<*>}
 */
async function loadConfig() {
  try {
    /** @type {*} */
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
  const result = path.relative(process.cwd(), path.resolve(...args));
  return !result.startsWith('.') ? `./${result}` : result;
}

/**
 * Loads the contents of the package.json file at the target folder.
 *
 * @param {string} file - The path of the file to load.
 * @returns {Promise<*>}
 */
async function loadJsonFile(file) {
  const filePath = path.resolve(process.cwd(), file);
  return JSON.parse(await readFile(filePath, 'utf8'));
}

/**
 * Stores the given object as the package.json file at the target folder.
 *
 * @param {string} file - The path to the file to write.
 * @param {*} data - The contents to store.
 * @returns {Promise<void>}
 */
async function storeJsonFile(file, data) {
  const filePath = path.resolve(process.cwd(), file);
  const dataStr = JSON.stringify(data);
  const fileData = prettier.format(dataStr, { filepath: file });
  return writeFile(filePath, fileData, 'utf8');
}

/**
 * Checks if the given file path exists and is readable.
 *
 * @param {string} file - The path of the file to check.
 * @returns {Promise<boolean>}
 */
async function fileExists(file) {
  try {
    await access(file, F_OK | R_OK);
    return true;
  } catch {
    return false;
  }
}

module.exports = { fileExists, loadConfig, loadJsonFile, pathFromCwd, storeJsonFile };

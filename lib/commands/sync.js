'use strict';

const path = require('path');

const { loadJsonFile, pathFromCwd, storeJsonFile } = require('../utils');
const { name } = require('../../package.json');

module.exports = {
  command: path.parse(__filename).name,
  describe: 'Synchronizes the current codebase with core-commons.',
  handler: async () => {
    const { $ } = await import('zx');

    const pkg = await loadJsonFile('./package.json');
    const { name: targetName, devDependencies = {} } = pkg;
    const devDeps = new Set(Object.keys(devDependencies));

    // Uninstall unneeded development dependencies.
    const toUninstall = [];
    for (const devDep of [
      'auto-changelog',
      'check-engines',
      'codecov',
      'eslint',
      'eslint-config-lifion',
      'husky',
      'jest',
      'jsdoc-to-markdown',
      'lint-staged',
      'npm-watch',
      'pinst',
      'prettier'
    ]) {
      if (!devDeps.has(devDep)) continue;
      toUninstall.push(devDep);
      Object.assign(devDependencies, { [devDep]: undefined });
    }
    if (toUninstall.length > 0) {
      await $`npm un ${toUninstall.join(' ')}`;
    }

    // Remove husky's files, change the git configuration.
    await $`rm -rf ./.husky ./.gitignore ./.npmignore`;
    await $`npx commons prepare`;

    // Remove auto-changelog's configuration, delete the template.
    await $`rm -rf ./.auto-changelog ./templates/CHANGELOG.hbs`;

    // Move the README template.
    await $`mkdir -p ./docs/templates`;
    await $`mv ./templates/README.hbs ./docs/templates/README.hbs || true`;
    await $`rm -rf ./templates`;

    // Setup ESLint so it uses the shared configuration.
    await $`rm -f ./.eslintignore ./.lintstagedrc`;
    const { overrides, rules } = await loadJsonFile('./.eslintrc');
    const eslintConfigPath = pathFromCwd(__dirname, '../../shared/eslint.json');
    const eslintConfig = {
      extends: eslintConfigPath,
      ...(rules && { rules }),
      ...(overrides && { overrides })
    };
    await storeJsonFile('./.eslintrc', eslintConfig);

    // Remove the Prettier files.
    await $`rm -f ./.prettierrc ./.prettierignore`;
    const prettierConfigPath = pathFromCwd(__dirname, '../../shared/prettier.json');
    await storeJsonFile('./.prettierrc', prettierConfigPath);

    // Remove the Jest files.
    await $`rm -f ./.jest.json`;

    // Setup TypeScript so it uses the shared configuration.
    await $`rm -f ./jsconfig.json`;
    const tsConfigPath = pathFromCwd(__dirname, '../../shared/tsconfig.json');
    const exclude = ['**/*.test.js', '**/__mocks__', 'coverage', 'node_modules'];
    const tsConfig = { extends: tsConfigPath };
    Object.assign(tsConfig, { exclude });
    await storeJsonFile('./tsconfig.json', tsConfig);

    // Copy the license and code of conduct.
    await $`cp ${path.resolve(__dirname, '../../CODE_OF_CONDUCT.md')} . || true`;
    await $`cp ${path.resolve(__dirname, '../../LICENSE')} . || true`;

    // Hook the scripts with commons.
    const cmd = name === targetName ? './bin/cli.js' : 'commons';
    pkg.scripts = {
      'build-docs': cmd,
      'build-types': cmd,
      'check-types': cmd,
      'clean-types': cmd,
      eslint: cmd,
      prepare: cmd,
      prepublishOnly: 'npm run build-types && npm run prettier',
      prettier: cmd,
      test: cmd,
      version: cmd
    };

    // Remove the legacy core-commons tag.
    pkg['@lifion/core-commons'] = undefined;

    // Store the changes in the target package.json file.
    await storeJsonFile('./package.json', pkg);

    // Upgrade and reconcile dependencies.
    await $`npx lifion-verify-deps -u`;
    await $`rm -rf ./node_modules ./package-lock.json`;
    await $`npm install`;
  }
};

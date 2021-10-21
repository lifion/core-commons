#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const yargs = require('yargs');

const { description, homepage } = require('../package.json');

(async function start() {
  const argv = process.argv.slice(2);
  const learnMore = `Read the manual at ${homepage}`;
  const { npm_lifecycle_event: lifecycleEvent } = process.env;

  if ((argv.length === 0 || argv[0].startsWith('--')) && lifecycleEvent) {
    argv.splice(0, 0, lifecycleEvent);
  }

  if (argv.length > 1) {
    argv.splice(1, 0, '--');
  }

  yargs(argv)
    .usage(`${description}\n\n${chalk.bold('USAGE')}\n  $0 <command> [options]`)
    .epilogue(`${chalk.bold('LEARN MORE')}\n  ${learnMore}`)
    .commandDir(path.resolve(__dirname, '../lib/commands'))
    .demandCommand()
    .recommendCommands()
    .strict()
    .help()
    .updateStrings({
      'Commands:': chalk.bold('COMMANDS'),
      'Options:': chalk.bold('OPTIONS')
    })
    .parse();
})();

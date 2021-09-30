#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const path = require('path');
const yargs = require('yargs');

async function start() {
  const argv = process.argv.slice(2);
  const header = 'Development framework by and for the Core Team.';
  const learnMore = 'Read the manual at https://core.lifion.oneadp.com/libs/core-commons';
  const { npm_lifecycle_event: lifecycleEvent } = process.env;

  if (lifecycleEvent) {
    argv.push(lifecycleEvent);
  }

  yargs(argv)
    .usage(`${header}\n\n${chalk.bold('USAGE')}\n  $0 <command> [options]`)
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
}

start();

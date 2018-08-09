#!/usr/bin/env node

'use strict';

/*
 * Provide a title to the process in `ps`.
 * Due to an obscure Mac bug, do not start this title with any symbol.
 */
process.title = 'webservice-mocker';

const cli = require('../lib/cli/cli'),
  chalk = require('chalk');

const version = process.version.substr(1).split('.');

if (Number(version[0]) < 8 || (Number(version[0]) === 8 && Number(version[1]) < 5)) {
  process.stderr.write(`You are running version ${process.version} of Node.js.\n` + 
    'The lowest supported version of Node.js is 8.5.\n' +
    'Please visit https://nodejs.org/en/ to find instructions on how to update Node.js.');

  process.exit(3);
}


cli({ args: process.argv.slice(2) })
  .then(exitCode => process.exit(exitCode))
  .catch(e => {
    console.error(chalk.red('Unknown error: '));
    console.error(e);
    process.exit(127);
  });

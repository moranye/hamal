#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');

const pkg = require('../package.json');
const generator = require('../lib/generator');
const list = require('../lib/list');

program
  .version(pkg.version, '-v, --version')
  .description('A boilerplate generator for front-end.')
  .usage('hamal <command> [options]');

program
  .command('init <name>')
  .description('generate a new project from a template')
  .action(generator)
  .on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new project'));
    console.log('    $ hamal init awesome-project');
    console.log();
  });

program
  .command('list')
  .description('list available official templates')
  .action(list);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
  
program.parse(process.argv);

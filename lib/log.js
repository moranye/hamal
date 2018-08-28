const chalk = require('chalk');
const symbols = require('log-symbols');
const npmScripts = require('./npm-scripts');

module.exports = {
  ok(message) {
    console.log();
    console.log(`# ${chalk.green(message)}`);
    console.log('# ========================');
    console.log();
  },

  error(message, err) {
    console.log(symbols.error, chalk.red(message));
    console.log();
    console.log(err);
    console.log();
  },

  helper(name) {
    console.log('To get started: ');
    console.log();
    console.log(`  ${chalk.yellowBright(`cd ${name}`)}`);
    console.log();

    for (let item of npmScripts) {
      console.log(`  ${chalk.gray(`# ${item.description}`)}`);
      console.log(`  ${chalk.yellowBright(item.script)}`);
      console.log();
    }
  }
};

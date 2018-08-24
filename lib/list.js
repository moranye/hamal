const chalk = require('chalk');
const templates = require('./templates');

module.exports = () => {
  const names = Object.keys(templates);

  console.log();
  for (let name of names) {
    console.log(`${chalk.yellow(name)}: ${templates[name].name}`);
  }

  console.log();
};

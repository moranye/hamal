const fs = require('fs');
const util = require('util');
const ora = require('ora');
const symbols = require('log-symbols');
const chalk = require('chalk');
const downloadGitRepo = require('download-git-repo');
const semver = require('semver');

const inquiry = require('./inquiry');
const templates = require('./templates');
const write = require('./writing');
const install = require('./install');
const packageConfig = require('../package.json');

const download = util.promisify(downloadGitRepo);

module.exports = (name) => {
  const isExists = fs.existsSync(name);

  if (isExists) {
    return console.log(
      `  The project(directory) ${chalk.yellow(name)} already exists, please select another one`
    );
  }

  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    return console.log(
      '  You must upgrade node to ' + chalk.yellow(packageConfig.engines.node) + ' to use hamal'
    );
  }

  inquiry(name)
    .then(answers => {
      const spinner = ora('Downloading template ...').start();
      const template = templates[answers.template].template;

      download(template, name)
        .then(() => {
          spinner.succeed(chalk.green('Template download successfully'));
          
          write(name, answers)
            .then(() => {
              console.log();
              console.log(`# ${chalk.green('Installing project dependencies ...')}`);
              console.log('# ========================');
              console.log();

              return install(name)
                .then(() => {
                  console.log();
                  console.log(`# ${chalk.green('Project initialization finished!')}`);
                  console.log('# ========================');
                  console.log();
                  console.log('To get started: ');
                  console.log();
                  console.log(`  ${chalk.yellowBright(`cd ${name}`)}`);
                  console.log(`  ${chalk.yellowBright('npm start')}`);
                  console.log();
                });
            })
            .catch(err => {
              console.log(symbols.error, chalk.red('Project initialization failed'));
              console.log();
              console.log(err);
              console.log();
            });
        })
        .catch(err => {
          spinner.fail(chalk.red('Template download failed'));
          console.log();
          console.log(err);
          console.log();
        });
    })
};

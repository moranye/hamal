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
const log = require('./log');
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
              log.ok('Installing project dependencies ...');

              return install(name)
                .then(() => {
                  log.ok('Project initialization finished!');
                  log.helper(name);
                });
            })
            .catch(err => {
              log.error('Project initialization failed', err);
            });
        })
        .catch(err => {
          spinner.stop();
          log.error('Template download failed', err);
        });
    })
};

const path = require('path');
const inquirer = require('inquirer');

const gitUser = require('./git-user');
const templates = require('./templates');

module.exports = (name) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name',
      default: path.basename(name),
      validate(input) {
        return input && /^[a-z]+([_-][a-z]+)*$/.test(input.trim()) ? 
          true : `examples: awesome-project or awesome_project`
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'An awesome project'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author',
      default: gitUser()
    },
    {
      type: 'list',
      name: 'template',
      message: 'Pick a template',
      default: 0,
      choices: () => {
        return Object.keys(templates).map(template => {
          return { 
            name: templates[template].name, 
            value: template 
          }
        });
      }
    }
  ]);
};

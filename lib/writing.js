const fs = require('fs');
const handlebars = require('handlebars');

const { capitalizeWords } = require('./utils');

const rewirteFile = (fileName, metadata) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        return reject(err);
      }

      data = handlebars.compile(data.toString())(metadata);

      fs.writeFile(fileName, data, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
};

module.exports = (projectName, metadata) => {
  const packageJson = `${projectName}/package.json`,
    readme = `${projectName}/README.md`;

  Object.assign(metadata, {
    contributors: [metadata.author]
  });

  return Promise.all([
    rewirteFile(packageJson, metadata),
    rewirteFile(readme, Object.assign({}, metadata, {
      title: capitalizeWords(metadata.name)
    }))
  ]);
};

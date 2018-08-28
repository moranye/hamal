const fs = require('fs');
const handlebars = require('handlebars');

const { capitalizeWords } = require('./utils');

const rewirteFile = (fileName, metadata) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        return reject(err);
      }

      // 如果 package.name 模板化，boilerplate 项目运行调试会比较麻烦，所以直接解析改写 package.name -> metadata.name
      if (/package\.json$/.test(fileName)) {
        try {
          data = Object.assign(JSON.parse(data.toString()), {
            name: metadata.name
          });
          data = JSON.stringify(data);
        } catch(err) {
          return reject(err);
        }
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

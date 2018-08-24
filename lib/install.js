const path = require('path');
const { spawn } = require('child_process');

module.exports = (name) => {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['i'], { cwd: path.resolve(process.cwd(), name), stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code !== 0) {
        return reject();
      }

      resolve();
    })
  });
};

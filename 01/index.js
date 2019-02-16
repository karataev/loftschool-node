const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const argv = require('yargs')
  .example('node index.js --entry input --output output')
  .describe('entry', 'Entry path')
  .describe('output', 'Output path')
  .demandOption(['entry'])
  .argv;

function getCategories (srcDir, cb) {
  let result = {};
  let dirCount;

  function processDir (dir) {
    fs.readdir(dir, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        let fileAbsPath = path.join(dir, file);
        if (fs.lstatSync(fileAbsPath).isFile()) {
          let key = file[0].toLowerCase();
          if (key === '.') key = 'dot';
          let fileObj = {
            filename: file,
            fullPath: path.join(dir, file)
          };
          result[key] ? result[key].push(fileObj) : result[key] = [fileObj];
        } else {
          dirCount++;
          processDir(fileAbsPath);
        }
      });
      dirCount--;
      if (dirCount === 0) cb(result);
    });
  }

  let srcDirPath = path.join(__dirname, srcDir);
  if (!fs.existsSync(srcDirPath)) {
    cb(null);
    return;
  }
  dirCount = 1;
  processDir(srcDirPath);

  return result;
}

function copyFiles (data, distDir) {
  let outputRootDir = path.join(__dirname, distDir);

  fs.mkdir(outputRootDir, (err) => {
    if (err) throw err;
    let keys = Object.keys(data);
    keys.forEach(key => {
      let letterDir = path.join(outputRootDir, key);
      fs.mkdir(letterDir, err => {
        if (err) throw err;
        let items = data[key];
        items.forEach(item => {
          fs.copyFileSync(item.fullPath, path.join(letterDir, item.filename), err => {
            if (err) throw err;
          });
        });
      });
    });
  });
}

function start () {
  let entry = argv.entry || 'input';
  let output = argv.output || 'output';

  getCategories(entry, categories => {
    if (!categories) return;

    rimraf(path.join(__dirname, output), () => {
      copyFiles(categories, output);
    });
  });
}

start();

const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

function parseArgs (argv) {
  let args = argv
    .slice(2)
    .map(item => item.split('='));

  let result = {};
  args.forEach(item => {
    result[item[0]] = item[1];
  });
  return result;
}

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
  let config = parseArgs(process.argv);

  getCategories(config.src, categories => {
    if (!categories) return;

    rimraf(path.join(__dirname, config.dist), () => {
      copyFiles(categories, config.dist);
    });
  });
}

start();

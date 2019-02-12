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

// TODO: sync -> callbacks
function getCategories (srcDir) {
  let result = {};

  function processDir (dir) {
    let files = fs.readdirSync(dir);

    files.forEach(file => {
      let fileAbsPath = path.join(dir, file);
      if (fs.lstatSync(fileAbsPath).isFile()) {
        let key = file[0].toLowerCase();
        let fileObj = {
          filename: file,
          fullPath: path.join(dir, file)
        };
        result[key] ? result[key].push(fileObj) : result[key] = [fileObj];
      } else {
        processDir(fileAbsPath);
      }
    });
  }

  let srcDirPath = path.join(__dirname, srcDir);
  if (!fs.existsSync(srcDirPath)) return null;
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
          fs.copyFile(item.fullPath, path.join(letterDir, item.filename), err => {
            if (err) throw err;
          });
        });
      });
    });
  });
}

function start () {
  let config = parseArgs(process.argv);

  let categories = getCategories(config.src);
  if (!categories) return;

  rimraf(path.join(__dirname, config.dist), () => {
    copyFiles(categories, config.dist);
  });
}

start();

/* eslint-disable no-trailing-spaces */
const path = require('path');
const rimraf = require('rimraf');
const fs = require('mz/fs');
const argv = require('yargs')
  .example('node index.js --entry input --output output')
  .describe('entry', 'Entry path')
  .describe('output', 'Output path')
  .describe('delete', 'Delete entry folder after copying files')
  .default('output', 'output')
  .demandOption(['entry'])
  .argv;

function getFolders (srcDir) {
  return new Promise((resolve, reject) => {
    let result = {};
    let dirCount;

    async function processDir (dir) {
      let dirContents = await fs.readdir(dir);

      dirContents.forEach(entity => {
        let entityPath = path.join(dir, entity);
        if (fs.lstatSync(entityPath).isFile()) {
          let key = entity[0].toUpperCase();
          if (key === '.') key = 'dot';
          let fileObj = {
            filename: entity,
            fullPath: path.join(dir, entity)
          };
          result[key] ? result[key].push(fileObj) : result[key] = [fileObj];
        } else {
          dirCount++;
          processDir(entityPath);
        }
      });
      dirCount--;
      if (dirCount === 0) resolve(result);
    }
    let srcDirPath = path.join(__dirname, srcDir);
    dirCount = 1;
    processDir(srcDirPath);
  });
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function copyFiles (data, distDir) {
  let outputRootDir = path.join(__dirname, distDir);

  await fs.mkdir(outputRootDir);
  let keys = Object.keys(data);
  await asyncForEach(keys, async key => {
    let letterDir = path.join(outputRootDir, key);
    await fs.mkdir(letterDir);
    let items = data[key];
    await asyncForEach(items, async item => {
      await fs.copyFile(item.fullPath, path.join(letterDir, item.filename));
    });
  });
}

async function start () {
  let entry = argv.entry;
  let output = argv.output;
  let shouldDelete = !!argv.delete;

  getFolders(entry)
    .then(folders => {
      rimraf(path.join(__dirname, output), async () => {
        await copyFiles(folders, output);
        if (shouldDelete) {
          rimraf(path.join(__dirname, entry), () => {
            // done
          });
        }
      });
    });
}

start();

const fs = require('mz/fs');
const path = require('path');

let resultFileName = 'glued.js';

fs.readdir('.')
.then(files => {
  fs.writeFileSync(resultFileName, '', 'utf8');
  files.forEach(file => {
    if (!fs.lstatSync(file).isFile() || path.extname(file) !== '.js') return;

    let data = fs.readFileSync(file, 'utf8');
    fs.appendFileSync(resultFileName, `//${file}\n`, 'utf8');
    fs.appendFileSync(resultFileName, data, 'utf8');
  });

});

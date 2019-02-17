const fs = require('fs');

let readStream = fs.createReadStream('data.txt', 'utf8');
let writeStream = fs.createWriteStream('output.txt', 'utf8');
readStream.on('data', data => {
  writeStream.write(data.toUpperCase());
});
readStream.on('end', () => {
  writeStream.end();
});

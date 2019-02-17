const request = require('request');
const fs = require('fs');

let writeStream = fs.createWriteStream('site.html', 'utf8');

let readStream = request('https://pizzasinizza.ru');

readStream.on('data', data => {
  console.log(data);
});

readStream.pipe(writeStream);

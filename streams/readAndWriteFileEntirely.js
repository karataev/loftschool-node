const fs = require('fs');

fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  fs.writeFile('output.txt', data, (err) => {
    if (err) throw err;
  });
});

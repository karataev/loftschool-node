const fs = require('fs');
const http = require('http');

const argv = require('yargs')
  .example('node server.js --interval 1 --time 5')
  .describe('interval', 'Time interval to spam console.log with current date (seconds)')
  .describe('time', 'Time to wait before send response (seconds)')
  .demandOption(['interval', 'time'])
  .argv;

function startServer(interval, time) {
  http.createServer((req, res) => {
    if (req.url === '/') {
      let intervalId = setInterval(() => {
        console.log(new Date().toISOString());
      }, interval * 1000);

      setTimeout(() => {
        clearInterval(intervalId);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(new Date().toISOString());
        res.end();
      }, time * 1000);

    } else {
      res.end();
    }

  }).listen(8080);
}

startServer(argv.interval, argv.time);

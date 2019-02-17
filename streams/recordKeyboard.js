process.stdin.setEncoding('utf-8');

console.log('Type anything. Enter "exit" to quit.');
var inputData = '';

function exit () {
  console.log('----OUTPUT----');
  process.stdout.write(inputData);
  process.exit();
}

process.stdin.on('data', function (input) {
  console.log('---Received data event---');
  inputData += input;
  if (input.trim() === 'exit') {
    exit();
  }
});

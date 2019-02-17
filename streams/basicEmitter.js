const EventEmitter = require('events');

let basicEmitter = new EventEmitter();

basicEmitter.once('newListener', () => {
  console.log('added new listener');
});

basicEmitter.on('event', (e) => {
  console.log('got event', e);
});

basicEmitter.emit('event', 'foo');

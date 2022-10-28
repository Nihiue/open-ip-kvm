const path = require('path');
const url = require('url');

const ws = require('ws');
const Koa = require('koa');
const app = new Koa();
const { SerialPort } = require('serialport');

app.use(require('koa-static')(path.join(__dirname, '../public')));

const server = app.listen(8000);
console.log('listen on 8000...');

const wsInstance = new ws.WebSocketServer({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
  const { pathname } = url.parse(request.url);

  if (pathname === '/websocket') {
    wsInstance.handleUpgrade(request, socket, head, function done(ws) {
      wsInstance.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

const serialport = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 19200,
});

console.log('serialport ready');

function writeSerial(numArr) {
  const buf = Buffer.from(numArr);
  serialport.write(buf);
}

wsInstance.on('connection', function connection(ws) {
  console.log('new ws connection');
  ws.on('message', function message(data) {
    const msg = JSON.parse(data.toString());
    switch (msg.type) {
      case 'write_serial':
        writeSerial(msg.payload);
        break;
    }
  });

  ws.send(JSON.stringify({
    type: 'welcome',
    payload: 'Open IP-KVM Server'
  }));
});

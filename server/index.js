const path = require('path');
const url = require('url');

const config = require("./config.json");

config.app_title = config.app_title || 'Open IP-KVM';
config.mjpg_streamer.stream_port = config.mjpg_streamer.stream_port || 8010;

const ws = require('ws');
const Koa = require('koa');
const KoaStaic = require('koa-static');

const { startSerial } = require('./serial.js');
const { startMJPGStreamer } = require('./mjpg-streamer.js');


async function start() {

  try {
    const writeSerial = startSerial(config.serialport);
    await startMJPGStreamer(config.mjpg_streamer);

    function websocketHandler(ws) {
      console.log('new websocket connection');
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
    }


    const app = new Koa();
    app.use(KoaStaic(path.join(__dirname, '../public')));

    const server = app.listen(config.listen_port);
    console.log(`listen on ${config.listen_port}...`);

    app.use(async function router(ctx) {
      if (ctx.path === '/api/config') {
        ctx.body = config;
      }
    });

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

    wsInstance.on('connection', websocketHandler);
  } catch(e) {
    console.log(e);
    process.exit(1);
  }

}

start();


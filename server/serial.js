const { SerialPort } = require('serialport');
const config = require('./config.json');

const serialport = new SerialPort({
  path: config.serialport,
  baudRate: 19200,
});

console.log(`serialport ready: ${config.serialport}`);

module.exports.writeSerial = function writeSerial(numArr) {
  const buf = Buffer.from(numArr);
  serialport.write(buf);
}
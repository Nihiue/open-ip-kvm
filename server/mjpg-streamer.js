
const { spawn } = require('child_process');
const config = require('./config.json');

module.exports.init = function init() {
  const shell = exec('mjpg_streamer', [
    '-i',
    `input_uvc.so -d ${config.mjpg_streamer.device} -r ${config.mjpg_streamer.res} -f ${config.mjpg_streamer.fps}`,
    '-o',
    `output_http.so -p 8010`
  ], {
    shell: true
  });

  shell.stdout.on('data', (data) => {
    console.log(`mjpg_streamer stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`mjpg_streamer stderr: ${data}`);
  });

  shell.on('close', (code) => {
    console.log(`mjpg_streamer exited with code ${code}`);
  });
}

init();
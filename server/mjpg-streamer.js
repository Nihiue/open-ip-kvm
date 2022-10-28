const { spawn } = require('child_process');

let shell;

function startMJPGStreamer(opt) {
  if (shell) {
    return;
  }

  return new Promise((resolve, reject) => {
    let output = '';
    const cmd = [
      'mjpg_streamer',
      '-i',
      `'input_uvc.so -d ${opt.device} -r ${opt.res} -f ${opt.fps}'`,
      '-o',
      `'output_http.so -p 8010'`,
    ].join(' ');

    shell = spawn('bash', ['-c', cmd]);

    shell.stdout.on('data', (data) => {
      output += data;
    });

    shell.stderr.on('data', (data) => {
      output += data;
      if (data.indexOf('o: HTTP TCP port........:') > -1) {
        resolve(shell);
        console.log('mjpg_streamer ready');
      }
    });

    shell.on('close', (code) => {
      console.log(output);
      reject(new Error(`mjpg_streamer exited with code ${code}`));
    });
  });
}

module.exports.startMJPGStreamer = startMJPGStreamer;

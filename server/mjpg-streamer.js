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
      `'input_uvc.so -d ${opt.device} -r ${opt.res} -f ${opt.fps} -n'`,
      '-o',
      `'output_http.so -p 8010 -n'`,
    ].join(' ');

    shell = spawn('bash', ['-c', cmd]);

    shell.stdout.on('data', (data) => {
      output += data;
    });

    shell.stderr.on('data', (data) => {
      output += data;
      if (data.indexOf('HTTP TCP port') > -1) {
        console.log('mjpg_streamer start')
        console.log(output);
        resolve(shell);
      }
    });

    shell.on('close', (code) => {
      reject(new Error(`mjpg_streamer exited with code ${code}`));
    });
  });
}

module.exports.startMJPGStreamer = startMJPGStreamer;

const { spawn } = require('child_process');

let shell;

function startMJPGStreamer(opt) {
  if (shell) {
    return;
  }

  return new Promise((resolve, reject) => {
    const cmd = [
      'mjpg_streamer',
      '-i',
      `'input_uvc.so -d ${opt.device} -r ${opt.res} -f ${opt.fps} -n'`,
      '-o',
      `'output_http.so -p ${opt.stream_port} -n'`,
    ].join(' ');

    shell = spawn('bash', ['-c', cmd]);

    shell.stdout.on('data', (data) => {
      console.log(data.toString('utf-8'));
    });

    shell.stderr.on('data', (data) => {
      const str = data.toString('utf-8');
      console.log(str);
      if (str.indexOf('HTTP TCP port') > -1) {
        console.log('mjpg_streamer start')
        resolve(shell);
      }
    });

    shell.on('close', (code) => {
      reject(new Error(`mjpg_streamer exited with code ${code}`));
    });
  });
}

module.exports.startMJPGStreamer = startMJPGStreamer;

export function init(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);

    socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });

    socket.addEventListener('error', (evt) => {
      console.log('ws error')
      reject(evt);
    });

    socket.addEventListener('close', () => {
      console.log('ws close')
    });

    socket.addEventListener('open', () => {
      console.log('ws open');
      resolve(socket);
    });
  });

}
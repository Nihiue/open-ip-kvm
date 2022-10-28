
const MOUSE_EVT_START = 249;
const EVT_END = 251;

const MOUSE_EVT_TYPE_MOVE = 1;
const MOUSE_EVT_TYPE_LEFT_DOWN = 2;
const MOUSE_EVT_TYPE_LEFT_UP = 3;
const MOUSE_EVT_TYPE_MIDDLE_DOWN  = 4;
const MOUSE_EVT_TYPE_MIDDLE_UP = 5;
const MOUSE_EVT_TYPE_RIGHT_DOWN = 6;
const MOUSE_EVT_TYPE_RIGHT_UP = 7;
const MOUSE_EVT_TYPE_WHEEL = 8;
const MOUSE_EVT_TYPE_RESET = 9;
const MOUSE_EVT_TYPE_CONFIG_MOVE_FACTOR = 10;

function sMove(n) {
  if (n < -120) {
    return 0;
  }
  if (n > 120) {
    return 240;
  }
  return n + 120;
}

export function sendEvent(channel, data, type) {

  let payload = new Array(5);
  payload.fill(0);

  payload[0] = MOUSE_EVT_START;

  if (type === 'move') {
    payload[1] = MOUSE_EVT_TYPE_MOVE;
    payload[2] = sMove(Math.round(data[0] / 1.5));
    payload[3] = sMove(Math.round(data[1] / 1.5));
  } else if (type === 'config-move-factor') {
    payload[1] = MOUSE_EVT_TYPE_CONFIG_MOVE_FACTOR;
    payload[2] = data;
  } else if (type === 'mousedown') {
    switch (data) {
      case 0:
        payload[1] = MOUSE_EVT_TYPE_LEFT_DOWN;
        break;
      case 1:
        payload[1] = MOUSE_EVT_TYPE_MIDDLE_DOWN;
        break;
      case 2:
        payload[1] = MOUSE_EVT_TYPE_RIGHT_DOWN;
        break;
      default:
        return;
    }
  } else if (type === 'mouseup') {
    switch (data) {
      case 0:
        payload[1] = MOUSE_EVT_TYPE_LEFT_UP;
        break;
      case 1:
        payload[1] = MOUSE_EVT_TYPE_MIDDLE_UP;
        break;
      case 2:
        payload[1] = MOUSE_EVT_TYPE_RIGHT_UP;
        break;
      default:
        return;
    }
  } else if(type === 'wheel') {
    payload[1] = MOUSE_EVT_TYPE_WHEEL;
    payload[2] = sMove(Math.round(data / 40));
  } else if(type === 'reset') {
    payload[1] = MOUSE_EVT_TYPE_RESET;
  } else {
    return;
  }

  payload[4] = EVT_END;

  const msg = {
    type: 'write_serial',
    payload,
  };

  channel.send(JSON.stringify(msg));
}
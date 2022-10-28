
const KB_EVT_START = 248;
const EVT_END = 251;

const KB_EVT_TYPE_KEYDOWN = 1;
const KB_EVT_TYPE_KEYUP = 2;
const KB_EVT_TYPE_RESET = 3;

// https://www.arduino.cc/reference/en/language/functions/usb/keyboard/keyboardmodifiers/
 const keyRemap = {
  Control: 0x80,
  Shift: 0x81,
  Alt: 0x82,
  Meta: 0x83,
  Tab: 0xB3,
  CapsLock: 0xC1,
  Backspace: 0xB2,
  Enter: 0xB0,
  ContextMenu: 0xED,
  Insert: 0xD1,
  Delete: 0xD4,
  Home: 0xD2,
  End: 0xD5,
  PageUp: 0xD3,
  PageDown: 0xD6,
  ArrowUp: 0xDA,
  ArrowDown: 0xD9,
  ArrowLeft: 0xD8,
  ArrowRight: 0xD7,
  PrintScreen: 0xCE,
  ScrollLock: 0xCF,
  Pause: 0xD0,
  Escape: 0xB1
};

for (let i = 0; i < 12; i += 1) {
  keyRemap[`F${1 + i}`] = 0xC2 + i;
}

function isChar(key) {
  if (!key || key.length > 1) {
    return false;
  }
  const keyAscii = key.charCodeAt(0);
  return keyAscii >= 32 && keyAscii <= 126;
}

export function sendEvent(channel, key, type) {

  // Keyboard event has fixed length of 4 bytes

  // Byte 0: Start Flag - KB_EVT_START
  // Byte 1: Data - Event Param - KB_EVT_TYPE_KEYDOWN | KB_EVT_TYPE_KEYUP | KB_EVT_TYPE_RESET
  // Byte 2: Data - Event Payload - [KeyCode to Press]
  // Byte 3: End Flag - EVT_END

  let payload = new Array(4);
  payload.fill(0);

  payload[0] = KB_EVT_START;

  if (type === 'keydown') {
    payload[1] = KB_EVT_TYPE_KEYDOWN;
  } else if (type === 'keyup') {
    payload[1] = KB_EVT_TYPE_KEYUP;
  } else if (type === 'reset') {
    payload[1] = KB_EVT_TYPE_RESET;
  } else {
    return;
  }

  if (type === 'reset') {
    payload[2] = 0;
  } else if (isChar(key)) {
    payload[2] = key.charCodeAt(0);
  } else if (keyRemap[key]) {
    payload[2] = keyRemap[key];
  } else {
    return;
  }

  payload[3] = EVT_END;

  const msg = {
    type: 'write_serial',
    payload,
  };

  // console.log(type, key, payload[2]);
  channel.send(JSON.stringify(msg));
}

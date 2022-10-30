import * as ws from './ws.mjs';
import * as kb from './kb.mjs';
import * as mouse from './mouse.mjs';

const screenEl = document.querySelector('.screen');
const streamRoot = `http://${location.hostname}:8010`;

let isKeyCaptureActive = false;
let isPointorLocked = false;
let channel;

try {
  const pingRes = await fetch(streamRoot + '/?action=snapshot');
  if (pingRes.status !== 200) {
    throw new Error('Video stream is not ready, please check mjpeg process');
  }

  channel = await ws.init(`ws://${location.host}/websocket`);
  screenEl.src = streamRoot + `/?action=stream`;

  bindScreenFocusEvents();
  bindMouseEvents();
  bindKeyboardEvents();
} catch (e) {
  alert(e.toString());
}

function bindScreenFocusEvents() {
  screenEl.addEventListener('blur', () => {
    isKeyCaptureActive = false;
    console.log('isActive = false');
    if (isPointorLocked) {
      document.exitPointerLock();
    }
    kb.sendEvent(channel, '', 'reset');
  });

  screenEl.addEventListener('focus', () => {
    isKeyCaptureActive = true;
    console.log('isActive = true');
    kb.sendEvent(channel, '', 'reset');
  });
}

function bindMouseEvents() {
  mouse.sendEvent(channel, 1, 'config-move-factor');

  const moveSlice = [0, 0];

  document.addEventListener('pointerlockchange', (evt) => {
    isPointorLocked = document.pointerLockElement === screenEl;
    console.log('isPointLocked', isPointorLocked);
    mouse.sendEvent(channel, '', 'reset');
  });

  screenEl.addEventListener('mousemove', (evt) => {
    if (!isPointorLocked) {
      return;
    }
    moveSlice[0] += evt.movementX;
    moveSlice[1] += evt.movementY;
  });

  screenEl.addEventListener('mousedown', (evt) => {
    if (!isPointorLocked) {
      if (evt.button === 0) {
        screenEl.requestPointerLock();
      }
      return;
    }
    evt.preventDefault();
    mouse.sendEvent(channel, evt.button, 'mousedown');
  });

  screenEl.addEventListener('mouseup', (evt) => {
    if (!isPointorLocked) {
      return;
    }
    mouse.sendEvent(channel, evt.button, 'mouseup');
  });

  screenEl.addEventListener('wheel', (evt) => {
    mouse.sendEvent(channel, evt.wheelDeltaY, 'wheel');
  });

  window.setInterval(() => {
    if (moveSlice[0] !== 0 || moveSlice[1] !== 0) {
      mouse.sendEvent(channel, moveSlice, 'move');
      moveSlice[0] = 0;
      moveSlice[1] = 0;
    }
  }, 30);
}

function bindKeyboardEvents() {
  document.addEventListener('keydown', (evt) => {
    if (!isKeyCaptureActive) {
      if (evt.key === 'Enter') {
        screenEl.focus();
      }
      return;
    }

    evt.preventDefault();

    if (evt.repeat) {
      return;
    }

    if (evt.key === 'Escape' && evt.shiftKey) {
      screenEl.blur();
      return;
    }
    kb.sendEvent(channel, evt.key, 'keydown');
  });

  document.addEventListener('keyup', (evt) => {
    if (!isKeyCaptureActive) {
      return;
    }
    kb.sendEvent(channel, evt.key, 'keyup');
  });

  window.testSeq = function (s) {
    kb.sendSequence(channel, s);
  }
}

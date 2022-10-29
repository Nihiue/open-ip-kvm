import * as ws from './ws.mjs';
import * as kb from './kb.mjs';
import * as mouse from './mouse.mjs';

const channel = await ws.init(`ws://${location.host}/websocket`);
const screenEl = document.querySelector('.screen');

screenEl.src = `http://${location.hostname}:8010/?action=stream`;

let isActive = false;
let pointLocked = false;

function bindScreenFocusEvents() {
  screenEl.addEventListener('blur', () => {
    isActive = false;
    console.log('isActive = false');
    if (pointLocked) {
      document.exitPointerLock();
    }
    kb.sendEvent(channel, '', 'reset');
    mouse.sendEvent(channel, '', 'reset');
  });

  screenEl.addEventListener('focus', () => {
    isActive = true;
    console.log('isActive = true');
    kb.sendEvent(channel, '', 'reset');
    mouse.sendEvent(channel, '', 'reset');
  });
}

function bindMouseEvents() {
  mouse.sendEvent(channel, 1, 'config-move-factor');

  const moveSlice = [0, 0];

  document.addEventListener('pointerlockchange', (evt) => {
    pointLocked = document.pointerLockElement === screenEl;
    console.log('pointLocked', pointLocked);
  });

  screenEl.addEventListener('mousemove', (evt) => {
    if (!pointLocked) {
      return;
    }
    moveSlice[0] += evt.movementX;
    moveSlice[1] += evt.movementY;
  });

  screenEl.addEventListener('mousedown', (evt) => {
    if (!pointLocked) {
      if (evt.button === 0) {
        screenEl.requestPointerLock();
      }
      return;
    }
    evt.preventDefault();
    mouse.sendEvent(channel, evt.button, 'mousedown');
  });

  screenEl.addEventListener('mouseup', (evt) => {
    if (!pointLocked) {
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

    if (!isActive) {
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
    if (!isActive) {
      return;
    }
    kb.sendEvent(channel, evt.key, 'keyup');
  });
}

bindScreenFocusEvents();
bindMouseEvents();
bindKeyboardEvents();

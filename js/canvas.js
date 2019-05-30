const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Var
let draw = false;
const colors = ['#FFFFFF', '#000000', '#9BFFCD', '#00CC99', '#01936F'];
let color = '#000000';
let lineWidth = 10;
let toolbar = 'pen';
// initCanvas
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = '#E8E8E8';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
// Show Colors
const showColor = () => {
  const colorList = document.querySelector('.option-colors');
  let str = '';
  for (let i = 0; i < 5; i += 1) {
    let value = colors[i];
    let check = '';
    if (colors[i] === '#FFFFFF') {
      value += '; border: 1px solid #000000;';
    }
    if (colors[i] === '#000000') {
      value += '; color: white;" class="check';
      check = '✓';
    }
    str += `<a style="background: ${value}">${check}</a>`;
  }
  colorList.innerHTML = str;
};
showColor();
// UNDO & REDO
const STACK_MAX_SIZE = 30;
const undoDataStack = [];
let redoDataStack = [];
const saveDraw = () => {
  redoDataStack = [];
  document.querySelector('.nav-redo').classList.add('disable');
  if (undoDataStack.length >= STACK_MAX_SIZE) {
    undoDataStack.pop();
  }
  undoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  document.querySelector('.nav-undo').classList.remove('disable');
};
const undo = () => {
  if (undoDataStack.length <= 0) {
    document.querySelector('.nav-undo').classList.add('disable');
    return;
  }
  redoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  document.querySelector('.nav-redo').classList.remove('disable');
  const imageData = undoDataStack.shift();
  ctx.putImageData(imageData, 0, 0);
};
const redo = () => {
  if (redoDataStack.length <= 0) {
    document.querySelector('.nav-redo').classList.add('disable');
    return;
  }
  undoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  document.querySelector('.nav-undo').classList.remove('disable');
  const imageData = redoDataStack.shift();
  ctx.putImageData(imageData, 0, 0);
};
// Start
const mouseDown = (e) => {
  saveDraw();
  draw = true;
  let setColor = color;
  if (toolbar === 'eraser') {
    setColor = '#E8E8E8';
  }
  ctx.beginPath();
  ctx.strokeStyle = setColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(e.pageX, e.pageY);
};
const touchStart = (e) => {
  saveDraw();
  const touch = e.targetTouches[0];
  e.preventDefault();
  draw = true;
  let setColor = color;
  if (toolbar === 'eraser') {
    setColor = '#E8E8E8';
  }
  ctx.beginPath();
  ctx.strokeStyle = setColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(touch.pageX, touch.pageY);
};
// Move
const mouseMove = (e) => {
  if (draw) {
    ctx.lineTo(e.pageX, e.pageY);
    ctx.stroke();
  }
};
const touchMove = (e) => {
  const touch = e.targetTouches[0];
  e.preventDefault();
  if (draw) {
    ctx.lineTo(touch.pageX, touch.pageY);
    ctx.stroke();
  }
};
// Done
const mouseUp = () => {
  draw = false;
};
const touchEnd = (e) => {
  draw = false;
  e.preventDefault();
};
// Open & Close Nav Option
const btnHandler = () => {
  document.querySelector('.nav-box').classList.toggle('hidden-nav');
  document.querySelector('.btn-t').classList.toggle('t-open');
  document.querySelector('.option-box').classList.toggle('hidden-option');
  document.querySelector('.btn-b').classList.toggle('b-open');
  const btnTop = document.querySelector('.btn-t');
  if (btnTop.textContent === '∧') {
    btnTop.textContent = '∨';
  } else {
    btnTop.textContent = '∧';
  }
  const btnBotton = document.querySelector('.btn-b');
  if (btnBotton.innerHTML === '∨') {
    btnBotton.innerHTML = '<i class="fas fa-paint-brush"></i>';
  } else {
    btnBotton.innerHTML = '∨';
  }
};
document.querySelector('.btn-t').addEventListener('click', btnHandler);
document.querySelector('.btn-b').addEventListener('click', btnHandler);
// Load
window.addEventListener('load', () => {
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('touchstart', touchStart);
  canvas.addEventListener('touchmove', touchMove);
  canvas.addEventListener('touchend', touchEnd);
});
// Nav
document.querySelector('.nav-save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  link.download = 'cancas.png';
  link.click();
});
document.querySelector('.nav-clearAll').addEventListener('click', () => {
  saveDraw();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#E8E8E8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
document.querySelector('.nav-undo').addEventListener('click', undo);
document.querySelector('.nav-redo').addEventListener('click', redo);
// Option
document.querySelector('.option-tools').addEventListener('click', () => {
  if (toolbar === 'pen') {
    toolbar = 'eraser';
  } else {
    toolbar = 'pen';
  }
  document.querySelector('.fa-paint-brush').classList.toggle('d-none');
  document.querySelector('.fa-eraser').classList.toggle('d-none');
});
document.querySelector('.option-size').addEventListener('change', (e) => {
  const num = e.target.value;
  if (num > 0 && num <= 100) {
    lineWidth = num;
  } else {
    e.target.value = 10;
  }
  const link = document.createElement('a');
  link.href = '#';
  link.click();
});
document.querySelector('.option-colors').addEventListener('click', (e) => {
  Array.from(document.querySelector('.option-colors').children).forEach((k) => {
    const c = k;
    c.textContent = '';
  });
  if (e.target.nodeName === 'A') {
    color = e.target.style.backgroundColor;
    e.target.textContent = '✓';
  }
});

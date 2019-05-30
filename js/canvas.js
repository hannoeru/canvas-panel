const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Var
let tool = 'pen';
let draw = false;
const colors = ['#FFFFFF', '#000000', '#9BFFCD', '#00CC99', '#01936F'];
let color = '#000000';
let lineWidth = 10;
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
    if (colors[i] === '#FFFFFF') {
      value += '; border: 1px solid #000000';
    }
    str += `<a style="background: ${value};"></a>`;
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
  if (undoDataStack.length >= STACK_MAX_SIZE) {
    undoDataStack.pop();
  }
  undoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
};
saveDraw();
const undo = () => {
  if (undoDataStack.length <= 0) return;
  redoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const imageData = undoDataStack.shift();
  ctx.putImageData(imageData, 0, 0);
};

const redo = () => {
  if (redoDataStack.length <= 0) return;
  undoDataStack.unshift(ctx.getImageData(0, 0, canvas.width, canvas.height));
  const imageData = redoDataStack.shift();
  ctx.putImageData(imageData, 0, 0);
};
// Start
const mouseDown = (e) => {
  draw = true;
  let setColor = color;
  if (tool === 'eraser') {
    setColor = '#E8E8E8';
  }
  ctx.beginPath();
  ctx.strokeStyle = setColor;
  ctx.lineWidth = lineWidth;
  ctx.moveTo(e.pageX, e.pageY);
};
const touchStart = (e) => {
  const touch = e.targetTouches[0];
  e.preventDefault();
  draw = true;
  ctx.beginPath();
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
  saveDraw();
};
const touchEnd = (e) => {
  draw = false;
  saveDraw();
  e.preventDefault();
};
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
  link.href = canvas.toDataURL();
  link.download = 'cancas.png';
  link.click();
});
document.querySelector('.nav-clearAll').addEventListener('click', () => {
  saveDraw();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
document.querySelector('.nav-undo').addEventListener('click', undo);
document.querySelector('.nav-redo').addEventListener('click', redo);
// Option
document.querySelector('.option-tools').addEventListener('click', (e) => {
  const target = e.target.classList[1];
  if (target === 'fa-paint-brush') {
    e.target.classList[1] = 'fa-eraser';
    tool = 'eraser';
    console.log('haha');
  }
  if (target === 'fa-eraser') {
    e.target.classList[1] = 'fa-paint-brush';
    tool = 'pen';
  }
});
document.querySelector('.option-size').addEventListener('change', (e) => {
  const num = e.target.value;
  if (num > 0 && num <= 100) {
    lineWidth = num;
  } else {
    e.target.value = 10;
  }
});
document.querySelector('.option-colors').addEventListener('click', (e) => {
  if (e.target.nodeName === 'A') {
    color = e.target.style.backgroundColor;
    console.log(e.target.style.backgroundColor);
  }
});

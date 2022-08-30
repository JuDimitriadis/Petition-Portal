//Signatura drawing with vanila js, using canvas ans event listeners

const signature = document.getElementById('signature');
const canvas = document.getElementById('signCanvas');
const context = canvas.getContext('2d');
const clearButton = document.getElementById('clear');
let mouseDown;
let mouseIn;
let signed;

context.strokeStyle = '#000000';
context.lineWidth = 1;

canvas.addEventListener('mousedown', (evt) => {
    mouseDown = true;
    const x = evt.offsetX;
    const y = evt.offsetY;
    context.beginPath(x, y);
});

canvas.addEventListener('mousemove', (evtMove) => {
    if (mouseDown === true && mouseIn === true) {
        signed = true;
        const xMove = evtMove.offsetX;
        const yMove = evtMove.offsetY;
        context.lineTo(xMove, yMove);
        context.stroke();
    }
});

canvas.addEventListener('mouseenter', () => {
    mouseIn = true;
});

document.addEventListener('mouseup', () => {
    mouseDown = false;
    if (signed === true) {
        const image = canvas.toDataURL();
        signature.value = image;
    }
});

canvas.addEventListener('mouseleave', () => {
    mouseIn = false;
    mouseDown = false;
});

clearButton.addEventListener('click', () => {
    signed = false;
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    signature.value = '';
});

canvas.addEventListener('touchstart', (evt) => {
    // It prevents the scrolling on touch screen, while drawing the signature
    evt.preventDefault();

    var touch = evt.touches[0];
    const x = touch.pageX - touch.target.offsetLeft;
    const y = touch.pageY - touch.target.offsetTop;
    context.beginPath(x, y);
    console.log('touch started', x, y);
});

canvas.addEventListener('touchmove', (evtMove) => {
    // It prevents the scrolling on touch screen, while drawing the signature
    evtMove.preventDefault();

    signed = true;
    var touch = evtMove.touches[0];
    const xMove = touch.pageX - touch.target.offsetLeft;
    const yMove = touch.pageY - touch.target.offsetTop;
    context.lineTo(xMove, yMove);
    context.stroke();
});

document.addEventListener('touchend', () => {
    if (signed === true) {
        const image = canvas.toDataURL();
        signature.value = image;
    }
});

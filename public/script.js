const signature = document.getElementById("signature");
const canvas = document.getElementById("signCanvas");
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear");
let mouseDown;
let mouseIn;
let signed;

context.strokeStyle = "#000000";
context.lineWidth = 1;

canvas.addEventListener("mousedown", (evt) => {
    mouseDown = true;
    const x = evt.offsetX;
    const y = evt.offsetY;
    context.beginPath(x, y);
});

canvas.addEventListener("mousemove", (evtMove) => {
    if (mouseDown === true && mouseIn === true) {
        signed = true;
        const xMove = evtMove.offsetX;
        const yMove = evtMove.offsetY;
        context.lineTo(xMove, yMove);
        context.stroke();
    }
});

canvas.addEventListener("mouseenter", () => {
    mouseIn = true;
});

document.addEventListener("mouseup", () => {
    mouseDown = false;
    if (signed === true) {
        const image = canvas.toDataURL();
        signature.value = image;
    }
});

canvas.addEventListener("mouseleave", () => {
    mouseIn = false;
    mouseDown = false;
    // const image = canvas.toDataURL();
    // signature.value = image;
});

clearButton.addEventListener("click", () => {
    signed = false;
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    signature.value = "";
});

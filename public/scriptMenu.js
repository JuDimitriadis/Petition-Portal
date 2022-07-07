var menuI = document.getElementById("menuIcon");
var shadow = document.getElementById("shadow");
var menuBar = document.getElementById("menuBar");
var x = document.getElementById("x");
console.log(x);

console.log(shadow);
console.log(menuBar);

menuI.addEventListener("click", function (event) {
    console.log(event);
    shadow.classList.add("on");
    menuBar.classList.add("on");
    event.stopPropagation();
});

x.addEventListener("click", function () {
    shadow.classList.remove("on");
    menuBar.classList.remove("on");
});

menuBar.addEventListener("click", function (event) {
    event.stopPropagation();
});

document.addEventListener("click", function () {
    shadow.classList.remove("on");
    menuBar.classList.remove("on");
});

(function () {
if (window.typewriterCleanup) {
window.typewriterCleanup();
}
var layer = document.createElement("div");
var caret = document.createElement("span");
var letters = [];
var x = 20;
var y = 20;
var active = false;
var fontSize = 24;
var lineHeight = 34;
layer.style.position = "fixed";
layer.style.left = "0";
layer.style.top = "0";
layer.style.width = "100vw";
layer.style.height = "100vh";
layer.style.pointerEvents = "none";
layer.style.zIndex = "2147483647";
caret.style.position = "fixed";
caret.style.width = "2px";
caret.style.height = lineHeight + "px";
layer.appendChild(caret);
document.body.appendChild(layer);
function getColor(px, py) {
var element = document.elementFromPoint(px, py);
if (!element) return "black";
var color = getComputedStyle(element).backgroundColor;
var numbers = color.match(/\d+/g);

if (!numbers || numbers.length < 3) return "black";

var r = Number(numbers[0]);
var g = Number(numbers[1]);
var b = Number(numbers[2]);
var brightness = (r * 299 + g * 587 + b * 114) / 1000;

return brightness < 128 ? "white" : "black";

}
function updateCaret() {
caret.style.left = x + "px";
caret.style.top = y + "px";
caret.style.backgroundColor = getColor(x, y);
caret.style.display = active ? "block" : "none";
}
function clearLetters() {
letters.forEach(function (letter) {
letter.remove();
});
letters = [];
}
function addLetter(character) {
var letter = document.createElement("span");
letter.textContent = character;
letter.style.position = "fixed";
letter.style.left = x + "px";
letter.style.top = y + "px";
letter.style.fontFamily = "Arial, sans-serif";
letter.style.fontSize = fontSize + "px";
letter.style.lineHeight = lineHeight + "px";
letter.style.whiteSpace = "pre";
letter.style.color = getColor(x, y);

layer.appendChild(letter);
letters.push(letter);

x += letter.getBoundingClientRect().width;
updateCaret();

}
function handleClick(event) {
clearLetters();
active = true;
x = event.clientX;
y = event.clientY;

updateCaret();

}
function handleKeydown(event) {
if (!active) return;
event.preventDefault();
event.stopPropagation();

if (event.key === "Escape") {
  window.typewriterCleanup();
  return;
}

if (event.key === "Enter") {
  x = 20;
  y += lineHeight;
  updateCaret();
  return;
}

if (event.key === "Backspace") {
  var last = letters.pop();

  if (last) {
    x -= last.getBoundingClientRect().width;
    last.remove();
    updateCaret();
  }

  return;
}

if (event.key.length === 1) {
  addLetter(event.key);
}

}
window.typewriterCleanup = function () {
document.removeEventListener("click", handleClick, true);
document.removeEventListener("keydown", handleKeydown, true);
layer.remove();
delete window.typewriterCleanup;
console.log("Typewriter disabled.");
};
document.addEventListener("click", handleClick, true);
document.addEventListener("keydown", handleKeydown, true);
console.log("Enabled. Clicking elsewhere clears the text. Press Escape to stop.");
})();

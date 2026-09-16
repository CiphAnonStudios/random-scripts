(() => {
const existing = document.getElementById("flyingDonutGame");
if (existing) existing.remove();
const game = document.createElement("div");
game.id = "flyingDonutGame";
game.style.cssText =
"position:fixed;inset:0;z-index:2147483647;overflow:hidden;" +
"background:linear-gradient(#78c9ff,#effbff);font-family:Arial,sans-serif;" +
"user-select:none;";
const hud = document.createElement("div");
hud.textContent = "Score: 0";
hud.style.cssText =
"position:absolute;top:15px;left:50%;transform:translateX(-50%);" +
"color:white;background:#0008;padding:10px 18px;border-radius:12px;" +
"font-size:20px;z-index:3;";
const player = document.createElement("div");
player.textContent = "🍩";
player.style.cssText =
"position:absolute;z-index:2;font-size:58px;line-height:1;";
const bird = document.createElement("div");
bird.textContent = "🐦";
bird.style.cssText =
"position:absolute;z-index:2;font-size:64px;line-height:1;";
function makeScreen() {
const screen = document.createElement("div");
screen.style.cssText =
"position:absolute;inset:0;z-index:10;display:flex;" +
"flex-direction:column;align-items:center;justify-content:center;" +
"background:#102040cc;color:white;text-align:center;";
return screen;
}
function makeButton(text) {
const button = document.createElement("button");
button.textContent = text;
button.style.cssText =
"border:0;border-radius:12px;padding:13px 22px;margin:6px;" +
"font-size:17px;cursor:pointer;background:#ffca28;" +
"color:#302000;font-weight:bold;";
return button;
}
const home = makeScreen();
const homeTitle = document.createElement("h1");
homeTitle.textContent = "Flying Donut";
homeTitle.style.fontSize = "46px";
const help = document.createElement("p");
help.textContent = "Use the arrow keys or WASD to fly.";
const warning = document.createElement("p");
warning.textContent = "Avoid the bird!";
const startButton = makeButton("Start Game");
home.append(homeTitle, help, warning, startButton);
const over = makeScreen();
over.style.display = "none";
const overTitle = document.createElement("h1");
overTitle.textContent = "You got caught!";
overTitle.style.fontSize = "46px";
const result = document.createElement("p");
result.textContent = "Your score: 0";
const restartButton = makeButton("Restart");
const homeButton = makeButton("Home Screen");
over.append(overTitle, result, restartButton, homeButton);
game.append(hud, player, bird, home, over);
document.body.appendChild(game);
let keys = Object.create(null);
let running = false;
let animationId = 0;
let score = 0;
let playerX = 120;
let playerY = innerHeight / 2;
let birdX = innerWidth - 140;
let birdY = innerHeight / 3;
let lastTime = 0;
let scoreTimer = 0;
function updatePositions() {
player.style.left = playerX + "px";
player.style.top = playerY + "px";
bird.style.left = birdX + "px";
bird.style.top = birdY + "px";
}
function resetPositions() {
playerX = 120;
playerY = innerHeight / 2;
birdX = innerWidth - 140;
birdY = innerHeight / 3;
updatePositions();
}
function hitDetected() {
const a = player.getBoundingClientRect();
const b = bird.getBoundingClientRect();
return !(
  a.right < b.left ||
  a.left > b.right ||
  a.bottom < b.top ||
  a.top > b.bottom
);

}
function endGame() {
running = false;
cancelAnimationFrame(animationId);
result.textContent = "Your score: " + score;
over.style.display = "flex";
}
function startGame() {
cancelAnimationFrame(animationId);
score = 0;
scoreTimer = 0;
hud.textContent = "Score: 0";
home.style.display = "none";
over.style.display = "none";
resetPositions();
running = true;
lastTime = performance.now();
animationId = requestAnimationFrame(gameLoop);
}
function showHome() {
running = false;
cancelAnimationFrame(animationId);
over.style.display = "none";
home.style.display = "flex";
resetPositions();
}
function gameLoop(time) {
if (!running) return;
const delta = Math.min((time - lastTime) / 16.67, 3);
lastTime = time;
const speed = 7 * delta;

if (keys.ArrowUp || keys.w) playerY -= speed;
if (keys.ArrowDown || keys.s) playerY += speed;
if (keys.ArrowLeft || keys.a) playerX -= speed;
if (keys.ArrowRight || keys.d) playerX += speed;

playerX = Math.max(0, Math.min(innerWidth - 70, playerX));
playerY = Math.max(0, Math.min(innerHeight - 70, playerY));

birdX += (playerX + 20 - birdX) * 0.012 * delta;
birdY += (playerY - birdY) * 0.012 * delta;

updatePositions();

scoreTimer += delta;
if (scoreTimer > 6) {
  score++;
  hud.textContent = "Score: " + score;
  scoreTimer = 0;
}

if (hitDetected()) {
  endGame();
  return;
}

animationId = requestAnimationFrame(gameLoop);

}
window.addEventListener("keydown", event => {
keys[event.key] = true;
if (
  event.key === "ArrowUp" ||
  event.key === "ArrowDown" ||
  event.key === "ArrowLeft" ||
  event.key === "ArrowRight" ||
  event.key === " "
) {
  event.preventDefault();
}

});
window.addEventListener("keyup", event => {
keys[event.key] = false;
});
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
homeButton.addEventListener("click", showHome);
resetPositions();
})();

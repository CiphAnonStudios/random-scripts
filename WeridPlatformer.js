(()=> {
if (window.__NeonRunner) window.__NeonRunner.remove();
const c = document.createElement("canvas");
const x = c.getContext("2d");
const K = {};
const P = [];
const G = [];
const E = [];
const F = [];
let W = innerWidth;
let H = innerHeight;
let t = 0;
let last = performance.now();
let cam = 0;
let shake = 0;
let score = 0;
let lives = 3;
let dist = 0;
let end = 0;
let mode = "title";
let run = true;
const p = {
x: 120,
y: 100,
w: 30,
h: 46,
vx: 0,
vy: 0,
on: false,
face: 1,
coyote: 0,
buffer: 0,
inv: 0,
anim: 0
};
c.style =
"position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483647;background:#07111f;cursor:none";
document.body.appendChild(c);
function resize() {
W = innerWidth;
H = innerHeight;
const dpr = devicePixelRatio || 1;
c.width = W * dpr;
c.height = H * dpr;
c.style.width = `${W}px`;
c.style.height = `${H}px`;

x.setTransform(dpr, 0, 0, dpr, 0, 0);

}
function r(a, b) {
return Math.random() * (b - a) + a;
}
function clamp(a, b, d) {
return Math.max(b, Math.min(d, a));
}
function hit(a, b) {
return (
a.x < b.x + b.w &&
a.x + a.w > b.x &&
a.y < b.y + b.h &&
a.y + a.h > b.y
);
}
function part(a, b, col, n = 8, pow = 3) {
for (let i = 0; i < n; i++) {
F.push({
x: a,
y: b,
vx: r(-pow, pow),
vy: r(-pow * 1.4, pow * 0.2),
life: r(18, 42),
col,
size: r(2, 5)
});
}
}
function plat(a, b, w, type = "grass") {
P.push({
x: a,
y: b,
w,
h: 22,
type
});
}
function gem(a, b) {
G.push({
x: a,
y: b,
got: false,
s: r(0, Math.PI * 2)
});
}
function enemy(a, b) {
E.push({
x: a,
y: b,
w: 32,
h: 25,
vx: r(0.5, 1),
l: a - r(50, 100),
q: a + r(50, 100),
alive: true,
s: r(0, 9)
});
}
function world() {
if (!end) {
plat(-600, H - 100, 1100);
end = 500;
}
while (end < cam + W + 900) {
  const q = P[P.length - 1];
  const gap = r(45, 120);
  const w = r(140, 260);
  const y = clamp(q.y + r(-100, 100), 130, H - 95);
  const a = end + gap;
  const type = Math.random() < 0.18 ? "metal" : "grass";

  plat(a, y, w, type);

  for (let i = 0, n = Math.floor(r(2, 5)); i < n; i++) {
    gem(a + 35 + i * 34, y - r(42, 75));
  }

  if (Math.random() < 0.45) {
    enemy(a + r(50, w - 40), y - 27);
  }

  end = a + w;
}

while (P.length && P[0].x + P[0].w < cam - 700) {
  P.shift();
}

while (G.length && G[0].x < cam - 700) {
  G.shift();
}

while (E.length && E[0].x < cam - 700) {
  E.shift();
}

}
function reset() {
P.length = 0;
G.length = 0;
E.length = 0;
F.length = 0;
cam = 0;
end = 0;
score = 0;
lives = 3;
dist = 0;
mode = "play";

p.x = 120;
p.y = 100;
p.vx = 0;
p.vy = 0;
p.on = false;
p.coyote = 0;
p.buffer = 0;
p.inv = 0;

world();

}
function jump() {
if (mode === "title" || mode === "over" || mode === "win") {
reset();
return;
}
if (mode !== "play") return;

if (p.on || p.coyote > 0) {
  p.vy = -14;
  p.on = false;
  p.coyote = 0;
  part(p.x + p.w / 2, p.y + p.h, "#d9fbff", 10, 2);
} else {
  p.buffer = 8;
}

}
function hurt() {
if (p.inv > 0) return;
lives--;
shake = 15;

part(
  p.x + p.w / 2,
  p.y + p.h / 2,
  "#ff557c",
  20,
  5
);

if (lives <= 0) {
  mode = "over";
  return;
}

p.x = Math.max(120, dist - 220);
p.y = 70;
p.vx = 0;
p.vy = 0;
p.inv = 120;

}
function update(dt) {
t += dt;
if (mode !== "play") {
  particles(dt);
  return;
}

world();

const L = K.ArrowLeft || K.a || K.A;
const R = K.ArrowRight || K.d || K.D;

if (L) {
  p.vx -= 0.75 * dt;
  p.face = -1;
}

if (R) {
  p.vx += 0.75 * dt;
  p.face = 1;
}

if (!L && !R) {
  p.vx *= Math.pow(0.82, dt);
}

p.vx = clamp(p.vx, -7, 7);

const oldBottom = p.y + p.h;

p.vy += 0.65 * dt;
p.x += p.vx * dt;
p.y += p.vy * dt;
p.on = false;

for (const q of P) {
  if (
    hit(p, q) &&
    p.vy >= 0 &&
    oldBottom <= q.y + 5
  ) {
    p.y = q.y - p.h;
    p.vy = 0;
    p.on = true;
    p.coyote = 7;
  }
}

if (!p.on) {
  p.coyote -= dt;
}

p.buffer -= dt;

if (p.buffer > 0 && p.on) {
  jump();
}

for (const g of G) {
  if (
    !g.got &&
    Math.hypot(
      g.x - (p.x + p.w / 2),
      g.y - (p.y + p.h / 2)
    ) < 25
  ) {
    g.got = true;
    score += 100;
    part(g.x, g.y, "#55eaff", 14, 4);
  }
}

for (const e of E) {
  if (!e.alive) continue;

  e.x += e.vx * dt;
  e.s += dt;

  if (e.x < e.l || e.x > e.q) {
    e.vx *= -1;
  }

  if (hit(p, e)) {
    if (p.vy > 0 && p.y + p.h - e.y < 18) {
      e.alive = false;
      p.vy = -9;
      score += 250;
      part(e.x, e.y, "#ff6184", 18, 4);
    } else {
      hurt();
    }
  }
}

if (p.x > dist) {
  dist = p.x;
}

cam += (p.x - cam - W * 0.38) * 0.1 * dt;
cam = Math.max(0, cam);

if (p.y > H + 250) {
  hurt();
}

if (p.inv > 0) {
  p.inv -= dt;
}

if (shake > 0) {
  shake -= dt;
}

if (dist > 12000) {
  mode = "win";
}

particles(dt);

}
function particles(dt) {
for (let i = F.length - 1; i >= 0; i--) {
const f = F[i];
  f.x += f.vx * dt;
  f.y += f.vy * dt;
  f.vy += 0.16 * dt;
  f.life -= dt;

  if (f.life <= 0) {
    F.splice(i, 1);
  }
}

}
function sky() {
const z = x.createLinearGradient(0, 0, 0, H);
z.addColorStop(0, "#071225");
z.addColorStop(0.55, "#1d4770");
z.addColorStop(1, "#8b4c68");

x.fillStyle = z;
x.fillRect(0, 0, W, H);

x.fillStyle = "#fff4bd";
x.shadowColor = "#fff4bd";
x.shadowBlur = 25;

x.beginPath();
x.arc(W * 0.78, 110, 38, 0, Math.PI * 2);
x.fill();

x.shadowBlur = 0;

for (let i = 0; i < 90; i++) {
  const a = (i * 173 - cam * 0.12) % W;
  const b = (i * 83) % H;

  x.fillStyle = `rgba(255,255,255,${
    0.35 + Math.sin(t * 0.05 + i) * 0.2
  })`;

  x.fillRect(
    a < 0 ? a + W : a,
    b,
    i % 6 ? 1 : 3,
    i % 6 ? 1 : 3
  );
}

for (let j = 0; j < 3; j++) {
  x.fillStyle = ["#19385b", "#112a47", "#0b1d34"][j];

  for (let i = -2; i < 12; i++) {
    const a = i * 260 - (cam * (0.15 + j * 0.12) % 260);
    const b = H - 70 + j * 35;

    x.beginPath();
    x.moveTo(a, H);
    x.lineTo(a + 130, b - 170 - (i % 3) * 30);
    x.lineTo(a + 280, H);
    x.fill();
  }
}

}
function drawPlatform(q) {
const a = q.x - cam;
const b = q.y;
if (a + q.w < 0 || a > W) return;

x.fillStyle = q.type === "metal" ? "#4e617b" : "#326f55";
x.fillRect(a, b, q.w, q.h + 10);

x.fillStyle = q.type === "metal" ? "#b8c8da" : "#8affb0";
x.fillRect(a, b, q.w, 6);

x.fillStyle = "rgba(0,0,0,.2)";

for (let i = 15; i < q.w; i += 30) {
  x.fillRect(a + i, b + 13, 12, 4);
}

}
function drawGem(g) {
if (g.got) return;
const a = g.x - cam;
const b = g.y;

g.s += 0.08;

x.save();
x.translate(a, b);
x.rotate(Math.sin(g.s) * 0.15);
x.scale(
  0.7 + Math.abs(Math.sin(g.s)) * 0.3,
  1
);

x.shadowColor = "#55eaff";
x.shadowBlur = 18;
x.fillStyle = "#55eaff";

x.beginPath();
x.moveTo(0, -14);
x.lineTo(11, -3);
x.lineTo(6, 13);
x.lineTo(-6, 13);
x.lineTo(-11, -3);
x.closePath();
x.fill();

x.restore();

}
function drawEnemy(e) {
if (!e.alive) return;
const a = e.x - cam;
const b = e.y + Math.sin(e.s * 0.12) * 2;

x.fillStyle = "#ed4f73";
x.beginPath();
x.roundRect(a, b, e.w, e.h, 8);
x.fill();

x.fillStyle = "#fff";
x.fillRect(a + 6, b + 7, 6, 6);
x.fillRect(a + 20, b + 7, 6, 6);

x.fillStyle = "#171827";
x.fillRect(a + 8, b + 9, 3, 3);
x.fillRect(a + 22, b + 9, 3, 3);

}
function drawPlayer() {
if (p.inv > 0 && Math.floor(p.inv / 6) % 2 === 0) {
return;
}
const a = p.x - cam + p.w / 2;
const b = p.y;

x.save();
x.translate(a, b);
x.scale(p.face, 1);

const walk = Math.sin(t * 0.5) * 3;
const bob = p.on ? Math.abs(Math.sin(t * 0.5)) * 2 : 0;

x.translate(0, -bob);

// Shadow
x.fillStyle = "rgba(0,0,0,.25)";
x.beginPath();
x.ellipse(0, 48, 22, 5, 0, 0, Math.PI * 2);
x.fill();

// Cape
x.fillStyle = "#27386f";
x.beginPath();
x.moveTo(-12, 14);
x.lineTo(-26, 39);
x.lineTo(-8, 34);
x.lineTo(2, 17);
x.closePath();
x.fill();

// Body
x.fillStyle = "#18243f";
x.beginPath();
x.roundRect(-15, 15, 30, 27, 8);
x.fill();

// Jacket glow
x.strokeStyle = "#55eaff";
x.lineWidth = 2;
x.beginPath();
x.moveTo(-10, 20);
x.lineTo(0, 27);
x.lineTo(10, 20);
x.stroke();

// Head
x.fillStyle = "#f2b17b";
x.beginPath();
x.arc(0, 6, 14, 0, Math.PI * 2);
x.fill();

// Hair
x.fillStyle = "#302448";
x.beginPath();
x.arc(0, 3, 15, Math.PI, Math.PI * 2);
x.lineTo(15, 7);
x.lineTo(8, 5);
x.lineTo(3, 10);
x.lineTo(-4, 5);
x.lineTo(-13, 9);
x.closePath();
x.fill();

// Visor
x.fillStyle = "#55eaff";
x.globalAlpha = 0.85;
x.fillRect(3, 4, 11, 5);
x.globalAlpha = 1;

// Legs
x.fillStyle = "#101a35";
x.fillRect(-13, 38 + walk, 10, 10);
x.fillRect(4, 38 - walk, 10, 10);

// Boots
x.fillStyle = "#55c8f4";
x.fillRect(-16, 46 + walk, 13, 5);
x.fillRect(5, 46 - walk, 13, 5);

x.restore();

}
function draw() {
const sx = shake ? r(-shake, shake) : 0;
const sy = shake ? r(-shake, shake) : 0;
x.save();
x.translate(sx, sy);

sky();

for (const q of P) {
  drawPlatform(q);
}

for (const g of G) {
  drawGem(g);
}

for (const e of E) {
  drawEnemy(e);
}

for (const f of F) {
  x.globalAlpha = Math.max(0, f.life / 42);
  x.fillStyle = f.col;
  x.fillRect(f.x - cam, f.y, f.size, f.size);
}

x.globalAlpha = 1;
drawPlayer();

x.restore();

if (mode !== "title") {
  x.fillStyle = "rgba(5,12,27,.82)";
  x.beginPath();
  x.roundRect(18, 18, 310, 108, 14);
  x.fill();

  x.fillStyle = "#fff";
  x.font = "bold 19px Arial";
  x.fillText("NEON RUNNER", 35, 47);

  x.font = "14px Arial";
  x.fillStyle = "#9fc4df";
  x.fillText("DISTANCE", 35, 72);
  x.fillText("SCORE", 145, 72);
  x.fillText("LIVES", 245, 72);

  x.font = "bold 17px Arial";
  x.fillStyle = "#fff";
  x.fillText(`${Math.floor(dist / 10)}m`, 35, 99);
  x.fillText(score, 145, 99);

  x.fillStyle = "#ff7792";
  x.fillText("♥".repeat(Math.max(0, lives)), 245, 99);
}

if (mode === "title" || mode === "over" || mode === "win") {
  x.fillStyle = "rgba(2,7,18,.75)";
  x.fillRect(0, 0, W, H);

  x.fillStyle = "rgba(12,29,59,.96)";
  x.beginPath();
  x.roundRect(W / 2 - 290, H / 2 - 140, 580, 280, 24);
  x.fill();

  x.textAlign = "center";

  x.fillStyle =
    mode === "over"
      ? "#ff7792"
      : mode === "win"
        ? "#8dffae"
        : "#55eaff";

  x.font = "bold 52px Arial";
  x.fillText(
    mode === "title"
      ? "NEON RUNNER"
      : mode === "over"
        ? "RUN OVER"
        : "YOU WIN",
    W / 2,
    H / 2 - 35
  );

  x.fillStyle = "#e5f0ff";
  x.font = "19px Arial";
  x.fillText(
    mode === "title"
      ? "A neon platform adventure"
      : `Score: ${score}`,
    W / 2,
    H / 2 + 15
  );

  x.fillStyle = "#9ab4cc";
  x.font = "15px Arial";
  x.fillText(
    mode === "title"
      ? "Press Space to start"
      : "Press R or Space to restart",
    W / 2,
    H / 2 + 65
  );

  x.textAlign = "left";
}

}
function keydown(e) {
K[e.key] = 1;
if (
  e.key === " " ||
  e.key === "ArrowUp" ||
  e.key === "w" ||
  e.key === "W"
) {
  jump();
  e.preventDefault();
}

if (e.key.toLowerCase() === "p") {
  mode =
    mode === "play"
      ? "pause"
      : mode === "pause"
        ? "play"
        : mode;
}

if (e.key.toLowerCase() === "r") {
  reset();
}

if (e.key === "Escape") {
  window.__NeonRunner.remove();
}

}
function keyup(e) {
K[e.key] = 0;
}
function remove() {
run = false;
removeEventListener("resize", resize);
removeEventListener("keydown", keydown);
removeEventListener("keyup", keyup);

c.remove();
delete window.__NeonRunner;

}
window.__NeonRunner = {
remove
};
addEventListener("resize", resize);
addEventListener("keydown", keydown);
addEventListener("keyup", keyup);
resize();
world();
function loop(now) {
if (!run) return;
const dt = Math.min((now - last) / 16.67, 2);
last = now;

update(dt);
draw();

requestAnimationFrame(loop);

}
requestAnimationFrame(loop);
})();

(() => {
  const old = document.getElementById("visual-code-layer");
  if (old) old.remove();

  const layer = document.createElement("div");
  layer.id = "visual-code-layer";

  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647",
    pointerEvents: "none",
    overflow: "hidden",
    background: "transparent",
    color: "#00ff88",
    font: "14px/1.45 monospace",
    textShadow: "0 0 6px currentColor"
  });

  document.documentElement.appendChild(layer);

  const colors = [
    "#00ff88", "#00d9ff", "#ff4fd8",
    "#ffd166", "#ff6b6b", "#b388ff", "#ffffff"
  ];

  const names = [
    "value", "count", "index", "result",
    "data", "items", "user", "state",
    "color", "message", "element"
  ];

  const expressions = [
    () => `const ${name()} = Math.random();`,
    () => `let ${name()} = ${number()};`,
    () => `${name()} += ${number(9)};`,
    () => `console.log(${quote()});`,
    () => `const ${name()} = Array.from({ length: ${number(8) + 2} });`,
    () => `if (${name()} > ${number(50)}) {`,
    () => `  console.log(${quote()});`,
    () => `}`,
    () => `function ${name()}() {`,
    () => `  return ${randomValue()};`,
    () => `}`,
    () => `const ${name()} = (${name()}) => ${randomValue()};`,
    () => `JSON.stringify({ id: ${number(999)}, active: true });`,
    () => `new Promise(resolve => setTimeout(resolve, ${number(2000)}));`,
    () => `document.querySelector(".item-${number(20)}");`,
    () => `// ${randomComment()}`
  ];

  function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function number(max = 100) {
    return Math.floor(Math.random() * max);
  }

  function name() {
    return `${pick(names)}${number(100)}`;
  }

  function quote() {
    return JSON.stringify(pick([
      "hello world",
      "system ready",
      "visual layer active",
      "random output",
      "render complete",
      "test message"
    ]));
  }

  function randomValue() {
    return pick([
      "Math.random()",
      "Date.now()",
      "true",
      "false",
      "null",
      "[]",
      "{}",
      `${number(100)}`
    ]);
  }

  function randomComment() {
    return pick([
      "rendering component",
      "checking state",
      "loading module",
      "updating display",
      "visual mode active",
      "background process"
    ]);
  }

  let currentLine = 0;
  let currentBlock = null;
  let timer = null;

  function newBlock() {
    currentBlock = document.createElement("div");

    Object.assign(currentBlock.style, {
      position: "absolute",
      left: `${number(70) + 2}vw`,
      top: `${number(75) + 8}vh`,
      width: `${number(280) + 260}px`,
      color: pick(colors),
      opacity: "0.92",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      pointerEvents: "none"
    });

    layer.appendChild(currentBlock);
    currentLine = 0;
  }

  function writeLine() {
    if (!currentBlock || currentLine >= 8) {
      newBlock();
    }

    const line = document.createElement("div");
    line.textContent = expressions[currentLine % expressions.length]();
    line.style.color = pick(colors);
    currentBlock.appendChild(line);
    currentLine++;

    layer.scrollTop = layer.scrollHeight;

    if (currentBlock.children.length > 8) {
      currentBlock.remove();
      newBlock();
    }
  }

  newBlock();
  timer = setInterval(writeLine, 90);

  const stop = () => {
    clearInterval(timer);
    layer.remove();
    window.removeEventListener("keydown", keyHandler);
  };

  const keyHandler = event => {
    if (event.key === "F8" || event.key === "Escape") {
      stop();
    }
  };

  window.addEventListener("keydown", keyHandler);

  console.log("Visual code layer running. Press F8 or Escape to stop.");
})();

const BOARD_SIZE = [10, 20];
const BOARD_COLOUR = "#666";
const COLOURS = [
  "#fa3434",
  "#fb8535",
  "#facc33",
  "#5fe33f",
  "#43cde6",
  "#4455e7",
  "#f64ed8",
];
const DAS = 168;
const ARR = 33;
const I_PIECE_INDEX = 4;
const NEXT_PIECES = 1;
const GRAVITY_TIME = 300;
const LOCK_DELAY = 500;
const KEYBINDS = {
  WASD: {
    left: "KeyA",
    right: "KeyD",
    clockwise: "ArrowRight",
    counterclockwise: "ArrowLeft",
    softdrop: "KeyW",
    harddrop: "KeyS",
    hold: "ShiftLeft",
  },
  ArrowKeys: {
    left: "ArrowLeft",
    right: "ArrowRight",
    clockwise: "KeyX",
    counterclockwise: "KeyZ",
    softdrop: "ArrowDown",
    harddrop: "Space",
    hold: "ShiftLeft",
  },
};
const KEY_NAMES = {
  KeyA: "A",
  KeyD: "D",
  KeyW: "W",
  KeyS: "S",
  KeyX: "X",
  KeyZ: "Z",
  ArrowRight: "→",
  ArrowLeft: "←",
  ArrowDown: "↓",
  ShiftLeft: "LShift",
  Space: "Space",
};

let activeKeybinds = KEYBINDS.WASD;
let canvas = null;
let ctx = null;
let nextCanvas = null;
let nextCtx = null;
let heldCanvas = null;
let heldCtx = null;
let scoreLabel = null;
let highScoreLabel = null;
let tileSize = 0;

let score = 0;
let highScore = 0;
let board = Array.from(Array(BOARD_SIZE[0]), () =>
  new Array(BOARD_SIZE[1]).fill(null),
);
let bag = [];
let next = [];
let activePiece = null;
let gravityTimer = 0;
let lockDelayTimer = 0;
let held = null;
let justHeld = false;
let rawInputs = {
  left: false,
  right: false,
  softDrop: false,
};
let effectiveInputs = {
  left: false,
  right: false,
};
let arrTimer = 0;

$(function () {
  canvas = $("#game").get(0);
  ctx = canvas.getContext("2d");
  nextCanvas = $("#next").get(0);
  nextCtx = nextCanvas.getContext("2d");
  heldCanvas = $("#held").get(0);
  heldCtx = heldCanvas.getContext("2d");
  scoreLabel = $("#score");
  highScoreLabel = $("#highscore");

  $("#reset").click(resetGame);
  $("#keybinds")
    .val("WASD")
    .on("change", function () {
      let selected = $(this).val();
      activeKeybinds = KEYBINDS[selected];
      updateKeybindText();
      $(this).blur();
    });

  resetGame();
  addEventListener("keydown", keyDown);
  addEventListener("keyup", keyUp);
  requestAnimationFrame(process);
});

let lastFrame = 0;
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;

  tileSize = Math.ceil(canvas.clientWidth / (BOARD_SIZE[0] + 2));
  canvas.width = tileSize * (BOARD_SIZE[0] + 2);
  canvas.height = tileSize * (BOARD_SIZE[1] + 1);
  nextCanvas.width = nextCanvas.clientWidth;
  nextCanvas.height = nextCanvas.width / 2.0;
  heldCanvas.width = heldCanvas.clientWidth;
  heldCanvas.height = heldCanvas.width / 2.0;

  gravityTimer += rawInputs.softDrop ? delta * 4 : delta;
  if (gravityTimer > GRAVITY_TIME) {
    tryMove([0, 1]);
    gravityTimer = 0;
  }

  if (grounded()) {
    lockDelayTimer += delta;
  } else {
    lockDelayTimer = 0;
  }
  if (lockDelayTimer > LOCK_DELAY) {
    placePiece();
  }

  updateArr(delta);

  drawBoard();
  drawGhost();
  drawActivePiece();
  drawNext();
  drawHeld();

  requestAnimationFrame(process);
}

function updateArr(delta) {
  if (effectiveInputs.left || effectiveInputs.right) {
    arrTimer += delta;
  }
  if (arrTimer > DAS + ARR) {
    if (effectiveInputs.left) {
      tryMove([-1, 0]);
      arrTimer = DAS;
    } else {
      tryMove([1, 0]);
      arrTimer = DAS;
    }
  }
}

function updateKeybindText() {
  $("#c-left span").text(`Left: ${KEY_NAMES[activeKeybinds.left]}`);
  $("#c-right span").text(`Right: ${KEY_NAMES[activeKeybinds.right]}`);
  $("#c-clockwise span").text(
    `Clockwise: ${KEY_NAMES[activeKeybinds.clockwise]}`,
  );
  $("#c-counterclockwise span").text(
    `Counter-Clockwise: ${KEY_NAMES[activeKeybinds.counterclockwise]}`,
  );
  $("#c-softdrop span").text(
    `Soft Drop: ${KEY_NAMES[activeKeybinds.softdrop]}`,
  );
  $("#c-harddrop span").text(
    `Hard Drop: ${KEY_NAMES[activeKeybinds.harddrop]}`,
  );
  $("#c-hold span").text(`Hold: ${KEY_NAMES[activeKeybinds.hold]}`);
}

function drawTile([x, y]) {
  ctx.fillRect((x + 1) * tileSize, y * tileSize, tileSize, tileSize);
}

function drawBoard() {
  ctx.fillStyle = BOARD_COLOUR;
  for (let y = 0; y < BOARD_SIZE[1] + 1; y++) {
    drawTile([-1, y]);
    drawTile([BOARD_SIZE[0], y]);
  }
  for (let x = 0; x < BOARD_SIZE[0]; x++) {
    drawTile([x, BOARD_SIZE[1]]);
  }

  for (let x = 0; x < BOARD_SIZE[0]; x++) {
    for (let y = 0; y < BOARD_SIZE[1]; y++) {
      const blockIndex = board[x][y];
      if (blockIndex == null) continue;

      ctx.fillStyle = COLOURS[blockIndex];
      drawTile([x, y]);
    }
  }
}

function drawActivePiece() {
  const brightness = 1.0 - (0.4 * lockDelayTimer) / LOCK_DELAY;
  ctx.fillStyle = `hsl(from ${COLOURS[activePiece.index]} h calc(s * ${brightness}) calc(l * ${brightness}))`;
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    drawTile([pos[0] + activePiece.pos[0], pos[1] + activePiece.pos[1]]);
  }
}

function drawGhost() {
  let depth = 0;
  outer: for (let i = 0; i < BOARD_SIZE[1]; i++) {
    for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
      const testPos = [
        activePiece.pos[0] + pos[0],
        activePiece.pos[1] + pos[1] + i,
      ];
      if (!safePlace(testPos)) {
        depth = i - 1;
        break outer;
      }
    }
  }
  ctx.fillStyle = "#bbb";
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    const blockPos = [
      activePiece.pos[0] + pos[0],
      activePiece.pos[1] + pos[1] + depth,
    ];
    drawTile(blockPos);
  }
}

function drawNext() {
  let size = Math.ceil(nextCanvas.width / 4.0);
  for (const piece of next) {
    nextCtx.fillStyle = COLOURS[piece];
    for (const pos of SRS.pieces[piece][0]) {
      nextCtx.fillRect(size * pos[0], size * pos[1], size, size);
    }
  }
}

function drawHeld() {
  let size = Math.ceil(heldCanvas.width / 4.0);
  if (held != null) {
    heldCtx.fillStyle = justHeld ? "#bbb" : COLOURS[held];
    for (const pos of SRS.pieces[held][0]) {
      heldCtx.fillRect(size * pos[0], size * pos[1], size, size);
    }
  }
}

function keyDown(event) {
  if (event.repeat) return;

  switch (event.code) {
    case activeKeybinds.left:
      event.preventDefault();
      tryMove([-1, 0]);
      arrTimer = 0;
      rawInputs.left = true;
      effectiveInputs.left = true;
      effectiveInputs.right = false;
      break;
    case activeKeybinds.right:
      event.preventDefault();
      tryMove([1, 0]);
      arrTimer = 0;
      rawInputs.right = true;
      effectiveInputs.right = true;
      effectiveInputs.left = false;
      break;
    case activeKeybinds.softdrop:
      event.preventDefault();
      tryMove([0, 1]);
      rawInputs.softDrop = true;
      gravityTimer = 0;
      break;
    case activeKeybinds.harddrop:
      event.preventDefault();
      while (tryMove([0, 1])) {}
      placePiece();
      break;
    case activeKeybinds.counterclockwise:
      event.preventDefault();
      tryRotate((activePiece.rot + 3) % 4);
      break;
    case activeKeybinds.clockwise:
      event.preventDefault();
      tryRotate((activePiece.rot + 1) % 4);
      break;
    case activeKeybinds.hold:
      event.preventDefault();
      hold();
      break;
  }
}

function keyUp() {
  switch (event.code) {
    case activeKeybinds.left:
      event.preventDefault();
      rawInputs.left = false;
      effectiveInputs.left = false;
      if (rawInputs.right) effectiveInputs.right = true;
      break;
    case activeKeybinds.right:
      event.preventDefault();
      rawInputs.right = false;
      effectiveInputs.right = false;
      if (rawInputs.left) effectiveInputs.left = true;
      break;
    case activeKeybinds.softdrop:
      event.preventDefault();
      rawInputs.softDrop = false;
      break;
  }
}

function placePiece() {
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    const blockPos = [activePiece.pos[0] + pos[0], activePiece.pos[1] + pos[1]];
    board[blockPos[0]][blockPos[1]] = activePiece.index;
  }
  activePiece = nextPiece();
  clearLines();
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    const blockPos = [activePiece.pos[0] + pos[0], activePiece.pos[1] + pos[1]];
    if (!safePlace(blockPos)) resetGame();
  }
  gravityTimer = 0;
  justHeld = false;
}

function clearLines() {
  const linesToClear = fullLines();
  if (linesToClear.length > 0) {
    score += SRS.scoring_lines[linesToClear.length - 1];
    scoreLabel.text(`Score: ${score}`);
  }

  let removed = 0;
  for (const line of linesToClear) {
    for (let y = line; y >= 0; y--) {
      for (let x = 0; x < BOARD_SIZE[0]; x++) {
        board[x][y + removed] = board[x][y - 1 + removed];
      }
    }
  }
}

function fullLines() {
  let full = [];
  outer: for (let y = 0; y < BOARD_SIZE[1]; y++) {
    for (let x = 0; x < BOARD_SIZE[0]; x++) {
      if (board[x][y] == null) continue outer;
    }
    full.push(y);
  }
  return full;
}

function tryMove([dx, dy]) {
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    const testPos = [
      activePiece.pos[0] + pos[0] + dx,
      activePiece.pos[1] + pos[1] + dy,
    ];
    if (!safePlace(testPos)) return false;
  }
  activePiece.pos[0] += dx;
  activePiece.pos[1] += dy;
  lockDelayTimer = 0;
  return true;
}

function tryRotate(newRot) {
  let rotated = true;
  for (const pos of SRS.pieces[activePiece.index][newRot]) {
    const testPos = [activePiece.pos[0] + pos[0], activePiece.pos[1] + pos[1]];
    if (!safePlace(testPos)) {
      rotated = false;
      break;
    }
  }
  if (!rotated) {
    let workingKick = [0, 0];
    let kickTable =
      activePiece.index == I_PIECE_INDEX ? SRS.kicks_i : SRS.kicks;
    outer: for (const kick of kickTable[
      getKickIndex(activePiece.rot, newRot)
    ]) {
      rotated = true;
      for (const pos of SRS.pieces[activePiece.index][newRot]) {
        const testPos = [
          activePiece.pos[0] + pos[0] + kick[0],
          activePiece.pos[1] + pos[1] + kick[1],
        ];
        if (!safePlace(testPos)) {
          rotated = false;
          continue outer;
        }
      }
      if (rotated) {
        workingKick = kick;
        break outer;
      }
    }
    if (rotated) {
      activePiece.pos[0] += workingKick[0];
      activePiece.pos[1] += workingKick[1];
    }
  }
  if (rotated) {
    activePiece.rot = newRot;
  }
  return rotated;
}

function resetGame() {
  board = Array.from(Array(BOARD_SIZE[0]), () =>
    new Array(BOARD_SIZE[1]).fill(null),
  );
  bag = [];
  next = [];
  justHeld = false;
  held = null;
  for (let i = 0; i < NEXT_PIECES; i++) {
    next.push(nextBagIndex());
  }
  if (score > highScore) {
    highScore = score;
  }
  score = 0;
  scoreLabel.text(`Score: ${score}`);
  highScoreLabel.text(`High Score: ${highScore}`);
  activePiece = nextPiece();
}

function nextPiece() {
  next.push(nextBagIndex());
  return {
    index: next.shift(),
    pos: [3, 0],
    rot: 0,
  };
}

function nextBagIndex() {
  if (bag.length == 0) {
    bag = Array.from({ length: 7 }, (_, i) => i);
    shuffle(bag);
  }
  return bag.pop();
}

function hold() {
  if (justHeld) return;
  if (held != null) {
    let t = activePiece.index;
    activePiece = {
      index: held,
      pos: [3, 0],
      rot: 0,
    };
    held = t;
  } else {
    held = activePiece.index;
    activePiece = nextPiece();
  }
  justHeld = true;
}

function grounded() {
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    const testPos = [
      activePiece.pos[0] + pos[0],
      activePiece.pos[1] + pos[1] + 1,
    ];
    if (!safePlace(testPos)) {
      return true;
    }
  }
  return false;
}

function safePlace([x, y]) {
  if (x < 0 || x >= BOARD_SIZE[0]) return false;
  if (y >= BOARD_SIZE[1]) return false;
  if (board[x][y] != null) return false;

  return true;
}

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getKickIndex(before, after) {
  if (after == (before + 1) % 4) {
    return before * 2;
  } else {
    return (before * 2 + 7) % 8;
  }
}

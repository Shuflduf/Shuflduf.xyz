const BOARD_SIZE = [10, 20];
const BOARD_COLOUR = "#282728";
const COLOURS = [
  "#fa3434",
  "#fb8535",
  "#facc33",
  "#5fe33f",
  "#43cde6",
  "#4455e7",
  "#f64ed8",
];
const NEXT_PIECES = 1;
const GRAVITY_TIME = 300;

let canvas = null;
let ctx = null;
let tileSize = 0;

let board = Array.from(Array(BOARD_SIZE[0]), () =>
  new Array(BOARD_SIZE[1]).fill(null),
);
let bag = [];
let next = [];
let activePiece = null;
let gravityTimer = 0;

$(function () {
  canvas = $("#game").get(0);
  ctx = canvas.getContext("2d");

  console.log(ctx);
  resetGame();
  addEventListener("keydown", handleInputs);
  requestAnimationFrame(process);
});

let lastFrame = 0;
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;

  canvas.width = canvas.clientWidth;
  tileSize = Math.ceil(canvas.width / (BOARD_SIZE[0] + 2));
  canvas.height = tileSize * (BOARD_SIZE[1] + 1);

  gravityTimer += delta;
  if (gravityTimer > GRAVITY_TIME) {
    if (!tryMove([0, 1])) {
      placePiece();
    }
    gravityTimer = 0;
  }

  drawBoard();
  drawActivePiece();

  requestAnimationFrame(process);
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
      // fill(color(COLOURS[blockIndex]));
      // tileAt(x, y);
    }
  }
}

function drawActivePiece() {
  ctx.fillStyle = COLOURS[activePiece.index];
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    drawTile([pos[0] + activePiece.pos[0], pos[1] + activePiece.pos[1]]);
  }
}

function handleInputs(event) {
  // if (event.repeat) return;

  console.log(event.code);
  switch (event.code) {
    case "KeyA":
      tryMove([-1, 0]);
      break;
    case "KeyD":
      tryMove([1, 0]);
      break;
    case "KeyW":
      tryMove([0, 1]);
      break;
    case "ArrowLeft":
      event.preventDefault();
      tryRotate((activePiece.rot + 3) % 4);
      break;
    case "ArrowRight":
      event.preventDefault();
      tryRotate((activePiece.rot + 1) % 4);
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
  // for (const pos of SRS.pieces[currentPiece.index][currentPiece.rot]) {
  //   const blockPos = [
  //     currentPiece.pos[0] + pos[0],
  //     currentPiece.pos[1] + pos[1],
  //   ];
  //   if (!safePlace(blockPos[0], blockPos[1])) resetGame();
  // }
  gravityTimer = 0;
  // justHeld = false;
}

function clearLines() {
  const linesToClear = fullLines();

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
  return true;
}

function tryRotate(newRot) {
  for (const pos of SRS.pieces[activePiece.index][newRot]) {
    const testPos = [activePiece.pos[0] + pos[0], activePiece.pos[1] + pos[1]];
    if (!safePlace(testPos)) return false;
  }
  activePiece.rot = newRot;
  return true;
}

function resetGame() {
  board = Array.from(Array(BOARD_SIZE[0]), () =>
    new Array(BOARD_SIZE[1]).fill(null),
  );
  bag = [];
  next = [];
  // justHeld = false;
  // held = null;
  for (let i = 0; i < NEXT_PIECES; i++) {
    next.push(nextBagIndex());
  }
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

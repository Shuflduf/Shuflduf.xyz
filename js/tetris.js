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
const GRAVITY_TIME = 300;

let canvas = null;
let ctx = null;
let tileSize = 0;

let activePiece = {
  index: 0,
  pos: [3, 0],
  rot: 0,
};
let gravityTimer = 0;

$(function () {
  canvas = $("#game").get(0);
  ctx = canvas.getContext("2d");

  console.log(ctx);
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
    activePiece.pos[1] += 1;
    gravityTimer = 0;
  }

  drawBoard();
  drawActivePiece();

  requestAnimationFrame(process);
}

function drawTile(pos) {
  ctx.fillRect((pos[0] + 1) * tileSize, pos[1] * tileSize, tileSize, tileSize);
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
}

function drawActivePiece() {
  ctx.fillStyle = COLOURS[activePiece.index];
  for (const pos of SRS.pieces[activePiece.index][activePiece.rot]) {
    drawTile([pos[0] + activePiece.pos[0], pos[1] + activePiece.pos[1]]);
  }
}

function handleInputs(event) {
  if (event.repeat) return;

  console.log(event.code);
  switch (event.code) {
    case "KeyA":
      activePiece.pos[0] -= 1;
      break;
    case "KeyD":
      activePiece.pos[0] += 1;
      break;
  }
}

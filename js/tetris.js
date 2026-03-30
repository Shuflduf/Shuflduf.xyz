const BOARD_SIZE = [10, 20];

let canvas = null;
let ctx = null;
let tileSize = 0;

$(function () {
  canvas = $("#game").get(0);
  ctx = canvas.getContext("2d");

  console.log(ctx);
  requestAnimationFrame(process);
});

let lastFrame = 0;
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;

  canvas.width = canvas.clientWidth;
  tileSize = canvas.width / (BOARD_SIZE[0] + 2);
  canvas.height = tileSize * (BOARD_SIZE[1] + 1);

  drawBoard();

  requestAnimationFrame(process);
}

function drawTile(pos) {
  ctx.fillRect((pos[0] + 1) * tileSize, pos[1] * tileSize, tileSize, tileSize);
}

function drawBoard() {
  ctx.fillStyle = "red";
  for (let y = 0; y < BOARD_SIZE[1] + 1; y++) {
    drawTile([-1, y]);
    drawTile([BOARD_SIZE[0], y]);
  }
  for (let x = 0; x < BOARD_SIZE[0]; x++) {
    drawTile([x, BOARD_SIZE[1]]);
  }
}

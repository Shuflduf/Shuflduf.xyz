const GRAVITY = [0, 490];

let canvas = null;
let ctx = null;
let mousePos = [0, 0];
let mouseDown = false;

let stiffness = 80;
let length = 400;
let resolution = 15;

class RopeNode {
  position = [0, 0];
  lastPosition = [0, 0];

  constructor(pos) {
    this.lastPosition = [...pos];
    this.position = [...pos];
  }

  step(delta) {
    const t = [...this.position];
    const velocity = [
      (this.position[0] - this.lastPosition[0]) * 0.99,
      (this.position[1] - this.lastPosition[1]) * 0.99,
    ];
    const movement = [
      velocity[0] + GRAVITY[0] * delta * delta,
      velocity[1] + GRAVITY[1] * delta * delta,
    ];
    this.position = [
      this.position[0] + movement[0],
      this.position[1] + movement[1],
    ];
    this.lastPosition = t;
  }
}

class Rope {
  position = [0, 0];
  nodes = [];

  constructor(pos, length) {
    this.position = pos;
    for (let i = 0; i < Math.ceil(length / resolution); i++) {
      this.nodes.push(new RopeNode([pos[0] + i * 10, pos[1] - i * 10]));
    }
  }

  update(delta) {
    this.simulate(delta);
    for (let i = 0; i < stiffness; i++) {
      this.applyConstraints();
    }
  }

  simulate(delta) {
    for (const node of this.nodes) {
      node.step(delta);
    }
  }

  applyConstraints() {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const current = this.nodes[i];
      const next = this.nodes[i + 1];

      if (i == 0) {
        current.position = this.position;
      } else if (i == this.nodes.length - 2 && mouseDown) {
        next.position = mousePos;
      }

      const posDifference = [
        current.position[0] - next.position[0],
        current.position[1] - next.position[1],
      ];
      const dist = vecLength(posDifference);
      const difference = dist != 0 ? (resolution - dist) / dist : 0;
      const fixOffset = [
        posDifference[0] * difference * 0.5,
        posDifference[1] * difference * 0.5,
      ];
      current.position = [
        current.position[0] + fixOffset[0],
        current.position[1] + fixOffset[1],
      ];
      next.position = [
        next.position[0] - fixOffset[0],
        next.position[1] - fixOffset[1],
      ];
    }
  }

  draw() {
    ctx.lineWidth = 8;
    ctx.strokeStyle = darkMode
      ? "#4EC79E"
      : lightScheme
        ? "#d73c3c"
        : "#978159";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    for (const node of this.nodes) {
      ctx.lineTo(...node.position);
    }
    ctx.stroke();
  }
}

function vecLength([x, y]) {
  return Math.sqrt(x * x + y * y);
}

$(function () {
  $canv = $("#rope");
  $canv.mousemove(
    (e) => (mousePos = [e.originalEvent.offsetX, e.originalEvent.offsetY]),
  );
  $canv.mousedown((e) => {
    $canv.css("cursor", "grabbing");
    mouseDown = true;
  });
  $canv.mouseup((e) => {
    $canv.css("cursor", "grab");
    mouseDown = false;
  });
  $canv.on("touchstart", (e) => {
    $canv.css("cursor", "grabbing");
    mouseDown = true;
  });
  $canv.on("touchend", (e) => {
    $canv.css("cursor", "grab");
    mouseDown = false;
  });
  $canv.on("touchmove", (e) => {
    const canvPos = canvas.getBoundingClientRect();
    mousePos = [
      e.originalEvent.touches[0].pageX - canvPos.top,
      e.originalEvent.touches[0].pageY - canvPos.left,
    ];
  });
  $("#length").on("change", () => {
    length = $("#length").val();
    buildRope();
  });
  $("#resolution").on("change", () => {
    resolution = $("#resolution").val();
    buildRope();
  });
  $("#stiffness").on("change", () => {
    stiffness = $("#stiffness").val();
    buildRope();
  });
  $("#reset").click(() => {
    reset();
  });
  canvas = $canv.get(0);
  ctx = canvas.getContext("2d");

  reset();
  requestAnimationFrame(process);
});

function reset() {
  length = 400;
  resolution = 15;
  stiffness = 80;

  $("#length").val(length);
  $("#resolution").val(resolution);
  $("#stiffness").val(stiffness);
  buildRope();
}

function buildRope() {
  ropes = [];
  ropes.push(new Rope([canvas.clientWidth / 2, 0], length));
}

let ropes = [];
let lastFrame = 0;
function process(currentFrame) {
  const delta = Math.min(currentFrame - lastFrame, 50);
  lastFrame = currentFrame;

  canvas.width = canvas.clientWidth;

  for (const rope of ropes) {
    rope.position[0] = canvas.clientWidth / 2;
    rope.update(delta / 1000);
    rope.draw();
  }

  requestAnimationFrame(process);
}

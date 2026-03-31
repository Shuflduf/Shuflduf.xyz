const GRAVITY = [0, 980];

let canvas = null;
let ctx = null;
let mousePos = [0, 0];

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

const ITERATIONS = 80;
const NODE_DISTANCE = 15;

class Rope {
  position = [0, 0];
  nodes = [];

  constructor(pos, length) {
    this.position = pos;
    for (let i = 0; i < Math.ceil(length / NODE_DISTANCE); i++) {
      this.nodes.push(new RopeNode(pos));
    }
  }

  update(delta) {
    this.simulate(delta);
    for (let i = 0; i < ITERATIONS; i++) {
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
      } else if (i == this.nodes.length - 2) {
        next.position = mousePos;
      }

      const posDifference = [
        current.position[0] - next.position[0],
        current.position[1] - next.position[1],
      ];
      const dist = length(posDifference);
      const difference = dist != 0 ? (NODE_DISTANCE - dist) / dist : 0;
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
    ctx.strokeStyle = "white";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    for (const node of this.nodes) {
      ctx.lineTo(...node.position);
    }
    ctx.stroke();
  }
}

function length([x, y]) {
  return Math.sqrt(x * x + y * y);
}

$(function () {
  $canv = $("#rope");
  $canv.mousemove((e) => {
    console.log(e);
    mousePos = [e.originalEvent.offsetX, e.originalEvent.offsetY];
  });
  canvas = $canv.get(0);
  ctx = canvas.getContext("2d");

  ropes.push(new Rope([30, 30], 200));
  // ropes[0].update(4);
  // ropes[0].draw(4);
  requestAnimationFrame(process);
});

let ropes = [];
let lastFrame = 0;
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;

  canvas.width = canvas.clientWidth;

  for (const rope of ropes) {
    rope.update(0.01);
    rope.draw();
  }

  requestAnimationFrame(process);
}

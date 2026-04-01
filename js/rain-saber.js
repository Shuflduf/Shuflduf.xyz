let canvas = null;
let ctx = null;
let currentFrame = 0;

let mousePath = [];

class Note {
  fromPosition = [0, 0];
  slicePosition = [0, 0];
  sliceTime = 0;
  timeMargin = 0;
  sliceAngle = 0;
  position = [0, 0];

  constructor({
    fromPosition,
    slicePosition,
    sliceTime,
    timeMargin,
    sliceAngle,
  }) {
    this.fromPosition = fromPosition;
    this.slicePosition = slicePosition;
    this.sliceTime = sliceTime;
    this.timeMargin = timeMargin;
    this.sliceAngle = sliceAngle;
  }

  step() {
    if (this.visible(currentFrame)) {
      const completion = (currentFrame - this.sliceTime) / this.timeMargin;
      const vertical =
        this.fromPosition[1] == canvas.height || this.fromPosition[1] == 0;
      const parabolaAxis = vertical ? 1 : 0;
      const straightAxis = vertical ? 0 : 1;

      const straightPos = lerp(
        this.slicePosition[straightAxis],
        completion < 0
          ? this.fromPosition[straightAxis]
          : -this.fromPosition[straightAxis] +
              this.slicePosition[straightAxis] * 2,
        Math.abs(completion),
      );
      const parabolaPos = lerp(
        this.slicePosition[parabolaAxis],
        this.fromPosition[parabolaAxis],
        completion * completion,
      );
      if (vertical) {
        this.position = [straightPos, parabolaPos];
      } else {
        this.position = [parabolaPos, straightPos];
      }
    }
  }

  draw() {
    if (!this.visible()) return;

    ctx.lineWidth = 8;
    ctx.strokeStyle = "#348569";
    ctx.fillStyle = "#4ec79e";
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    const completion = (currentFrame - this.sliceTime) / this.timeMargin;
    if (completion < 0) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        this.position[0],
        this.position[1],
        30 + completion * -60,
        0,
        2 * Math.PI,
      );
      ctx.stroke();
    }

    const indicatorLength = 40;
    ctx.lineWidth = lerp(8, 0, completion * completion);
    ctx.beginPath();
    ctx.moveTo(
      this.position[0] + Math.cos(degToRad(this.sliceAngle)) * indicatorLength,
      this.position[1] + Math.sin(degToRad(this.sliceAngle)) * indicatorLength,
    );
    ctx.lineTo(
      this.position[0] - Math.cos(degToRad(this.sliceAngle)) * indicatorLength,
      this.position[1] - Math.sin(degToRad(this.sliceAngle)) * indicatorLength,
    );
    ctx.stroke();
  }

  visible() {
    return (
      currentFrame > this.sliceTime - this.timeMargin &&
      currentFrame < this.sliceTime + this.timeMargin
    );
  }
}

$(function () {
  $canv = $("#game");
  $canv.mousemove((e) => mouseMove(e.originalEvent));
  canvas = $canv.get(0);

  canvas.width = canvas.clientWidth;
  ctx = canvas.getContext("2d");

  notes.push(
    new Note({
      fromPosition: [canvas.width, 1],
      slicePosition: [200, 200],
      sliceTime: 2000,
      timeMargin: 500,
      sliceAngle: 30,
    }),
    new Note({
      fromPosition: [canvas.width / 2, canvas.height],
      slicePosition: [200, 200],
      sliceTime: 2000,
      timeMargin: 800,
      sliceAngle: 30,
    }),
  );

  requestAnimationFrame(process);
});

function mouseMove(e) {
  if (mousePath.length >= 5) {
    mousePath.shift();
  }
  mousePath.push([e.offsetX, e.offsetY]);
  checkSliceCollisions(mousePath.at(-1), mousePath[0]);
}

function checkSliceCollisions(startPoint, endPoint) {
  for (const note of notes) {
    if (!note.visible()) continue;

    const dist = pointToLineDistance(note.position, startPoint, endPoint);
    const delta = [endPoint[0] - startPoint[0], endPoint[1], startPoint[1]];
    const sliceAngle = radToDeg(Math.atan2(delta[1], delta[0]));
    const angleDiff = Math.abs(sliceAngle - note.sliceAngle);
    console.log(sliceAngle);
    const angleValid = angleDiff < 30 || Math.abs(angleDiff - 360) < 30;

    const completion = (currentFrame - note.sliceTime) / note.timeMargin;
    if (dist < 35 && Math.abs(completion) < 0.3 && angleValid) {
      console.log("slice");
      notes = notes.filter((n) => n != note);
    }
  }
}

function drawMousePath() {
  if (mousePath.length < 1) return;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(mousePath[0][0], mousePath[0][1]);
  for (let i = 1; i < mousePath.length; i++) {
    ctx.lineTo(mousePath[i][0], mousePath[i][1]);
  }
  ctx.stroke();
}

let lastFrame = 0;
let notes = [];
function process(cf) {
  currentFrame = cf;
  canvas.width = canvas.clientWidth;

  for (const note of notes) {
    note.step();
    note.draw();
  }

  drawMousePath();

  requestAnimationFrame(process);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

function pointToLineDistance(point, line1, line2) {
  const [px, py] = point;
  const [x1, y1] = line1;
  const [x2, y2] = line2;
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  const closestX = x1 + param * C;
  const closestY = y1 + param * D;
  const dx = px - closestX;
  const dy = py - closestY;
  return Math.sqrt(dx * dx + dy * dy);
}

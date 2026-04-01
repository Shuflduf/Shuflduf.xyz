let canvas = null;
let ctx = null;
let mousePath = [];

let currentTime = 0;
let trackInfo = null;
let playing = false;
let notes = [];

let editMode = false;
let audioContext = null;
let analyzer = null;
let dataArray = [];

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
    if (this.visible(currentTime)) {
      const completion = (currentTime - this.sliceTime) / this.timeMargin;
      const vertical =
        this.fromPosition[1] == 1.0 || this.fromPosition[1] == 0.0;
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

    const drawPosition = [
      this.position[0] * canvas.width,
      this.position[1] * canvas.height,
    ];

    ctx.lineWidth = 8;
    ctx.strokeStyle = "#348569";
    ctx.fillStyle = "#4ec79e";
    ctx.beginPath();
    ctx.arc(drawPosition[0], drawPosition[1], 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    const completion = (currentTime - this.sliceTime) / this.timeMargin;
    if (completion < 0) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        drawPosition[0],
        drawPosition[1],
        30 + completion * -60,
        0,
        2 * Math.PI,
      );
      ctx.stroke();
    }

    const indicatorLength = 40;

    ctx.lineWidth = lerp(6, 1, Math.abs(completion));
    ctx.beginPath();
    ctx.moveTo(
      drawPosition[0] +
        Math.cos(degToRad(this.sliceAngle) + 45) * indicatorLength * 0.5,
      drawPosition[1] +
        Math.sin(degToRad(this.sliceAngle) + 45) * indicatorLength * 0.5,
    );
    ctx.lineTo(drawPosition[0], drawPosition[1]);
    ctx.lineTo(
      drawPosition[0] +
        Math.cos(degToRad(this.sliceAngle) - 45) * indicatorLength * 0.5,
      drawPosition[1] +
        Math.sin(degToRad(this.sliceAngle) - 45) * indicatorLength * 0.5,
    );
    ctx.stroke();
  }

  visible() {
    return (
      currentTime > this.sliceTime - this.timeMargin &&
      currentTime < this.sliceTime + this.timeMargin
    );
  }
}

// init

$(function () {
  $("#start-editor").on("click", startEditor);
  $("#start-game").on("click", startGame);
  $canv = $("#game");
  $canv.mousemove((e) => mouseMove(e.originalEvent));
  canvas = $canv.get(0);

  canvas.width = canvas.clientWidth;
  ctx = canvas.getContext("2d");

  fetch("/assets/rainsaber/unbound.json")
    .then((r) => r.json())
    .then((r) => {
      trackInfo = r;
      $("#audio-player").attr("src", trackInfo.musicURI);
    });
  requestAnimationFrame(process);
});

// game

function startGame() {
  currentTime = 0;
  playing = true;
  notes = trackInfo.notes.map((note) => new Note({ ...note }));
  $("#audio-player").get(0).play();
}

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

    const visualPosition = [
      note.position[0] * canvas.width,
      note.position[1] * canvas.height,
    ];
    const dist = pointToLineDistance(visualPosition, startPoint, endPoint);
    const delta = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    const sliceAngle = radToDeg(Math.atan2(delta[1], delta[0]));
    const angleDiff = Math.abs(sliceAngle - note.sliceAngle);
    console.log(sliceAngle);
    const angleValid = angleDiff < 30 || Math.abs(angleDiff - 360) < 30;

    const completion = (currentTime - note.sliceTime) / note.timeMargin;
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

// editor

function startEditor() {
  editMode = true;
  initAudio();
}

function drawEditor() {
  if (!editMode) return;

  ctx.fillStyle = "#bbb8";
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

  if (analyzer) {
    analyzer.getByteFrequencyData(dataArray);

    const barWidth = canvas.width / dataArray.length;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * 40;
      const x = i * barWidth;
      const y = canvas.height - 50 + (40 - barHeight) / 2;
      if (i == 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;

  const source = audioContext.createMediaElementSource(
    $("#audio-player").get(0),
  );
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);
  dataArray = new Uint8Array(analyzer.frequencyBinCount);
  console.log(source);
}

// process

let lastFrame = 0;
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;
  canvas.width = canvas.clientWidth;

  if (playing) {
    currentTime += delta;
    for (const note of notes) {
      note.step();
      note.draw();
    }
  }

  drawEditor();
  drawMousePath();

  requestAnimationFrame(process);
}

// lib functions

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

let canvas = null;
let ctx = null;

class Note {
  fromPosition = [0, 0];
  slicePosition = [0, 0];
  sliceTime = 0;
  timeMargin = 0;
  position = [0, 0];

  constructor({ fromPosition, slicePosition, sliceTime, timeMargin }) {
    this.fromPosition = fromPosition;
    this.slicePosition = slicePosition;
    this.sliceTime = sliceTime;
    this.timeMargin = timeMargin;
  }

  step(currentTime) {
    if (
      currentTime > this.sliceTime - this.timeMargin &&
      currentTime < this.sliceTime + this.timeMargin
    ) {
      const completion = (currentTime - this.sliceTime) / this.timeMargin;
      console.log(completion);
      if (this.fromPosition[1] == canvas.height) {
        this.position = [
          lerp(
            this.slicePosition[0],
            completion < 0
              ? this.fromPosition[0]
              : -this.fromPosition[0] + this.slicePosition[0] * 2,
            Math.abs(completion),
          ),
          lerp(
            this.slicePosition[1],
            this.fromPosition[1],
            completion * completion,
          ),
        ];
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position[0], this.position[1], 30, 0, 2 * Math.PI);
    ctx.fill();
  }
}

$(function () {
  canvas = $("#game").get(0);
  ctx = canvas.getContext("2d");

  notes.push(
    new Note({
      fromPosition: [90, canvas.height],
      slicePosition: [200, 200],
      sliceTime: 2000,
      timeMargin: 500,
    }),
  );

  requestAnimationFrame(process);
});

let lastFrame = 0;
let notes = [];
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;

  canvas.width = canvas.clientWidth;

  for (const note of notes) {
    note.step(currentFrame);
    note.draw();
  }

  requestAnimationFrame(process);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

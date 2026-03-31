let canvas = null;
let ctx = null;

class Note {
  fromPosition = [0, 0];
  slicePosition = [0, 0];
  sliceTime = 0;
  timeMargin = 0;

  constructor({ fromPosition, slicePosition, sliceTime, timeMargin }) {
    this.fromPosition = fromPosition;
    this.slicePosition = slicePosition;
    this.sliceTime = sliceTime;
    this.timeMargin = timeMargin;
  }
}

$(function () {
  canvas = $("#game").get(0);
  ctx = canvas.getContext("2d");

  requestAnimationFrame(process);
});

let lastFrame = 0;
function process(currentFrame) {
  const delta = currentFrame - lastFrame;
  lastFrame = currentFrame;

  canvas.width = canvas.clientWidth;

  requestAnimationFrame(process);
}

let canvas = null;
let ctx = null;

$(function () {
  canvas = $("#ballpit").get(0);
  ctx = canvas.getContext("2d");

  requestAnimationFrame(process);
  createCircles();
});

let activeCircles = [];
let previousFrame = 0;

function createCircles() {
  tools.forEach((tool) => {
    let circ = {
      pos: [
        Math.random() * canvas.clientWidth,
        Math.random() * -canvas.clientHeight,
      ],
      vel: [0.0, 0.0],
      radius: tool.radius,
      bg: tool.bg,
    };
    if (tool.icon) {
      circ.img = new Image();
      circ.img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.icon}/${tool.icon}-${tool.variant}.svg`;
    } else {
      circ.emoji = tool.emoji;
    }
    activeCircles.push(circ);
  });
}

function process(currentFrame) {
  let delta = currentFrame - previousFrame;
  previousFrame = currentFrame;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  activeCircles.forEach((circ, i) => {
    circ.vel[1] += delta / 200.0;

    activeCircles[i].pos[0] += circ.vel[0];
    activeCircles[i].pos[1] += circ.vel[1];

    if (circ.pos[1] > canvas.height - circ.radius) {
      activeCircles[i].vel[1] *= -0.7;
      activeCircles[i].pos[1] = canvas.height - circ.radius;
    }
    if (circ.pos[0] < circ.radius) {
      activeCircles[i].vel[0] *= -0.7;
      activeCircles[i].pos[0] = circ.radius;
    }
    if (circ.pos[0] > canvas.width - circ.radius) {
      activeCircles[i].vel[0] *= -0.7;
      activeCircles[i].pos[0] = canvas.width - circ.radius;
    }

    ctx.fillStyle = circ.bg;
    ctx.beginPath();
    ctx.arc(circ.pos[0], circ.pos[1], circ.radius, 0, 2 * Math.PI);
    ctx.fill();
    if (circ.img) {
      // ctx.fillStyle = "black";
      ctx.filter = "invert(1)";
      ctx.drawImage(
        circ.img,
        circ.pos[0] - circ.radius / 2.0,
        circ.pos[1] - circ.radius / 2.0,
        circ.radius,
        circ.radius,
      );
      ctx.filter = "none";
    } else {
      console.log(circ.emoji);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${circ.radius}px Serif`;
      ctx.fillText(circ.emoji, circ.pos[0], circ.pos[1]);
    }
  });

  resolveCollisions();
  requestAnimationFrame(process);
}

function resolveCollisions() {
  for (let i = 0; i < activeCircles.length; i++) {
    for (let j = i + 1; j < activeCircles.length; j++) {
      const circA = activeCircles[i];
      const circB = activeCircles[j];
      const diff = [circB.pos[0] - circA.pos[0], circB.pos[1] - circA.pos[1]];
      const dist = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]);
      const minDist = circA.radius + circB.radius;

      if (dist < minDist && dist > 0) {
        const normal = [diff[0] / dist, diff[1] / dist];
        const overlap = (minDist - dist) / 2.0;
        circA.pos[0] -= normal[0] * overlap;
        circA.pos[1] -= normal[1] * overlap;
        circB.pos[0] += normal[0] * overlap;
        circB.pos[1] += normal[1] * overlap;

        deltaVel =
          (circA.vel[0] - circB.vel[0]) * normal[0] +
          (circA.vel[1] - circB.vel[1]) * normal[1];
        if (deltaVel > 0.0) {
          circA.vel[0] -= deltaVel * normal[0] * 0.99;
          circA.vel[1] -= deltaVel * normal[1] * 0.99;
          circB.vel[0] += deltaVel * normal[0] * 0.99;
          circB.vel[1] += deltaVel * normal[1] * 0.99;
        }
      }
    }
  }
}

let canvas = null;
let ctx = null;

$(function () {
  canvas = $("#ballpit").get(0);
  ctx = canvas.getContext("2d");

  requestAnimationFrame(process);
  createCircles();

  const tooltip = $("#tooltip");

  function getBallAt(x, y) {
    return activeCircles.find((c) => {
      const delta = [c.pos[0] - x, c.pos[1] - y];
      return delta[0] * delta[0] + delta[1] * delta[1] < c.radius * c.radius;
    });
  }

  $("#reset").on("click", () => {
    activeCircles = [];
    createCircles();
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const ball = getBallAt(e.clientX - rect.left, e.clientY - rect.top);
    if (ball) {
      tooltip
        .text(ball.name)
        .css({ left: e.clientX + 14, top: e.clientY + 14 })
        .show();
      canvas.style.cursor = "pointer";
    } else {
      tooltip.hide();
      canvas.style.cursor = "default";
    }
  });

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const ball = getBallAt(e.clientX - rect.left, e.clientY - rect.top);
    if (ball && ball.name == "Egg") {
      activeCircles = activeCircles.filter((b) => b.name != "Egg");
      localStorage.setItem("egg-2", true);
      $("#egg").get(0).play();
    }
  });

  canvas.addEventListener("mouseleave", () => tooltip.hide());

  // canvas.addEventListener("click", (e) => {
  //   const rect = canvas.getBoundingClientRect();
  //   const clickPos = [e.clientX - rect.left, e.clientY - rect.top];
  //   const IMPULSE_RADIUS = 20;
  //   const IMPULSE_STRENGTH = 5;

  //   activeCircles.forEach((circ) => {
  //     const delta = [circ.pos[0] - clickPos[0], circ.pos[1] - clickPos[1]];
  //     const dist = Math.sqrt(delta[0] * delta[0] + delta[1] + delta[1]);
  //     if (dist < IMPULSE_RADIUS && dist > 0.0) {
  //       const force = (1 - dist / IMPULSE_RADIUS) * IMPULSE_STRENGTH;
  //       circ.vel[0] += (delta[0] / dist) * force;
  //       circ.vel[1] += (delta[1] / dist) * force;
  //     }
  //   });
  // });
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
      vel: [Math.random() - 0.5, Math.random() - 0.5],
      radius: tool.radius,
      bg: tool.bg,
      name: tool.name,
    };
    if (tool.icon) {
      circ.img = new Image();
      circ.img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool.icon}/${tool.icon}-${tool.variant}.svg`;
    } else if (tool.url) {
      circ.img = new Image();
      circ.img.src = tool.url;
    } else {
      circ.emoji = tool.emoji;
    }
    activeCircles.push(circ);
  });
  if (!localStorage.getItem("egg-2")) {
    let egg = {
      pos: [
        Math.random() * canvas.clientWidth,
        Math.random() * -canvas.clientHeight,
      ],
      vel: [Math.random() - 0.5, Math.random() - 0.5],
      radius: 20,
      bg: "#000000",
      name: "Egg",
    };
    egg.img = new Image();
    egg.img.src = "/assets/egg.png";
    activeCircles.push(egg);
  }
}

function process(currentFrame) {
  let delta = Math.min(currentFrame - previousFrame, 50);
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
      const imgSize = circ.radius * 1.2;
      console.log(circ.img.src);
      ctx.drawImage(
        circ.img,
        circ.pos[0] - imgSize / 2.0,
        circ.pos[1] - imgSize / 2.0,
        imgSize,
        imgSize,
      );
    } else {
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

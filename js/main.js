
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const randomParts = Math.floor(Math.random() * 10) + 1;

let points = [];

const randomHeight = () => {
  const direction = randomParts > 10 ? 1 : -1;
  return Math.abs(Math.floor(Math.random() * 10 - 5)) * direction;
};

const createPoints = (width, height) => {
  const points = [];
  for (let index = 1; index <= randomParts; index++) {
    const widthGraph = Math.floor((width / randomParts) * index);
    if (index !== randomParts) {
      points.push({
        x: index === 1 ? 0 : widthGraph,
        y: index === 1 ? 0 : Math.round(height / Math.floor(Math.random() * 10 + 1)),
      });
    } else {
      points.push({
        x: width,
        y: 0,
      });
    }
  }
  return points;
};

const maxPointCoordinates = () => {
  const maxX = points.reduce(
    (max, point) => (max <= point.x ? (max = point.x) : max),
    0
  );
  const maxY = points.reduce(
    (max, point) => (max <= point.y ? (max = point.y) : max),
    0
  );
  return { x: maxX, y: maxY };
};

const drawChart = (canvas, points, message = 'draw') => {
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (var i = 0; i < points.length - 1; i++) {
      // Draw point
      // ctx.arc(points[i].x, points[i].y, 10, 0, Math.PI * 2, false);

      var x_mid = (points[i].x + points[i + 1].x) / 2;
      var y_mid = (points[i].y + points[i + 1].y) / 2;
      var cp_x1 = (x_mid + points[i].x) / 2;
      var cp_y1 = (y_mid + points[i].y) / 2;
      var cp_x2 = Math.round((x_mid + points[i + 1].x) / 2);
      var cp_y2 = (y_mid + points[i + 1].y) / 2;

      ctx.quadraticCurveTo(cp_x1, points[i].y, x_mid, y_mid);
      ctx.quadraticCurveTo(
        cp_x2,
        points[i + 1].y,
        points[i + 1].x,
        points[i + 1].y
      );
      // ctx.stroke();
      // ctx.closePath();
    }
    // ctx.arc(
    //   points[points.length - 1].x,
    //   points[points.length - 1].y,
    //   2,
    //   0,
    //   Math.PI * 2,
    //   false
    // );
    // ctx.stroke();
    const maxPoint = maxPointCoordinates();
    const gradient = ctx.createLinearGradient(
      canvas.width / 2,
      0,
      maxPoint.x,
      maxPoint.y
    );
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.5, "cyan");
    gradient.addColorStop(1, "#032f50");
    ctx.fillStyle = gradient;
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    console.log(message)
  }
};

const mutationPoints = (direction = 1) => {
  return points.map((point) => {
    point.y += Math.round(direction * (Math.random() * 10) * (point.y / 1000));
    return point;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  points = createPoints(windowWidth, windowHeight);
  canvas.width = windowWidth;
  canvas.height = windowHeight;
  drawChart(canvas, points);
});

document.addEventListener("mousewheel", (e) => {
  if (canvas && canvas.getContext) {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    const direction = e.wheelDelta >= 0 ? -1 : 1;
    const newPoints = mutationPoints(direction);
    drawChart(canvas, newPoints, 'scroll');
  }
});

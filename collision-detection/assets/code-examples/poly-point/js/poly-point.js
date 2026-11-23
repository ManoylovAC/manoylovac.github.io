// POLYGON with POINT
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// координати рухомої точки
let px = 0;
let py = 0;

// масив векторів вершин багатокутника
const vertices = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(15); // збільшена товщина точки для кращої видимості
  noCursor();

  // задаємо вершини багатокутника (тут трапеція)
  vertices[0] = createVector(width / 2 - 100, height / 2 - 100);
  vertices[1] = createVector(width / 2 + 100, height / 2 - 100);
  vertices[2] = createVector(width / 2 + 50,  height / 2 + 100);
  vertices[3] = createVector(width / 2 - 50,  height / 2 + 100);
}

function draw() {
  background(255);

  // оновлюємо координати точки положенням курсора
  px = mouseX;
  py = mouseY;

  // перевіряємо, чи точка всередині багатокутника
  const isColliding = collidePolyPoint(vertices, px, py);

  // змінюємо колір багатокутника при зіткненні
  if (isColliding) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо багатокутник за його вершинами
  noStroke();
  beginShape();
  for (const v of vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // малюємо рухому точку
  stroke(0, 150);
  point(px, py);
}

// перевірка на зіткнення між багатокутником та точкою
function collidePolyPoint(vertices, px, py) {
  let isCollision = false;

  // перебираємо всі ребра багатокутника
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currentVertex = vertices[current];
    const nextVertex = vertices[next];

    // якщо горизонтальний промінь від точки праворуч перетинає поточне ребро, інвертуємо прапорець isCollision
    if (
      ((currentVertex.y >= py && nextVertex.y < py) || (currentVertex.y < py && nextVertex.y >= py)) &&
      (px < (nextVertex.x - currentVertex.x) * (py - currentVertex.y) / (nextVertex.y - currentVertex.y) + currentVertex.x)
    ) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

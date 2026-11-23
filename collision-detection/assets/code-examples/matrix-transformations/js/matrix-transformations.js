// MATRIX TRANSFORMATIONS
// Jeff Thompson | 2019 | jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// масиви локальних вершин двох квадратів
let squarePoints1;
let squarePoints2;

let angle = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();

  // активуємо функцію screenPosition() із підключеного модуля
  // джерело: https://github.com/bohnacker/p5js-screenPosition
  addScreenPositionFunction();

  squarePoints1 = [
    createVector(-50, -50),
    createVector( 50, -50),
    createVector( 50,  50),
    createVector(-50,  50),
  ];
  squarePoints2 = [
    createVector(-100, -100),
    createVector( 100, -100),
    createVector( 100,  100),
    createVector(-100,  100),
  ];
}

function draw() {
  background(255);

  // збільшуємо кут обертання в кожному кадрі
  angle += 0.02;

  // переміщуємо та повертаємо систему координат для першого квадрата
  push();
  translate(width / 2 - 100, height / 2);
  rotate(angle);

  // зчитуємо фактичні екранні координати першого квадрата після трансформацій
  const square1Screen = pointsToScreenCoords(squarePoints1);

  // малюємо перший квадрат
  fill(0, 150);
  noStroke();
  beginShape();
  for (const pt of squarePoints1) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
  pop();

  // переміщуємо та повертаємо систему координат для другого квадрата
  push();
  translate(width / 2 + 100, height / 2);
  rotate(angle);

  // зчитуємо фактичні екранні координати другого квадрата
  const square2Screen = pointsToScreenCoords(squarePoints2);

  // перевіряємо зіткнення двох повернутих квадратів як багатокутників
  const isColliding = collidePolyPoly(square1Screen, square2Screen);

  // змінюємо колір другого квадрата при зіткненні
  if (isColliding) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо другий квадрат
  beginShape();
  for (const pt of squarePoints2) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
  pop();
}

// перетворення локальних вершин на екранні координати полотна після матричних перетворень (наприклад, translate та rotate),
function pointsToScreenCoords(points) {
  const screenPoints = new Array(points.length);

  for (let i = 0; i < points.length; i++) {
    const screenPoint = screenPosition(points[i].x, points[i].y);  // отримання абсолютних xyz-координат
    screenPoints[i] = createVector(screenPoint.x, screenPoint.y);
  }

  return screenPoints;
}

// перевірка на зіткнення між двома багатокутниками
function collidePolyPoly(p1, p2) {
  let next = 0;
  for (let current = 0; current < p1.length; current++) {
    next = current + 1;
    if (next === p1.length) {
      next = 0;
    }

    const currentVertex = p1[current];
    const nextVertex = p1[next];

    const isCollision = collidePolyLine(
      p2,
      currentVertex.x, currentVertex.y,
      nextVertex.x, nextVertex.y
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: перевіряємо, чи один багатокутник всередині іншого
  const isInside = collidePolyPoint(p1, p2[0].x, p2[0].y);
  if (isInside) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між багатокутником та лінією
function collidePolyLine(vertices, x1, y1, x2, y2) {
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currentVertex = vertices[current];
    const nextVertex = vertices[next];

    const x3 = currentVertex.x;
    const y3 = currentVertex.y;
    const x4 = nextVertex.x;
    const y4 = nextVertex.y;

    const isHit = collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  return false;
}

// перевірка на перетин двох відрізків
function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

// перевірка на зіткнення між багатокутником та точкою
function collidePolyPoint(vertices, px, py) {
  let isCollision = false;

  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currentVertex = vertices[current];
    const nextVertex = vertices[next];

    if (
      ((currentVertex.y >= py && nextVertex.y < py) || (currentVertex.y < py && nextVertex.y >= py)) &&
      (px < (nextVertex.x - currentVertex.x) * (py - currentVertex.y) / (nextVertex.y - currentVertex.y) + currentVertex.x)
    ) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

// COLLISION DETECTION: POLYGON with POLYGON
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// масиви для вершин двох багатокутників
const pentagon = new Array(5);
const randomPoly = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // створюємо вершини статичного правильного п’ятикутника
  const angleStep = TWO_PI / pentagon.length;
  for (let i = 0; i < pentagon.length; i++) {
    const angle = angleStep * i;
    const x = width / 2 + cos(angle) * 100;
    const y = height / 2 + sin(angle) * 100;
    pentagon[i] = createVector(x, y);
  }

  // генеруємо випадкові вершини для рухомого багатокутника
  let angle = 0;
  while (angle < 360) {
    const x = cos(radians(angle)) * random(30, 50);
    const y = sin(radians(angle)) * random(30, 50);
    randomPoly.push(createVector(x, y));
    angle += random(15, 40);
  }
}

function draw() {
  background(255);

  // зміщуємо всі вершини рухомого багатокутника вслід за курсором
  const mouse = createVector(mouseX, mouseY);
  const diff = p5.Vector.sub(mouse, randomPoly[0]);
  for (const v of randomPoly) {
    v.add(diff);
  }

  // перевіряємо зіткнення двох багатокутників
  const isColliding = collidePolyPoly(pentagon, randomPoly);

  // змінюємо колір п’ятикутника при зіткненні
  if (isColliding) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо статичний п’ятикутник
  noStroke();
  beginShape();
  for (const v of pentagon) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // малюємо рухомий випадковий багатокутник
  fill(0, 150);
  beginShape();
  for (const v of randomPoly) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}

// перевірка на зіткнення двох багатокутників
function collidePolyPoly(p1, p2) {
  // перебираємо всі ребра першого багатокутника
  let next = 0;
  for (let current = 0; current < p1.length; current++) {
    next = current + 1;
    if (next === p1.length) {
      next = 0;
    }

    const currVertex = p1[current];
    const nextVertex = p1[next];

    // перевіряємо, чи поточне ребро p1 перетинає багатокутник p2
    const isCollision = collidePolyLine(
      p2,
      currVertex.x, currVertex.y,
      nextVertex.x, nextVertex.y
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: перевіряємо, чи один багатокутник повністю всередині іншого
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

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    const x3 = currVertex.x;
    const y3 = currVertex.y;
    const x4 = nextVertex.x;
    const y4 = nextVertex.y;

    const isHit = collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  return false;
}

// перевірка на перетин між двома відрізками
function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / 
             ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
             ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між багатокутником та точкою
// використовується лише для перевірки, чи другий багатокутник знаходиться ВСЕРЕДИНІ першого
function collidePolyPoint(vertices, px, py) {
  let isCollision = false;

  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    if (
      ((currVertex.y >= py && nextVertex.y < py) || (currVertex.y < py && nextVertex.y >= py)) &&
      (px < (nextVertex.x - currVertex.x) * (py - currVertex.y) / (nextVertex.y - currVertex.y) + currVertex.x)
    ) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

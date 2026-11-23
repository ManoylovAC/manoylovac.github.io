// COLLISION DETECTION: POLYGON with RECTANGLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// координати та розміри рухомого прямокутника
let rx = 0;
let ry = 0;
const rw = 30;
const rh = 30;

// масив векторів вершин багатокутника
const vertices = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // задаємо координати вершин багатокутника (тут це трапеція)
  vertices[0] = createVector(width / 2 - 100, height / 2 - 100);
  vertices[1] = createVector(width / 2 + 100, height / 2 - 100);
  vertices[2] = createVector(width / 2 + 50,  height / 2 + 100);
  vertices[3] = createVector(width / 2 - 50,  height / 2 + 100);
}

function draw() {
  background(255);

  // оновлюємо координати прямокутника положенням курсора
  rx = mouseX;
  ry = mouseY;

  // перевіряємо зіткнення багатокутника і прямокутника
  const isColliding = collidePolyRect(vertices, rx, ry, rw, rh);

  // змінюємо колір багатокутника при зіткненні
  if (isColliding) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо багатокутник
  noStroke();
  beginShape();
  for (const v of vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // малюємо прямокутник
  fill(0, 150);
  rect(rx, ry, rw, rh);
}

// перевірка на зіткнення між багатокутником і прямокутником
function collidePolyRect(vertices, rx, ry, rw, rh) {
  // перебираємо всі ребра багатокутника
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    // перевіряємо, чи поточне ребро перетинає прямокутник
    const isCollision = collideLineRect(
      currVertex.x, currVertex.y,
      nextVertex.x, nextVertex.y,
      rx, ry, rw, rh
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: перевіряємо, чи прямокутник повністю всередині багатокутника
  // зауважте, що це повторює перебір усіх сторін багатокутника знову,
  // тому використовуйте це лише, якщо вам потрібно
  const isInside = collidePolyPoint(vertices, rx, ry);
  if (isInside) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між лінією та прямокутником
function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  const collidesLeft   = collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  const collidesRight  = collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  const collidesTop    = collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  const collidesBottom = collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  if (collidesLeft || collidesRight || collidesTop || collidesBottom) {
    return true;
  }

  return false;
}

// перевірка на перетин двох відрізків
function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між багатокутником та точкою
// потрібно, лише якщо ви збираєтеся перевірити, чи прямокутник знаходиться ВСЕРЕДИНІ багатокутника
function collidePolyPoint(vertices, px, py) {
  let isCollision = false;

  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    // порівняти позицію, інвертувати змінну 'isCollision'
    if (
      ((currVertex.y >= py && nextVertex.y < py) || (currVertex.y < py && nextVertex.y >= py)) &&
      (px < (nextVertex.x - currVertex.x) * (py - currVertex.y) / (nextVertex.y - currVertex.y) + currVertex.x)
    ) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

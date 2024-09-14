// COLLISION DETECTION: POLYGON with RECTANGLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для рухомого квадрата
let sx = 0;
let sy = 0;
let sw = 30;
let sh = 30;

// масив для векторів, по одному для кожної вершини багатокутника
let vertices = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // створення набору координат багатокутника (тут це паралелограм)
  vertices[0] = createVector(width / 2 - 100, height / 2 - 100);
  vertices[1] = createVector(width / 2 + 100, height / 2 - 100);
  vertices[2] = createVector(width / 2 + 50, height / 2 + 100);
  vertices[3] = createVector(width / 2 - 50, height / 2 + 100);
}

function draw() {
  background(255);

  // оновлення координат центру круга координатами курсора
  sx = mouseX;
  sy = mouseY;

  // результат перевірки на зіткнення
  const isHit = isPolyWithRectCollides(vertices, sx, sy, sw, sh);

  // при зіткненні змінюємо колір
  if (isHit) fill(255, 150, 0);
  else fill(0, 150, 255);

  // малювання багатокутника через перебір вершин
  noStroke();
  beginShape();
  for (const v of vertices) {
    vertex(v.x, v.y);
  }
  endShape();

  // малювання прямокутника
  fill(0, 150);
  rect(sx, sy, sw, sh);
}

// перевірка на перетин між багатокутником і прямокутником
function isPolyWithRectCollides(vertices, rx, ry, rw, rh) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {

    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];// c для "current" (поточний)
    const vn = vertices[next];   // n для "next" (наступний)

    // перевіряємо всі чотири сторони прямокутника
    const isCollision = isLineWithRectCollides(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
    if (isCollision) return true;

    // необов’язково: перевірка на те, чи прямокутник знаходиться ВСЕРЕДИНІ багатокутника,
    // зауважте, що це повторює перебір усіх сторін багатокутника знову,
    // тому використовуйте це лише, якщо вам потрібно
    const isInside = isPolygonPointCollides(vertices, rx, ry);
    if (isInside) return true;
  }

  return false;
}

// перевірка на перетин між лінією та прямокутником
function isLineWithRectCollides(x1, y1, x2, y2, rx, ry, rw, rh) {
  // перевірка, чи лінія торкнулася будь-якої сторони прямокутника
  const left = isLineWithLineCollides(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  const right = isLineWithLineCollides(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  const top = isLineWithLineCollides(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  const bottom = isLineWithLineCollides(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  // якщо БУДЬ-ЩО з наведеного вище вірно, значить лінія має перетин з прямокутником
  if (left || right || top || bottom) {
    return true;
  }

  return false;
}

// перевірка на перетин між лінією та кругом
function isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4) {
  // розрахунок напрямку ліній
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }

  return false;
}

// перевірка на перетин між багатокутником та точкою
// потрібно, лише якщо ви збираєтеся перевірити, чи прямокутник знаходиться ВСЕРЕДИНІ багатокутника
function isPolygonPointCollides(vertices, px, py) {
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

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];  // c для "current" (поточний)
    const vn = vertices[next];     // n для "next" (наступний)

    // порівняти позицію, інвертувати змінну 'isCollision'
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
      (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

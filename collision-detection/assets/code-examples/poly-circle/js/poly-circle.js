// COLLISION DETECTION: POLYGON with CIRCLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для рухомого круга
let cx = 0;
let cy = 0;
let r = 30;

// масив для векторів, по одному для кожної вершини багатокутника
let vertices = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // створення координат для багатокутника (тут це трапеція)
  vertices[0] = createVector(width/2-100, height/2-100);
  vertices[1] = createVector(width/2+100, height/2-100);
  vertices[2] = createVector(width/2+50,  height/2+100);
  vertices[3] = createVector(width/2-50,  height/2+100);
}

function draw() {
  background(255);

  // оновлення координат центру круга координатами курсора
  cx = mouseX;
  cy = mouseY;

  // результат перевірки на зіткнення
  // при зіткненні змінюємо колір
  const isHit = isPolyWithCircleCollides(vertices, cx, cy, r);
  if (isHit) fill(255, 150, 0);
  else fill(0, 150, 255);

  // малювання багатокутника через перебір вершин
  noStroke();
  beginShape();
  for (const v of vertices) {
    vertex(v.x, v.y);
  }
  endShape();

  // малювання круга
  fill(0, 150);
  ellipse(cx, cy, r * 2, r * 2);
}

// перевірка на перетин між багатокутником і кругом
function isPolyWithCircleCollides(vertices, cx, cy, r) {
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

    // перевірка колізії між кругом і лінією, утвореною між двома вершинами
    const isCollision = isLineWithCircleCollides(vc.x, vc.y, vn.x, vn.y, cx, cy, r);
    if (isCollision) return true;
  }

  // наведений вище алгоритм лише перевіряє, чи круг торкається країв багатокутника –
  // у більшості випадків цього достатньо, але ви можете розкоментувати наступний код,
  // щоб також перевірити, чи центр кола знаходиться всередині багатокутника

  // const isCenterInside = isPolygonPointCollides(vertices, cx,cy);
  // if (isCenterInside) return true;

  // у іншому випадку повертаємо false
  return false;
}

// перевірка на перетин між лінією і кругом
function isLineWithCircleCollides(x1, y1, x2, y2, cx, cy, r) {

  // якщо один з кінців всередині круга,
  // тоді одразу повертаємо true
  const inside1 = isPointWithCircleCollides(x1, y1, cx, cy, r);
  const inside2 = isPointWithCircleCollides(x2, y2, cx, cy, r);
  if (inside1 || inside2) return true;

  // отримання довжини лінії
  let distX = x1 - x2;
  let distY = y1 - y2;
  const len = sqrt((distX * distX) + (distY * distY));

  // скалярний добуток прямої та круга
  const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / pow(len, 2);

  // знаходження найближчої точки на прямій
  const closestX = x1 + (dot * (x2 - x1));
  const closestY = y1 + (dot * (y2 - y1));

  // ця точка дійсно знаходиться на відрізку?
  // якщо так, продовжуємо, але повертаємо false
  const onSegment = isLineWithPointCollides(x1, y1, x2, y2, closestX, closestY);
  if (!onSegment) return false;

  // малювання кружечка, щоб підсвітити найближчу точку на лінії (опціонально)
  fill(255, 0, 0);
  noStroke();
  ellipse(closestX, closestY, 20, 20);

  // обчислення відстані до найближчої точки
  distX = closestX - cx;
  distY = closestY - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  // чи круг має перетин з лінією?
  if (distance <= r) {
    return true;
  }

  return false;
}

// перевірка на перетин між лінією і точкою
function isLineWithPointCollides(x1, y1, x2, y2, px, py) {
  // обчислення відстані від точки до двох кінців відрізка
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);

  // обчислення довжини відрізка
  const lineLen = dist(x1, y1, x2, y2);

  // невеликий додатковий буфер для збільшення області перетину
  const buffer = 0.1;

  // якщо сума двох відстаней дорівнює довжині відрізка, тоді точка знаходиться на відрізку!
  // зауважте, що тут ми додатково використовуємо буфер для збільшення радіуса зіткнення
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }

  return false;
}

// перевірка на перетин між точкою і кругом
function isPointWithCircleCollides(px, py, cx, cy, r) {
  // отримання дистанції між точкою та центром круга
  // за допомоги теореми Піфагора
  const distX = px - cx;
  const distY = py - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша за радіус кола, значить точка всередині!
  if (distance <= r) {
    return true;
  }

  return false;
}

// перевірка на перетин між багатокутником та точкою
// потрібно, лише якщо ви збираєтеся перевірити, чи круг знаходиться ВСЕРЕДИНІ багатокутника
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
    const vc = vertices[current];// c для "current" (поточний)
    const vn = vertices[next];   // n для "next" (наступний)

    // порівняти позицію, інвертувати змінну 'isCollision'
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
      (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}
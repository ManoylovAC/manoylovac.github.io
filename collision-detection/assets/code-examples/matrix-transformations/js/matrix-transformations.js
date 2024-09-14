// MATRIX TRANSFORMATIONS
// Jeff Thompson | 2019 | jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для двох масивів, що зберігатиуть вершини квадратів
let squarePoints1;
let squarePoints2;

let angle = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();

  // ініціалізація додаткового коду для користування функцією screenPosition()
  // цей код лежить в окремому файлі, взято з https://github.com/bohnacker/p5js-screenPosition
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

  // оновлення кута для обертання
  angle += 0.02;

  // зміщення початкових координат для першого квадрата
  // у точку на 100px лівіше від центру полотна
  push();
  translate(width / 2 - 100, height / 2);
  rotate(angle);

  // перетворення чотирьох точок першого квадрата на
  // фактичні координати полотна (відносно лівого верхнього кута полотна)
  // після матричних перетворень вище (для деталей перегляньте функцію, яка це робить)
  const square1Screen = pointsToScreenCoords(squarePoints1);

  // малювання першого квадрата
  fill(0, 150);
  noStroke();
  beginShape();
  for (const pt of squarePoints1) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
  pop();

  // зміщення початкових координат для другого квадрата
  // у точку на 100px правіше від центру полотна
  push();
  translate(width - width / 2 + 100, height / 2);
  rotate(angle);

  // отримання координат відносно лівого верхньго кута полотна
  const square2Screen = pointsToScreenCoords(squarePoints2);

  // результат перевірки на зіткнення
  const isHit = isPolyWithPolyCollides(square1Screen, square2Screen);
  // при зіткненні змінюємо колір
  if (isHit) fill(255, 150, 0);
  else fill(0, 150, 255);

  // малювання другого квадрата
  beginShape();
  for (const pt of squarePoints2) {
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
  pop();
}

// функція, яка повертає фактичні координати на полотні (відносно його лівого верхнього кута)
// після матричних перетворень (наприклад, translate та rotate),
function pointsToScreenCoords(points) {
  const screenPoints = new Array(points.length);  // створення результівного масиву

  for (let i = 0; i < points.length; i++) {       // перебір усіх вершин
    const screenPoint = screenPosition(points[i].x, points[i].y);  // отримання xyz-координат відносно полотна
    screenPoints[i] = createVector(screenPoint.x, screenPoint.y);
  }

  return screenPoints;
}

// перевірка на перетин між багатокутником та багатокутником
function isPolyWithPolyCollides(p1, p2) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < p1.length; current++) {

    // отримання наступної вершини зі списку
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    next = current + 1;
    if (next === p1.length) next = 0;

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = p1[current];  // c для "current" (поточний)
    const vn = p1[next];     // n для "next" (наступний)

    // тепер ми можемо використати ці дві точки (лінію) для порівняння
    // з вершинами іншого багатокутника за допомогою isPolyWithLineCollides()
    let isCollision = isPolyWithLineCollides(p2, vc.x, vc.y, vn.x, vn.y);
    if (isCollision) return true;

    // опціонально: перевірка, чи другий багатокутник знаходиться ВСЕРЕДИНІ першого
    isCollision = isPolyWithPointCollides(p1, p2[0].x, p2[0].y);
    if (isCollision) return true;
  }

  return false;
}


// перевірка на перетин між багатокутником та лінією
function isPolyWithLineCollides(vertices, x1, y1, x2, y2) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {

    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримання векторів для поточної й наступної точки,
    // що формують ребро та витягання відповідних XY-координат
    const x3 = vertices[current].x;
    const y3 = vertices[current].y;
    const x4 = vertices[next].x;
    const y4 = vertices[next].y;

    // перевірка перетину лінії з лінією
    // якщо є, тоді одразу повертаємо 'true', щоб зупинити інші перевірки
    const isHit = isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  // якщо зіткнень не було, повертаємо 'false'
  return false;
}

// перевірка на перетин між лінією та кругом
function isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4) {
  // розрахунок напрямку ліній
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

// перевірка на перетин між багатокутником та точкою
// used only to check if the second polygon is INSIDE the first
function isPolyWithPointCollides(vertices, px, py) {
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
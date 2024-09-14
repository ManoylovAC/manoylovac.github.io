// COLLISION DETECTION: POLYGON with POLYGON
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// масиви для вершин багатокутників
const pentagon = new Array(5);
const randomPoly = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // створення вершин пʼятикутника
  const angle = TWO_PI / pentagon.length;
  for (let i = 0; i < pentagon.length; i++) {
    const a = angle * i;
    const x = width / 2 + cos(a) * 100;
    const y = height / 2 + sin(a) * 100;
    pentagon[i] = createVector(x, y);
  }

  // створення випадкових вершин для рухомого багатокутника
  let a = 0;
  let i = 0;
  while (a < 360) {
    const x = cos(radians(a)) * random(30, 50);
    const y = sin(radians(a)) * random(30, 50);
    randomPoly.push(createVector(x, y));
    a += random(15, 40);
    i += 1;
  }
}

function draw() {
  background(255);

  // оновлення положення для рухомого багатокутника
  const mouse = createVector(mouseX, mouseY);
  const diff = p5.Vector.sub(mouse, randomPoly[0]);
  for (const v of randomPoly) {
    v.add(diff);
  }

  // результат перевірки на зіткнення
  const isHit = isPolyWithPolyCollides(pentagon, randomPoly);
  // при зіткненні змінюємо колір
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малювання пʼятикутника
  noStroke();
  beginShape();
  for (const v of pentagon) {
    vertex(v.x, v.y);
  }
  endShape();

  // малювання рухомого багатокутника
  fill(0, 150);
  beginShape();
  for (const v of randomPoly) {
    vertex(v.x, v.y);
  }
  endShape();
}

// перевірка на перетин між багатокутником та багатокутником
function isPolyWithPolyCollides(p1, p2) {
  // прохід через кожну з вершин у парі з наступною вершиною списку
  let next = 0;
  for (let current = 0; current < p1.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === p1.length) next = 0;

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = p1[current];// c для "current" (поточний)
    const vn = p1[next];   // n для "next" (наступний)

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
  // прохід через кожну з вершин у парі з наступною вершиною списку
  let next = 0;
  for (let current=0; current<vertices.length; current++) {

    // отримання наступної вершини зі списку
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    next = current+1;
    if (next === vertices.length) next = 0;

    // отримуємо p5.Vector поточної й наступної вершини та беремо їх XY-координати
    const x3 = vertices[current].x;
    const y3 = vertices[current].y;
    const x4 = vertices[next].x;
    const y4 = vertices[next].y;

    // перевірка колізії між двома лініями
    // якщо є перетин, одразу повертаємо 'true'
    const isHit = isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  // якщо зіткнень не виявлено, повертаємо 'false'
  return false;
}

// перевірка на перетин між лінією та лінією
function isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4) {
  // розрахунок напрямку ліній
  const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }

  return false;
}

// перевірка на перетин між багатокутником та точкою
// використовується лише для перевірки, чи другий багатокутник знаходиться ВСЕРЕДИНІ першого
function isPolyWithPointCollides(vertices, px, py) {
  let isCollision = false;

  // прохід через кожну з вершин у парі з наступною вершиною списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {

    // отримання наступної вершини зі списку
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    next = current + 1;
    if (next === vertices.length) next = 0;

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];  // c для "current" (поточний)
    const vn = vertices[next];     // n для "next" (наступний)

    // compare position, flip 'isCollision' variable back and forth
    if (((vc.y > py && vn.y < py) || (vc.y < py && vn.y > py)) &&
      (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

// COLLISION DETECTION: POLYGON with CIRCLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// координати та радіус рухомого круга
let cx = 0;
let cy = 0;
const radius = 30;

// масив векторів вершин багатокутника
const vertices = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();

  // задаємо вершини багатокутника (тут це трапеція)
  vertices[0] = createVector(width / 2 - 100, height / 2 - 100);
  vertices[1] = createVector(width / 2 + 100, height / 2 - 100);
  vertices[2] = createVector(width / 2 + 50,  height / 2 + 100);
  vertices[3] = createVector(width / 2 - 50,  height / 2 + 100);
}

function draw() {
  background(255);

  // оновлюємо координати центра круга положенням курсора
  cx = mouseX;
  cy = mouseY;

  // перевіряємо зіткнення багатокутника та круга
  const isColliding = collidePolyCircle(vertices, cx, cy, radius);

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

  // малюємо круг
  fill(0, 150);
  ellipse(cx, cy, radius * 2, radius * 2);
}

// перевірка на зіткнення між багатокутником і кругом
function collidePolyCircle(vertices, cx, cy, radius) {
  // перебираємо всі ребра багатокутника
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

    // перевіряємо перетин круга з поточним ребром
    const isCollision = collideLineCircle(
      currVertex.x, currVertex.y,
      nextVertex.x, nextVertex.y,
      cx, cy, radius
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: щоб врахувати випадок, коли круг повністю всередині багатокутника і не торкається його сторін, розкоментуйте наступні два рядки:
  // const isCenterInside = collidePolyPoint(vertices, cx, cy);
  // if (isCenterInside) return true;

  // у іншому випадку повертаємо false
  return false;
}

// перевірка на зіткнення між лінією і кругом
function collideLineCircle(x1, y1, x2, y2, cx, cy, radius) {

  // якщо один з кінців всередині круга, тоді одразу повертаємо true
  const inside1 = collidePointCircle(x1, y1, cx, cy, radius);
  const inside2 = collidePointCircle(x2, y2, cx, cy, radius);
  if (inside1 || inside2) {
    return true;
  }

  let distX = x1 - x2;
  let distY = y1 - y2;
  const lineLen = sqrt((distX * distX) + (distY * distY));

  // скалярний добуток прямої та круга
  const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / pow(lineLen, 2);

  // знаходження найближчої точки на прямій
  const closestX = x1 + (dot * (x2 - x1));
  const closestY = y1 + (dot * (y2 - y1));

  // ця точка дійсно знаходиться на відрізку?
  // якщо так, продовжуємо, або повертаємо false
  const isOnSegment = collideLinePoint(x1, y1, x2, y2, closestX, closestY);
  if (!isOnSegment) {
    return false;
  }

  // необов’язково: малюємо маркер найближчої точки на ребрі
  fill(255, 0, 0);
  noStroke();
  ellipse(closestX, closestY, 20, 20);

  // обчислення відстані до найближчої точки
  distX = closestX - cx;
  distY = closestY - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  // чи круг має перетин з лінією?
  if (distance <= radius) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між лінією і точкою
function collideLinePoint(x1, y1, x2, y2, px, py) {
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

// перевірка на зіткнення між точкою і кругом
function collidePointCircle(px, py, cx, cy, radius) {
  // отримання дистанції між точкою та центром круга за допомоги теореми Піфагора
  const distX = px - cx;
  const distY = py - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша за радіус кола, значить точка всередині!
  if (distance <= radius) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між багатокутником та точкою (опціонально)
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

/*
  COLLISION DETECTION: LINE with CIRCLE
  Jeff Thompson | 2015 | www.jeffreythompson.org
  Via this example by Philip Nicoletti:
  http://www.codeguru.com/forum/showthread.php?threadid=194400
  ported to p5js by Manoilov Andrii 2024
*/

// координати та радіус круга
let cx = 0;
let cy = 0;
let r = 30;

// координати відрізка
let x1, y1;
let x2, y2;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(15); // збільшена жирність, щоб краще бачити лінію

  x1 = 100;
  y1 = height - 100;
  x2 = width - 100;
  y2 = 100;
}

function draw() {
  background(255);

  // оновлення координат круга координатами курсора
  cx = mouseX;
  cy = mouseY;

  // результат перевірки на зіткнення
  const isHit = isLineWithCircleCollides(x1, y1, x2, y2, cx, cy, r);

  // зміна кольору при зіткненні
  if (isHit) {
    stroke(255, 150, 0, 150);
  } else {
    stroke(0, 150, 255, 150);
  }

  // малювання лінії
  line(x1, y1, x2, y2);

  // малювання круга
  fill(0, 150);
  noStroke();
  ellipse(cx, cy, r * 2, r * 2);
}

// перевірка на перетин між лінією та кругом
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

  if (distance <= r) {
    return true;
  }

  return false;
}

// перевірка на перетин між лінією та точкою
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

// перевірка на перетин між точкою та кругом
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

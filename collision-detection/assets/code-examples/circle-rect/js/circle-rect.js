// COLLISION DETECTION: CIRCLE with RECTANGLE
// Via this example by Matt Worden:
// http://vband3d.tripod.com/visualbasic/tut_mixedcollisions.htm
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для положення та радіусу круга
let cx = 0;
let cy = 0;
let r = 30;

// змінні для положення та розмірів прямокутника
let sx;
let sy;
let sw = 200;
let sh = 200;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  // визначення положення координат для лівого верхнього кута, щоб квадрат був по центру полотна
  sx = (width - sw) / 2;
  sy = (height - sh) / 2;
}

function draw() {
  background(255);

  // оновлення координат рухомого круга координатами курсора
  cx = mouseX;
  cy = mouseY;

  // результат перевірки на зіткнення
  const isHit = isCircleWithRectCollides(cx, cy, r, sx, sy, sw, sh);

  // при зіткненні змінюємо колір заливки
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо квадрат
  rect(sx, sy, sw, sh);

  // малюємо круг
  fill(0, 150);
  ellipse(cx, cy, r * 2, r * 2);
}

// перевірка на перетин між кругом і прямокутником
function isCircleWithRectCollides(cx, cy, radius, rx, ry, rw, rh) {
  // тестові змінні точки, з якою буде відбуватися перевірка на перетин
  let testX = cx;
  let testY = cy;

  // які координати квадрата знаходяться найближче до круга?
  if (cx < rx) {
    testX = rx;       // якщо круг лівіше прямокутника
  } else if (cx > rx + rw) {
    testX = rx + rw;  // якщо круг правіше прямокутника
  }

  if (cy < ry) {
    testY = ry;       // якщо круг вище прямокутника
  } else if (cy > ry + rh) {
    testY = ry + rh;  // якщо круг нижче прямокутника
  }

  // визначення відстані до найближчої точки ребра прямокутника, якщо круг за межами прямокутника
  let distX = cx - testX;
  let distY = cy - testY;
  let distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша за радіус круга це колізія!
  if (distance <= radius) {
    return true;
  }

  return false;
}

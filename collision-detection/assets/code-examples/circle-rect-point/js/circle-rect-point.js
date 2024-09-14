// змінні для положення та радіусу круга
let cx = 0;
let cy = 0;
let r = 1;

// змінні для положення та розмірів прямокутника
let sx;
let sy;
let sw = 200;
let sh = 200;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // визначення положення координат для лівого верхнього кута, щоб квадрат був по центру полотна
  sx = (width - sw) / 2;
  sy = (height - sh) / 2;
}

function draw() {
  background(255);

  // оновлення координат рухомого круга координатами курсора
  cx = mouseX;
  cy = mouseY;

  // малюємо квадрат
  fill(0, 130, 245);
  rect(sx, sy, sw, sh);

  // малюємо точку
  const { x, y } = getClosestRectPoint(cx, cy, r, sx, sy, sw, sh);
  noStroke();
  fill('coral');
  circle(x, y, 15);
}

function getClosestRectPoint(cx, cy, radius, rx, ry, rw, rh) {
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

  return {
    x: testX,
    y: testY,
  }
}

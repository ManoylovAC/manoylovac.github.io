// COLLISION DETECTION: RECTANGLE with RECTANGLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для положення і розмірів рухомого квадрата
let s1x = 0;
let s1y = 0;
let s1w = 30;
let s1h = 30;

// змінні для положення і розмірів другого статичного квадрата
let s2x = 200;
let s2y = 100;
let s2w = 200;
let s2h = 200;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  // визначення положення координат для лівого верхнього кута другого квадрата, щоб квадрат був по центру полотна
  s2x = (width - s2w) / 2;
  s2y = (height - s2h) / 2;
}

function draw() {
  background(255);

  // оновлення координат рухомого квадрата координатами курсора
  s1x = mouseX;
  s1y = mouseY;

  // результат перевірки на зіткнення
  const isHit = isRectWithRectCollides(s1x, s1y, s1w, s1h, s2x, s2y, s2w, s2h);

  // при зіткненні змінюємо колір заливки
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо рухомий квадрат
  rect(s2x, s2y, s2w, s2h);

  // малюємо другий статичний квадрат
  fill(0, 150);
  rect(s1x, s1y, s1w, s1h);
}

// перевірка на перетин між двома прямокутниками
function isRectWithRectCollides(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // чи сторони прямокутників перетинаються між собою?
  if (
    r1x + r1w >= r2x &&  // правий край r1 правіше лівого краю r2
    r1x <= r2x + r2w &&  // лівий край r1 лівіше правого краю r2
    r1y + r1h >= r2y &&  // нижній край r1 нижче верхнього краю r2
    r1y <= r2y + r2h     // верхній край r1 вище нижнього краю r2
  ) {
    return true;
  }

  return false;
}

// перевірка на перетин між двома прямокутниками
// альтернативний підхід
function isRectWithRectCollides_intuitive(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // чи сторони прямокутників НЕ перетинаються між собою?
  if (
    r1x >= r2x + r2w ||  // лівий край r1 знаходиться за правим краєм r2
    r1x + r1w <= r2x ||  // правий край r1 знаходиться перед лівим краєм r2
    r1y >= r2y + r2h ||  // верхній край r1 знаходиться нижче нижнього краю r2
    r1y + r1h <= r2y     // нижній край r1 знаходиться вище верхнього краю r2
  ) {
    return false;
  }

  return true;
}

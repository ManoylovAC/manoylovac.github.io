// COLLISION DETECTION: POINT with RECTANGLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для положення точки, які контролюватимуться положенням курсора
let px = 0;
let py = 0;

// координати для квадрату
let sx = 200;
let sy = 100;
// змінні для ширини й висоти квадрата
let sw = 200;
let sh = 200;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  strokeWeight(15); // збільшена жирність точки, щоб краще її бачити
  // визначення положення координат для лівого верхнього кута, щоб квадрат був по центру полотна
  sx = (width - sw) / 2;
  sy = (height - sw) / 2;
}

function draw() {
  background(255);

  // оновлення координат точки координатами курсора
  px = mouseX;
  py = mouseY;

  // результат перевірки на зіткнення
  const isHit = isPointWithRectCollides(px, py, sx, sy, sw, sh);

  // при зіткненні змінюємо колір заливки
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малювання прямокутника
  noStroke();
  rect(sx, sy, sw, sh);

  // малювання точки
  stroke(0);
  point(px, py);
}

// перевірка на перетин між точкою та прямокутником
function isPointWithRectCollides(px, py, rx, ry, rw, rh) {
  // чи точка знаходиться всередині прямокутника?
  if (
       px >= rx       // точка правіше лівої сторони прямокутника
    && px <= rx + rw  // РАЗОМ З ТИМ точка лівіше правої сторони прямокутника
    && py >= ry       // РАЗОМ З ТИМ точка вище нижньої сторони прямокутника
    && py <= ry + rh  // РАЗОМ З ТИМ точка нижче верхньої сторони прямокутника
  ) {
    return true;
  }

  return false;
}

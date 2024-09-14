// COLLISION DETECTION: POINT with POINT
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для зберігання координат статичної точки
let targetX;
let targetY;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  strokeWeight(15); // збільшена жирність точки, щоб краще її бачити

  targetX = width / 2;  // визначення горизонтального центра полотна
  targetY = height / 2; // визначення вертикального центра полотна
}

function draw() {
  // результат перевірки на зіткнення, який повертає наша функція
  let isColliding = isPointWithPointCollides(mouseX, mouseY, targetX, targetY);

  // якщо є колізія, тоді змінюємо колір фону на помаранчевий...
  if (isColliding) {
    background('orange');
  } else {
    // ...якщо ні, тоді фон лишаємо білим
    background(255);
  }

  // малювання статичної точки, яку ми перевірятимемо на зіткнення
  stroke(0, 150, 255);
  point(targetX, targetY);

  // малювання другої точки, що контролюється курсором
  stroke(0, 150);
  point(mouseX, mouseY);
}

// перевірка на перетин двох точок
function isPointWithPointCollides(x1, y1, x2, y2) {
  // чи координати обох точок у спільному положенні?
  if (x1 === x2 && y1 === y2) {
    return true;
  }

  return false;
}

// COLLISION DETECTION: POINT with POINT
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// координати нерухомої цільової точки
let targetX;
let targetY;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  strokeWeight(15); // збільшуємо візуальний розмір точок для наочності

  // округлюємо до цілих пікселів на випадок непарної ширини/висоти вікна
  targetX = round(width / 2);
  targetY = round(height / 2);
}

function draw() {
  const px = round(mouseX);
  const py = round(mouseY);

  // перевіряємо, чи збігаються координати курсора з цільовою точкою
  const isColliding = collidePointPoint(px, py, targetX, targetY);

  // змінюємо колір фону залежно від результату перевірки
  if (isColliding) {
    background(255, 150, 0);
  } else {
    background(255);
  }

  // малюємо статичну цільову точку
  stroke(0, 150, 255);
  point(targetX, targetY);

  // малюємо рухому точку на місці курсора
  stroke(0, 150);
  point(px, py);
}

// перевірка на зіткнення двох точок
function collidePointPoint(x1, y1, x2, y2) {
  // чи обидві точки мають однакові координати?
  if (x1 === x2 && y1 === y2) {
    return true;
  }

  return false;
}

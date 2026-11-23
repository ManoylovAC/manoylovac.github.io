// COLLISION DETECTION: TRIANGLE with POINT
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

// координати рухомої точки
let px = 0;
let py = 0;

// координати трьох вершин трикутника
let x1, y1;
let x2, y2;
let x3, y3;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  strokeWeight(15); // збільшена товщина точки для кращої видимості

  const centerX = round(width / 2);
  x1 = centerX;
  y1 = 100;
  x2 = centerX + 150;
  y2 = height - 100;
  x3 = centerX - 150;
  y3 = height - 100;
}

function draw() {
  background(255);

  // оновлюємо координати точки положенням курсора
  px = round(mouseX);
  py = round(mouseY);

  // перевіряємо зіткнення трикутника і точки
  const isColliding = collideTriPoint(x1, y1, x2, y2, x3, y3, px, py);

  // змінюємо колір трикутника при зіткненні
  if (isColliding) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо трикутник
  noStroke();
  triangle(x1, y1, x2, y2, x3, y3);

  // малюємо точку курсора
  stroke(0, 150);
  point(px, py);
}

// перевірка на зіткнення між трикутником та точкою
function collideTriPoint(x1, y1, x2, y2, x3, y3, px, py) {
  // обчислюємо (подвоєну) площу вихідного трикутника
  const areaOrig = getTriangleArea(x1, y1, x2, y2, x3, y3);

  // обчислюємо площі трьох трикутників між точкою та кутами трикутника
  const area1 = getTriangleArea(px, py, x1, y1, x2, y2);
  const area2 = getTriangleArea(px, py, x2, y2, x3, y3);
  const area3 = getTriangleArea(px, py, x3, y3, x1, y1);

  // якщо сума трьох площ дорівнює вихідній площі — точка всередині!
  if (area1 + area2 + area3 === areaOrig) {
    return true;
  }

  return false;
}

// обчислення подвоєної площі трикутника за координатами вершин
function getTriangleArea(x1, y1, x2, y2, x3, y3) {
  return abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
}

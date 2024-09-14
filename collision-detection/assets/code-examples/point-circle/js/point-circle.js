// COLLISION DETECTION: POINT with CIRCLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для положення і радіуса круга
let circleX;
let circleY;
const circleRadius = 100;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  strokeWeight(15); // збільшена жирність точки, щоб краще її бачити

  circleX = width / 2;  // визначення горизонтального центра полотна
  circleY = height / 2; // визначення вертикального центра полотна
}

function draw() {
  background(255);

  // результат перевірки на зіткнення
  const isHit = isPointWithCircleCollides(pointX, pointY, circleX, circleY, circleRadius);

  // зміна заливки при зіткненні
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малювання круга
  noStroke();
  ellipse(circleX, circleY, circleRadius * 2, circleRadius * 2);

  // малювання точки
  stroke(0);
  point(mouseX, mouseY);
}

// перевірка на перетин між точкою та кругом
function isPointWithCircleCollides(pointX, pointY, circleX, circleY, r) {
  // отримання відстані між точкою та центром кола за допомогою теореми Піфагора
  let distX = pointX - circleX;
  let distY = pointY - circleY;
  let distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша радіуса круга, тоді точка всередині
  if (distance <= r) {
    return true;
  }

  return false;
}

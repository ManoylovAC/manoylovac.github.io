// COLLISION DETECTION: CIRCLE with CIRCLE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для положення та розміну першого рухомого круга
let circle1x = 0;
let circle1y = 0;
let circle1r = 30;

// змінні для положення та розміну другого статичного круга
let circle2x;
let circle2y;
let circle2r = 100;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  circle2x = width / 2;
  circle2y = height / 2;
}

function draw() {
  background(255);

  // оновлення координат першого круга координатами курсора
  circle1x = mouseX;
  circle1y = mouseY;

  // перевірка на зіткнення
  const isHit = isCircleWithCircleCollides(circle1x, circle1y, circle1r, circle2x, circle2y, circle2r);

  // якщо є зіткнення, змінюємо колір другого круга
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малюємо другий круг
  ellipse(circle2x, circle2y, circle2r * 2, circle2r * 2);

  // малюємо перший круг
  fill(0, 150);
  ellipse(circle1x, circle1y, circle1r * 2, circle1r * 2);
}


// перевірка на перетин між двома кругами
function isCircleWithCircleCollides(circle1x, circle1y, circle1r, circle2x, circle2y, circle2r) {
  // обчислюємо дистанцію між центрами двох кругів,
  // використовуючи теорему Піфагора
  const distX = circle1x - circle2x;
  const distY = circle1y - circle2y;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша ніж сума обох радіусів,
  // значить круги перетинаються
  if (distance <= circle1r + circle2r) {
    return true;
  }

  return false;
}



/*
  LINE with LINE
  Jeff Thompson | 2015 | www.jeffreythompson.org

  Via examples by Paul Bourke:
  http://paulbourke.net/geometry/pointlineplane

  And Ibackstrom:
  http://community.topcoder.com/tc?module=Static&d1=tutorials&d2=geometry2

  And help from aperson1792 on Reddit:
  http://www.reddit.com/r/math/comments/36dt75/what_does_this_equation_solve_for/crd5mcc

  ported to p5js by Manoilov Andrii 2024
*/

// змінні для відрізка з контрольованим кінцем
let x1 = 0;
let y1 = 0;
let x2 = 20;
let y2 = 20;

// змінні для статичного відрізка
let x3 = 100;
let y3 = 300;
let x4 = 500;
let y4 = 100;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(15); // збільшена жирність, щоб краще бачити лінії
}

function draw() {
  background(255);

  // оновлення координат кінця першого відрізка координатами курсора
  x1 = mouseX;
  y1 = mouseY;

  // результат перевірки на зіткнення
  const isHit = isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4);

  // зміна кольору при перетині
  if (isHit) {
    stroke(255, 150, 0, 150);
  } else {
    stroke(0, 150, 255, 150);
  }

  // малювання статичного відрізка
  line(x3, y3, x4, y4);

  // малювання відрізка з контрольованим кінцем
  stroke(0, 150);
  line(x1, y1, x2, y2);
}

// перевірка на перетин між лінією та кругом
function isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4) {
  // розрахунок відстані до точки перетину
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // малювання точки у місці перетину ліній (опціонально)
    const intersectionX = x1 + (uA * (x2 - x1));
    const intersectionY = y1 + (uA * (y2 - y1));
    fill(255, 0, 0);
    noStroke();
    ellipse(intersectionX, intersectionY, 20, 20);

    return true;
  }

  return false;
}

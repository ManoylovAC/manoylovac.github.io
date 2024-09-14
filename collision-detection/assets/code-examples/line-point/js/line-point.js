// COLLISION DETECTION: LINE with POINT
// Jeff Thompson | 2015 | www.jeffreythompson.org
// Via: http://stackoverflow.com/a/17693146/1167783
// ported to p5js by Manoilov Andrii 2024

// координати рухомої точки
let px = 0;
let py = 0;

// координати кінцевих точок лінії
let x1 = 100;
let y1 = 300;
let x2 = 500;
let y2 = 100;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noCursor();
  strokeWeight(15); // збільшена жирність, щоб краще бачити лінії

  x2 = width - 100;
  y1 = height - 100;
}

function draw() {
  background(255);

  // оновлення координат точки координатами курсора
  px = mouseX;
  py = mouseY;

  // результат перевірки на зіткнення
  const isHit = isLineWithPointCollides(x1, y1, x2, y2, px, py);

  // зміна кольору при зіткненні
  if (isHit) {
    stroke(255, 150, 0, 150);
  } else {
    stroke(0, 150, 255, 150);
  }

  // малювання лінії
  line(x1, y1, x2, y2);

  // малювання точки
  stroke(0, 150);
  point(px, py);
}

// перевірка на перетин між лінією та точкою
function isLineWithPointCollides(x1, y1, x2, y2, px, py) {
  // отримання відстаней від точки до двох кінців лінії
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);

  // отримання довжини лінії
  const lineLen = dist(x1, y1, x2, y2);

  // невеликий додатковий буфер для збільшення області перетину
  // це дозволить легше отримати колізію, бо не потрібне супер точне наведення
  const buffer = 0.1;

  // якщо дві відстані в сумі дорівнюють довжині лінії, тоді точка лежить на лінії
  // зауважте, що тут ми використовуємо буфер, щоб збільшити діапазон для колізії
  if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
    return true;
  }

  return false;
}



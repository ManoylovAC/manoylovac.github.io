// POLYGON with POINT
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для положення точки
let px = 0;
let py = 0;

// масив векторів p5js, по одному для кожної вершини багатокутника
let vertices = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(15); // збільшена жирність, щоб краще бачити точку
  noCursor();

  // встановлення координат вершин
  // тут ми малюємо трапецію, але ви можете створити складніші фігури
  vertices[0] = createVector(width / 2 - 100, height / 2 - 100);
  vertices[1] = createVector(width / 2 + 100, height / 2 - 100);
  vertices[2] = createVector(width / 2 + 50,  height / 2 + 100);
  vertices[3] = createVector(width / 2 - 50,  height / 2 + 100);
}

function draw() {
  background(255);

  // оновлення координат точки координатами курсора
  px = mouseX;
  py = mouseY;

  // результат перевірки на зіткнення
  const isHit = isPolyWithPointCollides(vertices, px, py);

  // при зіткненні змінюємо колір
  if (isHit) {
    fill(255, 150, 0);
  } else {
    fill(0, 150, 255);
  }

  // малювання багатокутника з beginShape() та відповідними вершинами
  noStroke();
  beginShape();
  for (const v of vertices) {
    vertex(v.x, v.y);
  }
  endShape();

  // малювання рухомої точки
  stroke(0, 150);
  point(px, py);
}

// перевірка на перетин між багатокутником та точкою
function isPolyWithPointCollides(vertices, px, py) {
  let isCollision = false;

  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];  // c для "current" (поточний)
    const vn = vertices[next];     // n для "next" (наступний)

    // здійснити перевірку та за потреби інвертувати змінну 'isCollision'
    if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
      (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}
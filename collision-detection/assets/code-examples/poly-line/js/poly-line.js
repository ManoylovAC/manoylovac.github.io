// COLLISION DETECTION: POLYGON with LINE
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінні для лінії
let x1 = 0;
let y1 = 0;
let x2 = 20;
let y2 = 20;

const verticesCount = 16; // кількість вершин
let vertices = []; // масив для векторів-вершин багатокутника

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(15);  // збільшена жирність, щоб краще бачити лінію
  noCursor();

  // основано на цьому прикладі: https://processing.org/examples/regularpolygon.html
  const angle = TWO_PI / verticesCount;

  // створення вершин у вигляді правильного багатокутника.
  for (let i = 0; i < verticesCount; i++) {
    const a = angle * i;
    const x = width / 2 + cos(a) * 100;
    const y = height / 2 + sin(a) * 100;
    vertices.push(createVector(x, y));
  }
}

function draw() {
  background(255);

  // оновлення одного з кінців лінії координатами курсора
  x1 = mouseX;
  y1 = mouseY;

  // результат перевірки на зіткнення
  const isHit = isPolyWithLineCollides(vertices, x1, y1, x2, y2);
  // при зіткненні змінюємо колір
  if (isHit) fill(255, 150, 0);
  else fill(0, 150, 255);

  // малювання багатокутника
  noStroke();
  beginShape();
  for (const v of vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // малювання лінії
  stroke(0, 150);
  line(x1, y1, x2, y2);
}

// перевірка на перетин між багатокутником та лінією
function isPolyWithLineCollides(vertices, x1, y1, x2, y2) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримання векторів для поточної й наступної точки,
    // що формують ребро та витягання відповідних XY-координат
    const x3 = vertices[current].x;
    const y3 = vertices[current].y;
    const x4 = vertices[next].x;
    const y4 = vertices[next].y;

    // перевірка перетину лінії з лінією
    // якщо є, тоді одразу повертаємо 'true', щоб зупинити інші перевірки
    const isHit = isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  // якщо зіткнень не було, повертаємо 'false'
  return false;
}

// перевірка на перетин між лінією та кругом
function isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4) {
  // розрахунок напрямку ліній
  const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true;
  }

  return false;
}

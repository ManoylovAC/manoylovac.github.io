// OBJECT-ORIENTED COLLISION
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

// змінна для обʼєкту круга, що контролюватиметься курсором
let circle;
// масив прямокутників
let rects = new Array(8);

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // створення круга з радіусом у 30 пікселів
  circle = new Circle(0, 0, 30);

  // генерація прямокутників у випадкових місцях, але з привʼязкою до сітки у 50 пікселів
  for (let i = 0; i < rects.length; i++) {
    const x = round(random(50, width - 50) / 50) * 50;
    const y = round(random(50, height - 50) / 50) * 50;
    rects[i] = new Rectangle(x, y, 50, 50);
  }
}

function draw() {
  background(255);

  // перебір усіх прямокутників
  for (const rectangle of rects) {
    rectangle.checkCollisionWithCircle(circle);  // перевірка на колізію
    rectangle.display();                         // малювання прямокутника
  }

  // оновлення положення круга положенням курсора і його зображення
  circle.update(mouseX, mouseY);
  circle.display();
}

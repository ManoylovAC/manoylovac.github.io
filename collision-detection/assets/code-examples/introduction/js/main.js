// COLLISION DETECTION: INTRODUCTION
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5.js by Andrii Manoilov | 2024

const numEach = 50;
const circleRadius = 30;

// масиви для різних фігур
const lines = [];
const circles = [];
const rectangles = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  // створення кругів
  for (let i = 0; i < numEach; i++) {
    const newCircle = new Circle(random(width), random(-height, height));

    circles.push(newCircle);
  }

  // створення прямокутників
  for (let i = 0; i < numEach; i++) {
    const newRectangle = new Rectangle(random(width), random(-height, height));

    rectangles.push(newRectangle);
  }

  // створення ліній
  for (let i = 0; i < numEach; i++) {
    const x = random(width);
    const y = random(-height, height);
    const newLine = new Line(x, y, x + random(-20, 20), y + random(-20, 20));

    lines.push(newLine);
  }

  // створення полігонів
  //  for (let i = 0; i < 30; i++) {
  //    const newPolygon = new Polygon(random(width), random(-height,height));
  //    polygons.push(newPolygon);
  //  }
}

function draw() {
  background(255);

  // малювання круга курсора, який перевіряється на зіткнення з іншими фігурами
  fill(0, 150);
  noStroke();
  ellipse(mouseX, mouseY, circleRadius * 2, circleRadius * 2);

  // оновлення та малювання кругів
  for (let i = 0; i < circles.length; i++) {
    const currentCircle = circles[i];
    currentCircle.update(mouseX, mouseY, circleRadius);
    currentCircle.display();

    if (currentCircle.y > height + 50) {
      circles[i] = new Circle(random(width), random(-height, -50));
    }
  }

  // оновлення та малювання прямокутників
  for (let i = 0; i < rectangles.length; i++) {
    const currentRect = rectangles[i];
    currentRect.update(mouseX, mouseY, circleRadius);
    currentRect.display();

    if (currentRect.y > height + 50) {
      rectangles[i] = new Rectangle(random(width), random(-height, -50));
    }
  }

  // оновлення та малювання ліній
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    currentLine.update(mouseX, mouseY, circleRadius);
    currentLine.display();

    if (currentLine.y1 > height + 50 && currentLine.y2 > height + 50) {
      const x = random(width);
      const y = random(-height, -50);
      lines[i] = new Line(x, y, x + random(-20, 20), y + random(-20, 20));
    }
  }
}

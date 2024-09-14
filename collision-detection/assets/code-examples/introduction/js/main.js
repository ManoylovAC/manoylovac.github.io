// COLLISION DETECTION: INTRODUCTION
// Jeff Thompson | 2015 | www.jeffreythompson.org
// ported to p5js by Manoilov Andrii 2024

const numEach = 50;
const circleRadius = 30;

// масиви для купи різних обʼєктів!
let lines = [];
let circles = [];
let rectangles = [];
// let polygons = [];

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

  // малювання круга який перевіряється на зіткнення з іншими фігурами
  fill(0, 150);
  noStroke();
  ellipse(mouseX, mouseY, circleRadius * 2, circleRadius * 2);

  // перебір малювання інших фігур: кругів, прямокутників, ліній
  for (let i = circles.length - 1; i >= 0; --i) {
    const currentCircle = circles[i];
    currentCircle.update(mouseX, mouseY, circleRadius);
    currentCircle.display();

    if (currentCircle.y > height + 50) {
      circles = circles.filter(crl => crl !== currentCircle);
      circles.push(new Circle(random(width), random(-height, -50)));
    }
  }

  for (let i = rectangles.length - 1; i >= 0; --i) {
    const currentRect = rectangles[i];
    currentRect.update(mouseX, mouseY, circleRadius);
    currentRect.display();

    if (currentRect.y > height + 50) {
      rectangles = rectangles.filter(rct => rct !== currentRect);
      rectangles.push(new Rectangle(random(width), random(-height, -50)));
    }
  }

for (let i = lines.length - 1; i >= 0; --i) {
    const currentLine = lines[i];
    currentLine.update(mouseX, mouseY, circleRadius);
    currentLine.display();

    if (currentLine.y1 > height + 50 && currentLine.y2 > height + 50) {
      lines = lines.filter(ln => ln !== currentLine);
      const x = random(width);
      const y = random(-height, -50);
      lines.push(new Line(x, y, x + random(-20, 20), y + random(-20, 20)));
    }
  }
}

class Circle {
  constructor(x, y) {
    this.x = x; // x-координата
    this.y = y; // y-координата
    this.r = random(8, 20); // радіус
    this.speed = random(0.5, 2);
    this.isHit = false;
  }

  update(cx, cy, cr) {
    this.y += this.speed;
    this.isHit = isCircleWithCircleCollides(this.x, this.y, this.r, cx, cy, cr);
  }

  display() {
    if (this.isHit) {
      fill(255, 150, 0, 150);
    } else {
      fill(0, 150, 255, 150);
    }

    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}



class Circle {
  constructor(x, y, r) {
    this.x = x; // x-координата
    this.y = y; // y-координата
    this.r = r; // радіус
  }

  update(x, y) {
    this.x = x;
    this.y = y;
  }

  // малювання круга
  display() {
    fill(0, 150);
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}

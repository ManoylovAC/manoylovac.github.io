class Rectangle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = random(8, 20);
    this.h = random(8, 20);
    this.speed = random(0.5, 2);
    this.isHit = false;
  }

  update(cx, cy, cr) {
    this.y += this.speed;
    this.isHit = isCircleWithRectCollides(cx, cy, cr, this.x, this.y, this.w, this.h);
  }

  display() {
    if (this.isHit) {
      fill(255, 150, 0, 150);
    } else {
      fill(0, 150, 255, 150);
    }

    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}



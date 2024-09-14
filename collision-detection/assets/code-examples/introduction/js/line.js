class Line {
  constructor(_x1, _y1, _x2, _y2) {
    this.x1 = _x1;
    this.y1 = _y1;
    this.x2 = _x2;
    this.y2 = _y2;
    this.speed = random(0.5, 2);
    this.isHit = false;
  }

  update(cx, cy, cr) {
    this.y1 += this.speed;
    this.y2 += this.speed;
    this.isHit = isLineWithCircleCollides(this.x1, this.y1, this.x2, this.y2, cx, cy, cr);
  }

  display() {
    if (this.isHit) {
      stroke(255, 150, 0, 150);
    } else {
      stroke(0, 150, 255, 150);
    }

    strokeWeight(5);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

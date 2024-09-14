class Rectangle {
  constructor(x, y, w, h) {
    this.x = x; // x-координата лівого кута
    this.y = y; // y-координата лівого кута
    this.w = w; // ширина
    this.h = h; // висота
    this.isHit = false; // чи є зіткнення
  }

  // перевірка на зіткнення з кругом
  // використовуючи функцію isCircleWithRectCollides, яку ми зробили на початку
  checkCollisionWithCircle(circleObj) {
    this.isHit = isCircleWithRectCollides(circleObj.x, circleObj.y, circleObj.r, this.x, this.y, this.w, this.h);
  }

  // малювання прямокутника
  display() {
    // при зіткненні змінюємо колір
    if (this.isHit) {
      fill(255, 150, 0);
    } else {
      fill(0, 150, 255);
    }
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

// перевірка на перетин між кругом і кругом
function isCircleWithCircleCollides(c1x, c1y, c1r, c2x, c2y, c2r) {
  // обчислюємо дистанцію між центрами двох кругів,
  // використовуючи теорему Піфагора
  const distX = c1x - c2x;
  const distY = c1y - c2y;
  const distance = sqrt( (distX*distX) + (distY*distY) );

  // якщо відстань менша ніж сума обох радіусів,
  // значить круги перетинаються
  return distance <= c1r + c2r;
}

// перевірка на перетин між лінією і кругом
function isLineWithCircleCollides(x1, y1, x2, y2, cx, cy, r) {
  // якщо один з кінців всередині круга,
  // тоді одразу повертаємо true
  let isInside = isPointWithCircleCollides(x1,y1, cx,cy,r);
  if (isInside) return true;

  isInside = isPointWithCircleCollides(x2,y2, cx,cy,r);
  if (isInside) return true;
  
  // отримання довжини лінії
  let distX = x1 - x2;
  let distY = y1 - y2;
  const len = sqrt( (distX*distX) + (distY*distY) );

  // скалярний добуток прямої та круга
  const dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / pow(len,2);

  // знаходження найближчої точки на прямій
  const closestX = x1 + (dot * (x2-x1));
  const closestY = y1 + (dot * (y2-y1));
  
  // ця точка дійсно знаходиться на відрізку?
  // якщо так, продовжуємо, але повертаємо false
  const onSegment = isLineWithPointCollides(x1,y1,x2,y2, closestX,closestY);
  if (!onSegment) {
    return false;
  }

  // обчислення відстані до найближчої точки
  distX = closestX - cx;
  distY = closestY - cy;
  const distance = sqrt( (distX*distX) + (distY*distY) );

  return distance <= r;
}

// перевірка на перетин між точкою і кругом
function isPointWithCircleCollides(px, py, cx, cy, r) {
  // отримання дистанції між точкою та центром круга
  // за допомоги теореми Піфагора
  const distX = px - cx;
  const distY = py - cy;
  const distance = sqrt( (distX*distX) + (distY*distY) );

  // якщо відстань менша за радіус кола, значить точка всередині!
  return distance <= r;
}

// перевірка на перетин між лінією і точкою
function isLineWithPointCollides(x1, y1, x2, y2, px, py) {
  // обчислення відстані від точки до двох кінців відрізка
  const d1 = dist(px,py, x1,y1);
  const d2 = dist(px,py, x2,y2);
  
  // обчислення довжини відрізка
  const lineLen = dist(x1,y1, x2,y2);
  
  // невеликий додатковий буфер для збільшення області перетину
  const buffer = 5;
  
  // якщо сума двох відстаней дорівнює довжині відрізка, тоді точка знаходиться на відрізку!
  // зауважте, що тут ми додатково використовуємо буфер для збільшення радіуса зіткнення
  return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
}

// перевірка на перетин між кругом і прямокутником
function isCircleWithRectCollides(cx, cy, radius, rx, ry, rw, rh) {
  // тестові змінні точки, з якою буде відбуватися перевірка на перетин
  let testX = cx;
  let testY = cy;

  // які координати квадрата знаходяться найближче до круга?
  if (cx < rx)         testX = rx;        // compare to left edge
  else if (cx > rx+rw) testX = rx+rw;     // right edge
  if (cy < ry)         testY = ry;        // top edge
  else if (cy > ry+rh) testY = ry+rh;     // bottom edge
  
  // визначення відстані до найближчої точки ребра прямокутника
  const distX = cx-testX;
  const distY = cy-testY;
  const distance = sqrt( (distX*distX) + (distY*distY) );

  // якщо відстань менша за радіус круга це колізія!
  return distance <= radius;
}

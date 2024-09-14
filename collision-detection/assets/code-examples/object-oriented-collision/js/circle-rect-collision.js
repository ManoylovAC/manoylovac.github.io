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

  // визначення відстані до найближчої точки ребра прямокутника, якщо круг за межами прямокутника
  const distX = cx-testX;
  const distY = cy-testY;
  const distance = sqrt((distX*distX) + (distY*distY));

  // якщо відстань менша за радіус круга це колізія!
  return distance <= radius;
}

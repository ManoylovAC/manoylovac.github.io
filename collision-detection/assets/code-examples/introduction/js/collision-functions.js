// перевірка на зіткнення між двома кругами
function collideCircleCircle(c1x, c1y, c1r, c2x, c2y, c2r) {
  const distX = c1x - c2x;
  const distY = c1y - c2y;
  const distance = sqrt((distX * distX) + (distY * distY));

  return distance <= c1r + c2r;
}

// перевірка на зіткнення між лінією і кругом
function collideLineCircle(x1, y1, x2, y2, cx, cy, radius) {
  const inside1 = collidePointCircle(x1, y1, cx, cy, radius);
  if (inside1) return true;

  const inside2 = collidePointCircle(x2, y2, cx, cy, radius);
  if (inside2) return true;

  let distX = x1 - x2;
  let distY = y1 - y2;
  const lineLen = sqrt((distX * distX) + (distY * distY));
  if (lineLen === 0) return false;

  const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / pow(lineLen, 2);

  const closestX = x1 + (dot * (x2 - x1));
  const closestY = y1 + (dot * (y2 - y1));

  const isOnSegment = collideLinePoint(x1, y1, x2, y2, closestX, closestY);
  if (!isOnSegment) {
    return false;
  }

  distX = closestX - cx;
  distY = closestY - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  return distance <= radius;
}

// перевірка на зіткнення між точкою і кругом
function collidePointCircle(px, py, cx, cy, radius) {
  const distX = px - cx;
  const distY = py - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  return distance <= radius;
}

// перевірка на зіткнення між лінією і точкою
function collideLinePoint(x1, y1, x2, y2, px, py) {
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);
  const lineLen = dist(x1, y1, x2, y2);
  // невеликий додатковий буфер для збільшення області перетину
  const buffer = 5;

  return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
}

// перевірка на зіткнення між кругом і прямокутником
function collideCircleRect(cx, cy, radius, rx, ry, rw, rh) {
  let testX = cx;
  let testY = cy;

  if (cx < rx)         testX = rx;      // лівий край
  else if (cx > rx+rw) testX = rx + rw; // правий край
  if (cy < ry)         testY = ry;      // верхній край
  else if (cy > ry+rh) testY = ry + rh; // нижній край

  const distX = cx - testX;
  const distY = cy - testY;
  const distance = sqrt((distX * distX) + (distY * distY));

  return distance <= radius;
}

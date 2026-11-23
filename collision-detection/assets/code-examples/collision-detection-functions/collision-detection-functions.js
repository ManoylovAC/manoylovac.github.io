/*
COLLISION-DETECTION FUNCTIONS
Jeff Thompson | 2015 | www.jeffreythompson.org
ported to p5.js by Andrii Manoilov | 2024

Повний набір функцій виявлення зіткнень.
Кожна функція повертає логічне значення true/false,
яке повідомляє, чи перетинаються дві фігури.

НАБІР ФУНКЦІЙ:
+  collideCircleCircle()
+  collideCircleRect()
+  collideLineCircle()
+  collideLineLine()
+  collideLinePoint()
+  collideLineRect()
+  collidePointCircle()
+  collidePointPoint()
+  collidePointRect()
+  collidePolyCircle()
+  collidePolyLine()
+  collidePolyPoint()
+  collidePolyRect()
+  collidePolyPoly()
+  collideRectRect()
+  collideTriPoint()

Аргументи та пояснення дивіться у самих функціях нижче або
на відповідних сторінках онлайн-посібника.
*/

// перевірка на зіткнення між двома кругами
function collideCircleCircle(c1x, c1y, c1r, c2x, c2y, c2r) {
  // знаходимо відстань між центрами двох кругів за теоремою Піфагора
  const distX = c1x - c2x;
  const distY = c1y - c2y;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань не перевищує суму двох радіусів — круги перетинаються
  return distance <= c1r + c2r;
}

// перевірка на зіткнення між кругом і прямокутником
function collideCircleRect(cx, cy, radius, rx, ry, rw, rh) {
  // координати найближчої до круга точки прямокутника
  let testX = cx;
  let testY = cy;

  // який край прямокутника найближчий за віссю x?
  if (cx < rx) {
    testX = rx;          // лівий край
  } else if (cx > rx + rw) {
    testX = rx + rw;     // правий край
  }

  // який край прямокутника найближчий за віссю y?
  if (cy < ry) {
    testY = ry;          // верхній край
  } else if (cy > ry + rh) {
    testY = ry + rh;     // нижній край
  }

  // обчислюємо відстань від центра круга до знайденої точки прямокутника
  const distX = cx - testX;
  const distY = cy - testY;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань не перевищує радіус круга — зіткнення відбулося!
  return distance <= radius;
}

// перевірка на зіткнення між лінією і кругом
function collideLineCircle(x1, y1, x2, y2, cx, cy, radius) {
  // якщо хоча б один кінець відрізка всередині круга — одразу повертаємо true
  const inside1 = collidePointCircle(x1, y1, cx, cy, radius);
  const inside2 = collidePointCircle(x2, y2, cx, cy, radius);
  if (inside1 || inside2) {
    return true;
  }

  // обчислюємо довжину відрізка
  let distX = x1 - x2;
  let distY = y1 - y2;
  const lineLen = sqrt((distX * distX) + (distY * distY));

  // знаходимо нормалізований скалярний добуток (проєкцію центра круга на пряму)
  const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / pow(lineLen, 2);

  // обчислюємо координати найближчої точки на прямій
  const closestX = x1 + (dot * (x2 - x1));
  const closestY = y1 + (dot * (y2 - y1));

  // перевіряємо, чи лежить ця точка в межах самого відрізка
  const isOnSegment = collideLinePoint(x1, y1, x2, y2, closestX, closestY);
  if (!isOnSegment) {
    return false;
  }

  // обчислюємо відстань від центра круга до найближчої точки відрізка
  distX = closestX - cx;
  distY = closestY - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  return distance <= radius;
}

// перевірка на перетин між двома відрізками
function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  // обчислюємо параметричне положення точки перетину на обох відрізках
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB лежать у межах від 0 до 1 — відрізки перетинаються
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // необов’язково: малювання маркера в точці перетину
    const intersectionX = x1 + (uA * (x2 - x1));
    const intersectionY = y1 + (uA * (y2 - y1));
    fill(255, 0, 0);
    noStroke();
    ellipse(intersectionX, intersectionY, 20, 20);

    return true;
  }

  return false;
}

// перевірка на зіткнення між лінією і точкою
function collideLinePoint(x1, y1, x2, y2, px, py) {
  // відстані від точки до двох кінців відрізка
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);

  // повна довжина відрізка
  const lineLen = dist(x1, y1, x2, y2);

  // невеликий допуск (буфер) для компенсації похибки округлення
  const buffer = 5;

  // якщо сума двох відстаней майже дорівнює довжині відрізка — точка на лінії!
  // зауважте, що тут додатково використовується буфер для збільшення радіуса зіткнення
  return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
}

// перевірка на зіткнення між лінією та прямокутником
function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  // перевіряємо перетин лінії з кожною із чотирьох сторін прямокутника
  const collidesLeft   = collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  const collidesRight  = collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  const collidesTop    = collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  const collidesBottom = collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  // якщо перетнуто будь-яку сторону — лінія перетинає прямокутник
  return collidesLeft || collidesRight || collidesTop || collidesBottom;
}

// перевірка на зіткнення між точкою і кругом
function collidePointCircle(px, py, cx, cy, radius) {
  // обчислюємо відстань між точкою та центром круга за теоремою Піфагора
  const distX = px - cx;
  const distY = py - cy;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань не перевищує радіус круга — точка всередині!
  return distance <= radius;
}

// перевірка на зіткнення двох точок
function collidePointPoint(x1, y1, x2, y2) {
  // чи обидві точки мають однакові координати?
  return x1 === x2 && y1 === y2;
}

// перевірка на зіткнення між точкою та прямокутником
function collidePointRect(px, py, rx, ry, rw, rh) {
  // чи лежить точка в межах усіх чотирьох сторін прямокутника?
  return (
    px >= rx &&      // праворуч від лівого краю
    px <= rx + rw && // І ліворуч від правого краю
    py >= ry &&      // І нижче від верхнього краю
    py <= ry + rh    // І вище від нижнього краю
  );
}

// перевірка на зіткнення між багатокутником і кругом
function collidePolyCircle(vertices, cx, cy, radius) {
  // перебираємо всі ребра багатокутника
  let next = 0;
  
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    // перевіряємо перетин круга з поточним ребром
    const isCollision = collideLineCircle(
      currVertex.x, currVertex.y,
      nextVertex.x, nextVertex.y,
      cx, cy, radius
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: перевіряємо, чи центр круга всередині багатокутника
  // const isCenterInside = collidePolyPoint(vertices, cx, cy);
  // if (isCenterInside) return true;

  return false;
}

// перевірка на зіткнення між багатокутником та лінією
function collidePolyLine(vertices, x1, y1, x2, y2) {
  // перебираємо всі ребра багатокутника
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    const x3 = currVertex.x;
    const y3 = currVertex.y;
    const x4 = nextVertex.x;
    const y4 = nextVertex.y;

    // перевіряємо перетин лінії з поточним ребром
    const isHit = collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  // якщо зіткнень не було, повертаємо 'false'
  return false;
}

// перевірка на зіткнення між багатокутником та точкою
function collidePolyPoint(vertices, px, py) {
  let isCollision = false;

  // перебираємо всі ребра багатокутника
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    // алгоритм променя (Ray Casting): інвертуємо прапорець при перетині ребра
    if (
      ((currVertex.y >= py && nextVertex.y < py) || (currVertex.y < py && nextVertex.y >= py)) &&
      (px < (nextVertex.x - currVertex.x) * (py - currVertex.y) / (nextVertex.y - currVertex.y) + currVertex.x)
    ) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

// перевірка на зіткнення між двома багатокутниками
function collidePolyPoly(p1, p2) {
  // перебираємо всі ребра першого багатокутника
  let next = 0;
  for (let current = 0; current < p1.length; current++) {
    next = current + 1;
    if (next === p1.length) {
      next = 0;
    }

    const currVertex = p1[current];
    const nextVertex = p1[next];

    // перевіряємо, чи поточне ребро p1 перетинає багатокутник p2
    const isCollision = collidePolyLine(
      p2,
      currVertex.x, currVertex.y,
      nextVertex.x, nextVertex.y
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: перевіряємо, чи один багатокутник повністю всередині іншого
  const isInside = collidePolyPoint(p1, p2[0].x, p2[0].y);
  if (isInside) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між багатокутником і прямокутником
function collidePolyRect(vertices, rx, ry, rw, rh) {
  // перебираємо всі ребра багатокутника
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    next = current + 1;
    if (next === vertices.length) {
      next = 0;
    }

    const currVertex = vertices[current];
    const nextVertex = vertices[next];

    // перевіряємо перетин ребра з усіма чотирма сторонами прямокутника
    const isCollision = collideLineRect(
      currVertex.x, currVertex.y,
      nextVertex.x, nextVertex.y,
      rx, ry, rw, rh
    );
    if (isCollision) {
      return true;
    }
  }

  // необов’язково: перевіряємо, чи прямокутник повністю всередині багатокутника
  // зауважте, що це повторює перебір усіх сторін багатокутника знову,
  // тому використовуйте це лише, якщо вам потрібно
  const isInside = collidePolyPoint(vertices, rx, ry);
  if (isInside) {
    return true;
  }

  return false;
}

// перевірка на зіткнення між двома прямокутниками
function collideRectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // чи перекриваються проєкції прямокутників за осями x та y?
  return (
    r1x + r1w >= r2x && // правий край r1 праворуч від лівого краю r2
    r1x <= r2x + r2w && // лівий край r1 ліворуч від правого краю r2
    r1y + r1h >= r2y && // нижній край r1 нижче від верхнього краю r2
    r1y <= r2y + r2h    // верхній край r1 вище від нижнього краю r2
  );
}

// перевірка на зіткнення між двома прямокутниками (альтернативний підхід від супротивного)
function collideRectRectIntuitive(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // чи прямокутники НЕ перетинаються між собою?
  return !(
    r1x > r2x + r2w || // r1 повністю праворуч від r2
    r1x + r1w < r2x || // r1 повністю ліворуч від r2
    r1y > r2y + r2h || // r1 повністю нижче від r2
    r1y + r1h < r2y    // r1 повністю вище від r2
  );
}

// обчислення подвоєної площі трикутника за координатами вершин
function getTriangleArea(x1, y1, x2, y2, x3, y3) {
  return abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
}

// перевірка на зіткнення між трикутником та точкою
function collideTriPoint(x1, y1, x2, y2, x3, y3, px, py) {
  // обчислюємо площу вихідного трикутника
  const areaOrig = getTriangleArea(x1, y1, x2, y2, x3, y3);

  // обчислюємо площі трьох трикутників між точкою та кутами трикутника
  const area1 = getTriangleArea(px, py, x1, y1, x2, y2);
  const area2 = getTriangleArea(px, py, x2, y2, x3, y3);
  const area3 = getTriangleArea(px, py, x3, y3, x1, y1);

  // якщо сума трьох площ дорівнює площі вихідного трикутника — точка всередині!
  return area1 + area2 + area3 === areaOrig;
}

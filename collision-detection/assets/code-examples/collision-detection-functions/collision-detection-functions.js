/*
COLLISION-DETECTION FUNCTIONS
Jeff Thompson | 2015 | www.jeffreythompson.org
ported to p5js by Manoilov Andrii 2024

Повний набір функцій виявлення зіткнень.
Кожна функція повертає логічне значення true/false,
що повідомляє чи перетинаються дві фігури чи ні.

НАБІР
+  isCircleWithCircleCollides()
+  isCircleWithRectCollides()
+  isLineWithCircleCollides()
+  isLineWithLineCollides()
+  isLineWithPointCollides()
+  isLineWithRectCollides()
+  isPointWithCircleCollides()
+  isPointWithPointCollides()
+  isPointWithRectCollides()
+  isPolyWithCircleCollides()
+  isPolyWithLineCollides()
+  isPolyWithPointCollides()
+  isPolyWithRectCollides()
+  isPolyWithPolyCollides()
+  isRectWithRectCollides()
+  isTriWithPointCollides()

Аргументи та пояснення дивіться у самих функціях нижче або
на сторінках книжки з прикладами кожної функції.
*/

// перевірка на перетин між кругом і кругом
function isCircleWithCircleCollides(c1x, c1y, c1r, c2x, c2y, c2r) {
  // обчислюємо дистанцію між центрами двох кругів,
  // використовуючи теорему Піфагора
  const distX = c1x - c2x;
  const distY = c1y - c2y;
  const distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша ніж сума обох радіусів,
  // значить круги перетинаються
  return distance <= c1r + c2r;
}

// перевірка на перетин між кругом і прямокутником
function isCircleWithRectCollides(cx, cy, radius, rx, ry, rw, rh) {
  // тестові змінні точки, з якою буде відбуватися перевірка на перетин
  let testX = cx;
  let testY = cy;

  // які координати квадрата знаходяться найближче до круга?
  if (cx < rx) {
    testX = rx;       // якщо круг лівіше прямокутника
  } else if (cx > rx + rw) {
    testX = rx + rw;  // якщо круг правіше прямокутника
  }

  if (cy < ry) {
    testY = ry;       // якщо круг вище прямокутника
  } else if (cy > ry + rh) {
    testY = ry + rh;  // якщо круг нижче прямокутника
  }

  // визначення відстані до найближчої точки ребра прямокутника, якщо круг за межами прямокутника
  let distX = cx - testX;
  let distY = cy - testY;
  let distance = sqrt((distX * distX) + (distY * distY));

  // якщо відстань менша за радіус круга це колізія!
  return distance <= radius;
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

// перевірка на перетин між лінією та кругом
function isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4) {
  // розрахунок відстані до точки перетину
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // якщо uA та uB мають значення між 0 та 1, тоді лінії мають перетин
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    // малювання точки у місці перетину ліній (опціонально)
    const intersectionX = x1 + (uA * (x2 - x1));
    const intersectionY = y1 + (uA * (y2 - y1));
    fill(255, 0, 0);
    noStroke();
    ellipse(intersectionX, intersectionY, 20, 20);

    return true;
  }

  return false;
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

// перевірка на перетин між лінією та прямокутником
function isLineWithRectCollides(x1, y1, x2, y2, rx, ry, rw, rh) {
  // перевірка, чи лінія торкнулася будь-якої сторони прямокутника
  const left   = isLineWithLineCollides(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  const right  = isLineWithLineCollides(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  const top    = isLineWithLineCollides(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  const bottom = isLineWithLineCollides(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  // якщо БУДЬ-ЩО з наведеного вище вірно, значить лінія має перетин з прямокутником
  return left || right || top || bottom;
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

// перевірка на перетин двох точок
function isPointWithPointCollides(x1, y1, x2, y2) {
  // чи координати обох точок у спільному положенні?
  return x1 === x2 && y1 === y2;
}

// перевірка на перетин між точкою та прямокутником
function isPointWithRectCollides(px, py, rx, ry, rw, rh) {
  // чи точка знаходиться всередині прямокутника?
  return (
    px >= rx          // точка правіше лівої сторони прямокутника
    && px <= rx + rw  // РАЗОМ З ТИМ точка лівіше правої сторони прямокутника
    && py >= ry       // РАЗОМ З ТИМ точка вище нижньої сторони прямокутника
    && py <= ry + rh  // РАЗОМ З ТИМ точка нижче верхньої сторони прямокутника
  )
}

// перевірка на перетин між багатокутником і кругом
function isPolyWithCircleCollides(vertices, cx, cy, r) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];  // c для "current" (поточний)
    const vn = vertices[next];     // n для "next" (наступний)

    // перевірка колізії між кругом і лінією, утвореною між двома вершинами
    const isCollision = isLineWithCircleCollides(vc.x, vc.y, vn.x, vn.y, cx, cy, r);
    if (isCollision) return true;
  }

  // наведений вище алгоритм лише перевіряє, чи круг торкається країв багатокутника –
  // у більшості випадків цього достатньо, але ви можете розкоментувати наступний код,
  // щоб також перевірити, чи центр кола знаходиться всередині багатокутника

  // const isCenterInside = isPolygonPointCollides(vertices, cx,cy);
  // if (isCenterInside) return true;

  // у іншому випадку повертаємо false
  return false;
}

// перевірка на перетин між багатокутником та лінією
function isPolyWithLineCollides(vertices, x1, y1, x2, y2) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримання векторів для поточної й наступної точки,
    // що формують ребро та витягання відповідних XY-координат
    const x3 = vertices[current].x;
    const y3 = vertices[current].y;
    const x4 = vertices[next].x;
    const y4 = vertices[next].y;

    // перевірка перетину лінії з лінією
    // якщо є, тоді одразу повертаємо 'true', щоб зупинити інші перевірки
    const isHit = isLineWithLineCollides(x1, y1, x2, y2, x3, y3, x4, y4);
    if (isHit) {
      return true;
    }
  }

  // якщо зіткнень не було, повертаємо 'false'
  return false;
}

// перевірка на перетин між багатокутником та точкою
function isPolyWithPointCollides(vertices, px, py) {
  let isCollision = false;

  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];  // c для "current" (поточний)
    const vn = vertices[next];     // n для "next" (наступний)

    // здійснити перевірку та за потреби інвертувати змінну 'isCollision'
    if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
      (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
      isCollision = !isCollision;
    }
  }

  return isCollision;
}

// перевірка на перетин між багатокутником та багатокутником
function isPolyWithPolyCollides(p1, p2) {
  // прохід через кожну з вершин у парі з наступною вершиною списку
  let next = 0;
  for (let current = 0; current < p1.length; current++) {
    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === p1.length) next = 0;

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = p1[current];// c для "current" (поточний)
    const vn = p1[next];   // n для "next" (наступний)

    // тепер ми можемо використати ці дві точки (лінію) для порівняння
    // з вершинами іншого багатокутника за допомогою isPolyWithLineCollides()
    let isCollision = isPolyWithLineCollides(p2, vc.x, vc.y, vn.x, vn.y);
    if (isCollision) return true;

    // опціонально: перевірка, чи другий багатокутник знаходиться ВСЕРЕДИНІ першого
    isCollision = isPolyWithPointCollides(p1, p2[0].x, p2[0].y);
    if (isCollision) return true;
  }

  return false;
}

// перевірка на перетин між багатокутником і прямокутником
function isPolyWithRectCollides(vertices, rx, ry, rw, rh) {
  // перебір кожної вершини з використанням наступної вершини в списку
  let next = 0;
  for (let current = 0; current < vertices.length; current++) {

    // отримання наступної вершини зі списку
    next = current + 1;
    // коли дійшли до останньої вершини, беремо першу під індексом 0
    if (next === vertices.length) {
      next = 0;
    }

    // отримуємо p5.Vector у нашій поточній позиції
    // це зробить наш оператор if трохи чистішим
    const vc = vertices[current];// c для "current" (поточний)
    const vn = vertices[next];   // n для "next" (наступний)

    // перевіряємо всі чотири сторони прямокутника
    const isCollision = isLineWithRectCollides(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
    if (isCollision) return true;

    // необов’язково: перевірка на те, чи прямокутник знаходиться ВСЕРЕДИНІ багатокутника,
    // зауважте, що це повторює перебір усіх сторін багатокутника знову,
    // тому використовуйте це лише, якщо вам потрібно
    const isInside = isPolygonPointCollides(vertices, rx, ry);
    if (isInside) return true;
  }

  return false;
}

// перевірка на перетин між двома прямокутниками
function isRectWithRectCollides(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // чи сторони прямокутників перетинаються між собою?
  return (
    r1x + r1w >= r2x &&  // правий край r1 правіше лівого краю r2
    r1x <= r2x + r2w &&  // лівий край r1 лівіше правого краю r2
    r1y + r1h >= r2y &&  // нижній край r1 нижче верхнього краю r2
    r1y <= r2y + r2h     // верхній край r1 вище нижнього краю r2
  );
}

// перевірка на перетин між двома прямокутниками
// альтернативний підхід
function isRectWithRectCollides_intuitive(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
  // чи сторони прямокутників НЕ перетинаються між собою?
  return !(
    r1x >= r2x + r2w ||  // лівий край r1 знаходиться за правим краєм r2
    r1x + r1w <= r2x ||  // правий край r1 знаходиться перед лівим краєм r2
    r1y >= r2y + r2h ||  // верхній край r1 знаходиться нижче нижнього краю r2
    r1y + r1h <= r2y     // нижній край r1 знаходиться вище верхнього краю r2
  );
}

// обчислення площі трикутника
function getTriangleArea(x1, y1, x2, y2, x3, y3) {
  return abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
}

// перевірка на перетин між точкою та трикутником
function isTriWithPointCollides(x1, y1, x2, y2, x3, y3, px, py) {
  // обчислення площі трикутника
  const areaOrig = getTriangleArea(x1, y1, x2, y2, x3, y3);

  // обчислення площі 3-х трикутників між точкою та кутами трикутника
  const area1 = getTriangleArea(px, py, x1, y1, x2, y2);
  const area2 = getTriangleArea(px, py, x2, y2, x3, y3);
  const area3 = getTriangleArea(px, py, x3, y3, x1, y1);

  // якщо сума трьох площ дорівнює площі оригінального трикутника, значить точка всередині!
  return area1 + area2 + area3 === areaOrig;
}

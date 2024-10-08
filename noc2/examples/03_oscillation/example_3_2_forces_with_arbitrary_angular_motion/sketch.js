// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let movers = [];
let attractor;

function setup() {
  // createCanvas(320, 240);
  createCanvas(window.innerWidth, window.innerHeight);

  for (let i = 0; i < 20; i++) {
    movers.push(new Mover(random(width), random(height), random(0.1, 2)));
  }
  attractor = new Attractor();
}

function draw() {
  background(255);

  attractor.display();

  for (let i = 0; i < movers.length; i++) {
    let force = attractor.attract(movers[i]);
    movers[i].applyForce(force);

    movers[i].update();
    movers[i].show();
  }
}
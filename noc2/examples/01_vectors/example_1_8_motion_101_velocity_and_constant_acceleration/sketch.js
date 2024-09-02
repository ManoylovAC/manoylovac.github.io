// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let mover;

function setup() {
  // createCanvas(640, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  mover = new Mover();
}

function draw() {
  background(255);
  mover.show();
  mover.update();
  mover.checkEdges();
}

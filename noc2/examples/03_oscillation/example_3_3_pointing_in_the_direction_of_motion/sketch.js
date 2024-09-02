// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let mover;

function setup() {
  // createCanvas(320, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  mover = new Mover();
}

function draw() {
  background(255);
  mover.update();
  mover.checkEdges();
  mover.display();
}
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let emitter;

function setup() {
  // createCanvas(640, 240);
  createCanvas(window.innerWidth, window.innerHeight);;
  emitter = new Emitter(width / 2, 50);
}

function draw() {
  background(255);
  emitter.addParticle();
  emitter.run();
}
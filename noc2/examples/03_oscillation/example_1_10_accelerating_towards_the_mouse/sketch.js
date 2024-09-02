// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of the basics of motion with vector.
// A "Mover" object stores position, velocity, and acceleration as vectors
// The motion is controlled by affecting the acceleration (in this case towards the mouse)

let mover;

function setup() {
  // createCanvas(320, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  mover = new Mover();
}

function draw() {
  background(255);

  mover.update();
  mover.show();
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

function setup() {
  // createCanvas(320, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
}

function draw() {
  fill(0, 25);
  stroke(0, 50);
  circle(random(width), random(height), 16);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

function setup() {
  // createCanvas(640, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
}

function draw() {
  //{!1} A normal distribution with mean 320 and standard deviation 60
  let x = randomGaussian(width * .5, 60);
  noStroke();
  fill(0, 10);
  circle(x, height / 2, 16);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following
// Path is a just a straight line in this example
// Via Reynolds: // http://www.red3d.com/cwr/steer/PathFollow.html

// Using this variable to decide whether to draw all the stuff
let debug = true;

// A path object (series of connected points)
let path;

// Two vehicles
let vehicle1, vehicle2;
function setup() {
  // let text = createP("Hit space bar to toggle debugging lines.");

  // createCanvas(640, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  path = new Path();

  // Each vehicle has different maxspeed and maxforce for demo purposes
  vehicle1 = new Vehicle(0, height / 2, 2, 0.02);
  vehicle2 = new Vehicle(0, height / 2, 3, 0.05);
}

function draw() {
  background(255);
  // Display the path
  path.show();
  // The boids follow the path
  vehicle1.follow(path);
  vehicle2.follow(path);
  // Call the generic run method (update, borders, display, etc.)
  vehicle1.run();
  vehicle2.run();

  // Check if it gets to the end of the path since it's not a loop
  vehicle1.borders(path);
  vehicle2.borders(path);
}

function keyPressed() {
  if (key == " ") {
    debug = !debug;
  }
}

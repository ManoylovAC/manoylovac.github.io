// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Mover object
let bob;

// Spring object
let spring;

function setup() {
  // createCanvas(320, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  // Create objects at starting position
  // Note third argument in Spring constructor is "rest length"
  spring = new Spring(width / 2, 10, 100);
  bob = new Bob(width / 2, 100);
}

function draw() {
  background(255);

  // Apply a gravity force to the bob
  let gravity = createVector(0, 2);
  bob.applyForce(gravity);


  // Update bob
  bob.update();
  bob.handleDrag(mouseX, mouseY);

  // Connect the bob to the spring (this calculates the force)
  spring.connect(bob);

  // Constrain spring distance between min and max
  spring.constrainLength(bob, 30, 200);

  // Draw everything
  spring.showLine(bob); // Draw a line between spring and bob
  bob.show();
  spring.show();
}

function mousePressed() {
  bob.handleClick(mouseX, mouseY);
}

function mouseReleased() {
  bob.stopDragging();
}

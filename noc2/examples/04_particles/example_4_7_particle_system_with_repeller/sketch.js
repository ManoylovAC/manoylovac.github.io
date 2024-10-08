// One ParticleSystem
let emitter;

//{!1} One repeller
let repeller;

function setup() {
  // createCanvas(640, 240);
  createCanvas(window.innerWidth, window.innerHeight);
  emitter = new Emitter(width / 2, 60);
  repeller = new Repeller(width / 2, 250);
}

function draw() {
  background(255);
  emitter.addParticle();
  // We’re applying a universal gravity.
  let gravity = createVector(0, 0.1);
  emitter.applyForce(gravity);
  //{!1} Applying the repeller
  emitter.applyRepeller(repeller);
  emitter.run();

  repeller.show();
}
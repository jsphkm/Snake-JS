let s;
let scl = 20;

// The statements in the setup() function
// execute once when the program begins
function setup() {
  // Creates canvas with (width, height)
  createCanvas(600, 600);
  s = new Snake();
  frameRate(10);
}

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
 background(51);
 s.update();
 s.show();
}

// The keyPressed() function is called
// once every time a key is pressed.
// The keyCode for the key that was pressed is
// stored in the keyCode variable.
function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}
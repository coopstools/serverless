var stage;
var bg_color;

var server_element;
var const_server;

function setup() {
  var canvas = createCanvas(500, 300);
  canvas.parent('sketch-holder');

  frameRate(30);

  stage = 0;
  bg_color = color(59,176,201);
  server_element = serverElement(80, bg_color);
  const_server = constantServer(210, bg_color);
}

function draw() {
  background(bg_color);
  stage++;

  server_element.update();
  const_server.update();
  server_element.display();
  const_server.display();

  fill(bg_color);
  noStroke();
  rect(0, 0, 30, 300);
}

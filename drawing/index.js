// get Elements from Document
const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("canvas2");
const preview = document.getElementById("color_preview");
const sizeLabel = document.getElementById("sizeLabel");
const resLabel = document.getElementById("resLabel");

// get Drawing Contexts and store width/height of canvas
var ctx = canvas.getContext("2d", { willReadFrequently: true });
var ctx2 = canvas2.getContext("2d");
var width = canvas.width;
var height = canvas.height;

// define Charater Function and Color Function
function charFunc(set, len, value) {
  return set[Math.ceil((len - 1) * (value / 255))];
}
function colorFunc(r, g, b) {
  return (r + g + b) / 3;
}
// create a instance of the Converter, set Resolution to 4 (as default)
// and use the default charset, which has special selection of symbols, which all differ in "brightness" descendingly
var converter = new Converter(ctx2, colorFunc, charFunc);
converter.setResolution(4);
converter.useDefaultCharset();

// alter some settings
ctx.lineCap = "round";
ctx.lineWidth = 5;
ctx.globalAlpha = 255;
ctx.color = "black";

// create some variables
var previousPos;
var currentPos;
var isDown = false;
var tool = "brush";
var res = 6;

// create a Event Listener for Mouse Movements
document.addEventListener("mousemove", function (e) {
  // if the left Mouse Button is not down, skip drawing
  if (!isDown) return;
  updatePos(e);
  draw();
});
document.addEventListener("mousedown", function (e) {
  // change isDown Variable to true if left Mouse Button is presssed
  isDown = true;
  updatePos(e);
  draw();
});

document.addEventListener("mouseup", function () {
  // change isDown Variable to false if left Mouse Button stopped being presssed
  isDown = false;
  // clear previous Positon to detect when the user continues or starts
  previousPos = undefined;
});

// change line width and label when size slider gets an input (changes)
// Note: the "e" argument represent the triggered event!
document.getElementById("size").addEventListener("input", function (e) {
  res = Math.abs(parseInt(e.target.value, 10));
  ctx.lineWidth = res;
  sizeLabel.innerHTML = "Size (" + res + ")";
});

// change the resolution and label when Resolution slider gets an input (changes)
document.getElementById("res").addEventListener("input", function (e) {
  converter.setResolution(parseInt(e.target.value, 10));
  resLabel.innerHTML = "Resolution (" + parseInt(e.target.value, 10) + ")";
});

// change the tool when Tool Menu changes
document.getElementById("tool").addEventListener("change", function (e) {
  tool = e.target.value;
});

// if an Image gets uploaded (element changes), load and draw the image to the Canvas
document.getElementById("uploader").addEventListener("change", function (e) {
  // checks if a file got uploaded
  if (!e.target.files || e.target.files.length == 0) return;
  // gets the first files if multiple
  var file = e.target.files[0];
  // checks if the file type is an image (as png)
  if (file.type !== "image/png") {
    alert("File must be an Image!");
  }

  //creates an Image Object for loading
  var img = new Image();
  // define what should happen when the image is loaded
  img.onload = () => {
    URL.revokeObjectURL(img.src);
    // draw the image to the canvas at top left corner. If the image is bigger than the canvas, these parts will not be drawn
    ctx.drawImage(img, 0, 0, width, height);
  };
  // sets the source of the image object, than it will start to loaded it
  // Note: what excatly is happening here, is not importend!!
  img.src = URL.createObjectURL(file);
});

// sets fill color, color preview (id, display) to the selected color
// it gets the color from the background of the selectors or directly from the value
function selectColor(e, valueBased) {
  let color;
  if (valueBased) color = e.value;
  else color = e.style.background;
  ctx.strokeStyle = preview.id = preview.style.background = color;
}

//clears the entire canvas
function erase() {
  ctx.clearRect(0, 0, width, height);
}

// gets the entire current image as an Image Data Object and then converts it
function convert() {
  converter.update(ctx.getImageData(0, 0, width, height));
}

// draws with correct tool (for future updates)
function draw() {
  // draw from current to previous Position
  if (tool === "brush") drawBrush();
  else if (tool === "circle") drawCircle();
}

// first start a new path (can be thought of as a Operation with multiple sub-operations), than moves to the previous Position.
// from there it draws a line to the current position and closes the path
function drawBrush() {
  ctx.beginPath();
  ctx.moveTo(previousPos.x, previousPos.y);
  ctx.lineTo(currentPos.x, currentPos.y);
  ctx.stroke(); // means fill space in the line
  ctx.closePath();
}


function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function updatePos(e) {
  // store current Position, which is now out dated, as previousPosition
  if (previousPos) previousPos = currentPos;
  // get current Postion from Mouse
  currentPos = getMousePos(canvas, e);
  // if user starts or contiues drawing, store current as previous Position
  // they both have the same values then, so only a Dot is drawn.
  if (!previousPos) previousPos = currentPos;
}
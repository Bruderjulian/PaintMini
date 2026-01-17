import { charFunctions, colorFunctions, charsets } from "./data.js";
import { Converter } from "./Converter.js";

const canvas = document.getElementById("canvas");
const inputSlider = document.getElementById("resolution");
const inputLabel = document.getElementById("resolutionLabel");
const charsetSlider = document.getElementById("charset");
const charsetLabel = document.getElementById("charsetLabel");
const ctx = canvas.getContext("2d");

var converter = new Converter(charsets, colorFunctions.min, charFunctions.simple);
var data;

function handleSlider() {
  let cellSize = parseInt(inputSlider.value);
  if (cellSize == 0) {
    inputLabel.innerHTML = "Original image";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    inputLabel.innerHTML = "Resolution: " + cellSize + " px";
    ctx.font = cellSize + "px Verdana";
    converter.setResolution(cellSize);
    converter.draw(converter.convert(data), ctx);
  }
}

function handleCharsetSlider() {
  let id = parseInt(charsetSlider.value);
  id = Object.keys(charsets)[id];
  charsetLabel.innerHTML = "Charset: " + id;
  converter.setCharset(charsets[id]);
  var time = Date.now();
  converter.draw(converter.convert(data), ctx);
  console.log(Date.now() - time);
}

inputSlider.addEventListener("change", handleSlider);
charsetSlider.addEventListener("change", handleCharsetSlider);

var img = new Image();
img.src = "../testImage.png";
img.onload = function () {
  ctx.drawImage(img, 0, 0, 800, 800);
  data = ctx.getImageData(0, 0, 800, 800);
  handleSlider();
};

function saturate(r, g, b, value) {
  var gray = 0.2989 * r + 0.587 * g + 0.114 * b;
  r = -gray * value + r * (1 + value);
  g = -gray * value + g * (1 + value);
  b = -gray * value + b * (1 + value);
  if (r > 255) r = 255;
  if (g > 255) r = 255;
  if (b > 255) r = 255;
  if (r < 0) r = 0;
  if (g < 0) r = 0;
  if (b < 0) r = 0;
  return [r, g, b];
}

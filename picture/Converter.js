export class Converter {
  #charsets;
  #colorFunc;
  #charFunc;
  #res;
  #charset;
  constructor(charsets, colorFunc, charFunc) {
    this.#charsets = charsets;
    this.#colorFunc = colorFunc;
    this.#charFunc = charFunc;
    this.setCharset(charsets.medium);
    this.setResolution(4);
  }

  convert(imageData) {
    var cells = [];
    var pos = 0,
      i = 0;
    var h, w;
    var x, y;
    for (y = 0, h = imageData.height; y < h; y += this.#res) {
      for (x = 0, w = imageData.width; x < w; x += this.#res) {
        pos = y * 4 * w + x * 4;
        cells[i] = this.#getChar(
          imageData.data[pos],
          imageData.data[pos + 1],
          imageData.data[pos + 2],
          x,
          y
        );
        i++;
      }
    }
    return cells;
  }

  draw(cells, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].draw(ctx);
    }
  }

  #getChar(r, g, b, x, y) {
    var rgb = this.#colorFunc(r, g, b);
    var char = this.#charFunc(this.#charset, this.#charset.length, rgb);
    return new Char([r, g, b], char, x, y);
  }

  setResolution(res) {
    this.#res = parseInt(res, 10);
  }

  setCharset(set) {
    this.#charset = set;
  }
}

class Char {
  color = "rgb(0,0,0)";
  char = "";
  x = 0;
  y = 0;
  constructor(color, char, x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ",255)";
    this.char = char;
  }

  draw(ctx) {
    //ctx.fillStyle = "white";
    //ctx.fillText(this.char, this.x + 1, this.y + 1);
    ctx.fillStyle = this.color;
    ctx.fillText(this.char, this.x, this.y);
  }
}

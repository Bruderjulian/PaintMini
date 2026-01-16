class Converter {
  #colorFunc;
  #charFunc;
  #resolution;
  #charset;
  #ctx;
  constructor(ctx, colorFunc, charFunc) {
    this.#colorFunc = colorFunc;
    this.#charFunc = charFunc;
    this.#ctx = ctx;
  }

  update(imageData) {
    // fills canvas black
    this.#ctx.fillStyle = "black";
    this.#ctx.fillRect(0, 0, canvas.width, canvas.height);
    //this.#ctx.fillStyle = "white";
    // define variables here for performance reasons
    var x, y;
    var h = imageData.height;
    var w = imageData.width;
    imageData = imageData.data;
    var pos, char;
    var r, g, b;
    // goes through all pixels. When Resolution is higher than one,
    // for example 4, it only goes through every 4 pixel
    for (y = 0; y < h; y += this.#resolution) {
      for (x = 0; x < w; x += this.#resolution) {
        // gets the position/index in the color data array
        // by first calculating the row and than the column
        // every pixel is represented by 4 values in the rgba format, so x and y need to be multiplied by 4
        pos = y * 4 * w + x * 4;
        // r, g, b values from array. Alpha values will be skipped
        r = imageData[pos];
        g = imageData[pos + 1];
        b = imageData[pos + 2];
        // calculate the char from the light values of the pixel
        char = this.#charFunc(
          this.#charset,
          this.#charset.length,
          this.#colorFunc(r, g, b)
        );
        // set the fill color to current pixel color
        this.#ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ",255)";
        // draw the character at the coordinate
        this.#ctx.fillText(char, x, y);
      }
    }
  }

  setResolution(resolution) {
    this.#resolution = parseInt(resolution, 10);
  }

  setCharset(set) {
    this.#charset = set;
  }
}

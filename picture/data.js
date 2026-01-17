export const charsets = {
  small: "@*+#&%_:£/-XW",
  medium: "N@#W$9876543210?!abc;:+=-,._ ",
  large:
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
};

export const colorFunctions = {
  average: function (r, g, b) {
    return (r + g + b) / 3;
  },
  grayScale: (r, g, b) => {
    return r * 0.3 + g * 0.59 + b * 0.11;
  },
  luminance: (r, g, b) => {
    r = (r / 255.0) ** 2.218;
    g = (g / 255.0) ** 2.218;
    b = (b / 255.0) ** 2.218;
    var lum = r * 0.2126 + g * 0.7156 + b * 0.0722;
    return Math.pow(lum, 0.68);
  },
  max: (r, g, b) => {
    return Math.max(r, g, b);
  },
  min: (r, g, b) => {
    return Math.min(r, g, b);
  },
  desaturation: (r, g, b) => {
    return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  },
};

export const charFunctions = {
  simple: function (set, len, v) {
    return set[Math.ceil((len - 1) * (v / 255))];
  },
};

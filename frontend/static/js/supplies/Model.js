class Model {
  constructor(...fieldNames) {
    this.fields = []
    const fieldValues = ['a', 'b', 'c', 'd']
    for (let i = 0; i < fieldNames.length; i++) {
      this.fields.push(new Field(fieldValues[i], fieldNames[i]))
    }
  }

  toModel(base) {
    return this[('to' + base.name.toUpperCase())]()
  }

  update(model) {
    model.fields.map(field => this[field.value] = model[field.value])
  }

  default() {
    this.fields.map(field => this[field.value].handle())
  }
}

class RGB extends Model {
  name = 'rgb';
  fullName = 'Red Green Blue';

  constructor(red, green, blue) {
    super('R', 'G', 'B');
    this.a = new Integer(red, 255);
    this.b = new Integer(green, 255);
    this.c = new Integer(blue, 255);
  }

  getGradient(value) {
    const cases = {
      'a': 'red',
      'b': 'lime',
      'c': 'blue',
    }
    return `linear-gradient(to right, black, ${cases[value]})`
  }

  toRGB() {
    return this;
  }

  toHEX() {
    this.default();
    
    let R = Number(this.a.value).toString(16);
    let G = Number(this.b.value).toString(16);
    let B = Number(this.c.value).toString(16);
    
    return new HEX(R, G, B);
  }

  toHSL() {
    this.default();
    let R = this.a.value / 255;
    let G = this.b.value / 255;
    let B = this.c.value / 255;

    let Max = Math.max(R, G, B);
    let Min = Math.min(R, G, B);
    let C = Max - Min;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let H = 0;
    let S = 0
    let L = (Max + Min) / 2;
    if (L != 0 && L != 1) {
      S = Math.round((Max - L) / Math.min(L, 1 - L) * 100);
    }
    L = Math.round(L * 100);

    if (C == 0) {
      H = 0;
    } else {
      let segment, shift;
      switch(Max) {
        case R:
          segment = (G - B) / C;
          shift = 0 / 60;
          if (segment < 0) {
            shift = 360 / 60;
          }
          H = segment + shift;
          break;
        case G:
          segment = (B - R) / C;
          shift = 120 / 60;
          H = segment + shift;
          break;
        case B:
          segment = (R - G) / C;
          shift = 240 / 60;
          H = segment + shift;
          break;
      }
    }
    return new HSL(Math.round(H * 60), S, L);
  }

  toHWB() {
    this.default();
    let R = this.a.value / 255;
    let G = this.b.value / 255;
    let B = this.c.value / 255;

    let Max = Math.max(R, G, B);
    let Min = Math.min(R, G, B);
    let C = Max - Min;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let H = 0;
    let S = 0
    let L = (Max + Min) / 2;
    if (L != 0 && L != 1) {
      S = Math.round((Max - L) / Math.min(L, 1 - L) * 100) / 100;
    }
    L = Math.round(L * 100) / 100;

    let V = (L + Math.min(L, 1 - L) * S);
    if (V == 0) {
      S = 0;
    } else {
      S = 2 * (1 - L / V);
    }

    let W = Math.round((1 - S) * V * 100);
    let K = Math.round((1 - V) * 100);

    if (C == 0) {
      H = 0;
    } else {
      let segment, shift;
      switch(Max) {
        case R:
          segment = (G - B) / C;
          shift = 0 / 60;
          if (segment < 0) {
            shift = 360 / 60;
          }
          H = segment + shift;
          break;
        case G:
          segment = (B - R) / C;
          shift = 120 / 60;
          H = segment + shift;
          break;
        case B:
          segment = (R - G) / C;
          shift = 240 / 60;
          H = segment + shift;
          break;
      }
    }

    return new HWB(Math.round(H * 60), W, K);
  }

  toCMYK() {
    this.default();
    let R = this.a.value / 255;
    let G = this.b.value / 255;
    let B = this.c.value / 255;

    let C = 0;
    let M = 0;
    let Y = 0;
    let K = 1 - Math.max(R, G, B);
    if (K == 1) {
      K = Math.round(K * 100);
      return new CMYK(C, M, Y, K);
    }

    C = Math.round((1 - R - K) / (1 - K) * 100);
    M = Math.round((1 - G - K) / (1 - K) * 100);
    Y = Math.round((1 - B - K) / (1 - K) * 100);
    K = Math.round(K * 100);

    return new CMYK(C, M, Y, K);
  }

  Add(...rgbs) {
    let R = this.a, G = this.b, B = this.c;
    for (let rgb of rgbs) {
      R = R.Add(rgb.a);
      G = G.Add(rgb.b);
      B = B.Add(rgb.c);
    }
    return new RGB(R.value, G.value, B.value);
  }

  Sub(...rgbs) {
    let R = this.a, G = this.b, B = this.c;
    for (let rgb of rgbs) {
      R = R.Sub(rgb.a);
      G = G.Sub(rgb.b);
      B = B.Sub(rgb.c);
    }
    return new RGB(R.value, G.value, B.value);
  }

  Mix(...rgbs) {
    let R = this.a, G = this.b, B = this.c;
    for (let rgb of rgbs) {
      R = R.Mix(rgb.a);
      G = G.Mix(rgb.b);
      B = B.Mix(rgb.c);
    }
    return new RGB(R.value, G.value, B.value);
  }

  toString() {
    return `${this.a}, ${this.b}, ${this.c}`
  }
}

class HEX extends Model {
  name = 'hex';
  fullName = 'Hexademical';

  constructor(red, green, blue) {
    super('R', 'G', 'B');
    this.a = new String(red);
    this.b = new String(green);
    this.c = new String(blue);
  }

  getGradient() {
    return '';
  }

  toRGB() {
    this.default();
    let R = parseInt(this.a.value, 16);
    let G = parseInt(this.b.value, 16);
    let B = parseInt(this.c.value, 16);

    return new RGB(R, G, B);
  }

  toHEX() {
    return this;
  }

  toHSL() {
    this.default();
    let R = parseInt(this.a.value, 16) / 255;
    let G = parseInt(this.b.value, 16) / 255;
    let B = parseInt(this.c.value, 16) / 255;

    let Max = Math.max(R, G, B);
    let Min = Math.min(R, G, B);
    let C = Max - Min;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let H = 0;
    let S = 0
    let L = (Max + Min) / 2;
    if (!(L == 0 || L == 1)) {
      S = Math.round((Max - L) / Math.min(L, 1 - L) * 100);
    }
    L = Math.round(L * 100);

    if (C == 0) {
      H = 0;
    } else {
      let segment, shift;
      switch(Max) {
        case R:
          segment = (G - B) / C;
          shift = 0 / 60;
          if (segment < 0) {
            shift = 360 / 60;
          }
          H = segment + shift;
          break;
        case G:
          segment = (B - R) / C;
          shift = 120 / 60;
          H = segment + shift;
          break;
        case B:
          segment = (R - G) / C;
          shift = 240 / 60;
          H = segment + shift;
          break;
      }
    }
    return new HSL(Math.round(H * 60), S, L);
  }

  toHWB() {
    return this.toHSL().toHWB();
  }

  toCMYK() {
    this.default();
    let R = parseInt(this.a.value, 16) / 255;
    let G = parseInt(this.b.value, 16) / 255;
    let B = parseInt(this.c.value, 16) / 255;

    let C = 0;
    let M = 0;
    let Y = 0;
    let K = 1 - Math.max(R, G, B);
    if (K == 1) {
      K = Math.round(K * 100);
      return new CMYK(C, M, Y, K);
    }

    C = Math.round((1 - R - K) / (1 - K) * 100);
    M = Math.round((1 - G - K) / (1 - K) * 100);
    Y = Math.round((1 - B - K) / (1 - K) * 100);
    K = Math.round(K * 100);

    return new CMYK(C, M, Y, K);
  }

  toString() {
    return [this.a, this.b, this.c].map(el => el.toString()).map(el => el.length == 1 ? '0' + el : el).join('')
  }
}

class HSL extends Model {
  name = 'hsl';
  fullName = 'Hue Saturation Lightness';

  constructor(hue, saturation, lightness) {
    super('H', 'S', 'L');
    this.a = new Integer(hue, 360);
    this.b = new Integer(saturation, 100);
    this.c = new Integer(lightness, 100);
  }

  getGradient(value) {
    let cases = {
      'a': 'red, yellow, lime, cyan, blue, magenta, red',
      'b': `grey, #${this.toHEX().toString()}, white`,
      'c': `black, #${this.toHEX().toString()}, white`,
    }
    return `linear-gradient(to right, ${cases[value]})`
  }

  toRGB() {
    this.default();
    let H = this.a.value;
    let S = this.b.value / 100;
    let L = this.c.value / 100;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let a = S * Math.min(L, 1 - L);
    let f = (n) => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0));
    let G = Math.round(255 * f(8));
    let B = Math.round(255 * f(4));

    return new RGB(R, G, B);
  }

  toHEX() {
    this.default();
    let H = this.a.value;
    let S = this.b.value / 100;
    let L = this.c.value / 100;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let a = S * Math.min(L, 1 - L);
    let f = (n) => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0)).toString(16);
    let G = Math.round(255 * f(8)).toString(16);
    let B = Math.round(255 * f(4)).toString(16);

    return new HEX(R, G, B);
  }

  toHSL() {
    return this;
  }

  toHWB() {
    this.default();
    let H = this.a.value;
    let S = this.b.value / 100;
    let L = this.c.value / 100;

    let V = (L + Math.min(L, 1 - L) * S);
    if (V == 0) {
      S = 0;
    } else {
      S = 2 * (1 - L / V);
    }

    let W = Math.round((1 - S) * V * 100);
    let B = Math.round((1 - V) * 100);

    return new HWB(H, W, B);
  }

  toCMYK() {
    return this.toRGB().toCMYK();
  }

  toString() {
    return `${this.a}, ${this.b}%, ${this.c}%`;
  }
}

class HWB extends Model {
  name = 'hwb';
  fullName = 'Hue Whiteness Blackness';

  constructor(hue, whiteness, blackness) {
    super('H', 'W', 'B');
    this.a = new Integer(hue, 360);
    this.b = new Integer(whiteness, 100);
    this.c = new Integer(blackness, 100);
  }

  getGradient(value) {
    const cases = {
      'a': 'red, yellow, lime, cyan, blue, magenta, red',
      'b': `#${this.toHEX().toString()}, white`,
      'c': `#${this.toHEX().toString()}, black`,
    }
    return `linear-gradient(to right, ${cases[value]})`
  }

  toRGB() {
    this.default();
    let H = this.a.value;
    let W = this.b.value / 100;
    let K = this.c.value / 100;

    if (K == 1) {
      return new RGB(0, 0, 0);
    }

    let S = 1 - (W / (1 - K));
    let V = 1 - K;

    let L = V * (1 - (S / 2));
    if (L == 0 || L == 1) {
      S = 0;
    } else {
      S = (V - L) / Math.min(L, 1 - L);
    }

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let a = S * Math.min(L, 1 - L);
    let f = (n) => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0));
    let G = Math.round(255 * f(8));
    let B = Math.round(255 * f(4));

    return new RGB(R, G, B);
  }

  toHEX() {
    this.default();
    let H = this.a.value;
    let W = this.b.value / 100;
    let K = this.c.value / 100;

    if (K == 1) {
      return new HEX('0', '0', '0');
    }

    let S = 1 - (W / (1 - K));
    let V = 1 - K;

    let L = V * (1 - (S / 2));
    if (L == 0 || L == 1) {
      S = 0;
    } else {
      S = (V - L) / Math.min(L, 1 - L);
    }

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let a = S * Math.min(L, 1 - L);
    let f = (n) => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0)).toString(16);
    let G = Math.round(255 * f(8)).toString(16);
    let B = Math.round(255 * f(4)).toString(16);

    return new HEX(R, G, B);
  }

  toHSL() {
    this.default();
    let H = this.a.value;
    let W = this.b.value / 100;
    let B = this.c.value / 100;

    let S = 0;
    if (B == 1) {
      return new HSL(H, S, 0);
    }

    S = 1 - (W / (1 - B));
    let V = 1 - B;

    let L = V * (1 - (S / 2));
    if (L == 0 || L == 1) {
      S = 0;
    } else {
      S = Math.round(((V - L) / Math.min(L, 1 - L)) * 100);
    }
    L = Math.round(L * 100);

    return new HSL(H, S, L);
  }

  toHWB() {
    return this;
  }

  toCMYK() {
    return this.toRGB().toCMYK();
  }

  handle() {
    if (this.b.value + this.c.value > 100) {
      if (this.b.value > this.c.value) {
        this.c.value = 100 - this.b.value;
      } else {
        this.b.value = 100 - this.c.value;
      }
    }
  }

  toString() {
    return `${this.a}, ${this.b}%, ${this.c}%`;
  }
}

class CMYK extends Model {
  name = 'cmyk';
  fullName = 'Cyan Magenta Yellow blacK';

  constructor(cyan, magenta, yellow, black) {
    super('C', 'M', 'Y', 'K');
    this.a = new Integer(cyan, 100);
    this.b = new Integer(magenta, 100);
    this.c = new Integer(yellow, 100);
    this.d = new Integer(black, 100);
  }

  getGradient(value) {
    const cases = {
      'a': 'cyan',
      'b': 'magenta',
      'c': 'yellow',
      'd': 'black',
    }
    return `linear-gradient(to right, white, ${cases[value]})`;
  }

  toRGB() {
    this.default();
    let C = this.a.value / 100;
    let M = this.b.value / 100;
    let Y = this.c.value / 100;
    let K = this.d.value / 100;

    let R = Math.round(255 * (1 - C) * (1 - K));
    let G = Math.round(255 * (1 - M) * (1 - K));
    let B = Math.round(255 * (1 - Y) * (1 - K));

    return new RGB(R, G, B);
  }

  toHEX() {
    this.default();
    let C = this.a.value / 100;
    let M = this.b.value / 100;
    let Y = this.c.value / 100;
    let K = this.d.value / 100;

    let R = Math.round(255 * (1 - C) * (1 - K)).toString(16);
    let G = Math.round(255 * (1 - M) * (1 - K)).toString(16);
    let B = Math.round(255 * (1 - Y) * (1 - K)).toString(16);

    return new HEX(R, G, B);
  }

  toHSL() {
    return this.toRGB().toHSL();
  }

  toHWB() {
    return this.toRGB().toHWB();
  }

  toCMYK() {
    return this;
  }

  toString() {
    return `${this.a}%, ${this.b}%, ${this.c}%, ${this.d}%`;
  }
}

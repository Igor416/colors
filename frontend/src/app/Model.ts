import { PrimitiveType, Integer, String } from './PrimitiveType';
import { Field } from './Field';

export abstract class Model {
  name: string = '';
  fullName: string = '';
  fields: Field[] = [];

  a!: PrimitiveType;
  b!: PrimitiveType;
  c!: PrimitiveType;
  d!: PrimitiveType;

  get(value: string): PrimitiveType | void {
    switch (value) {
      case 'a':
        return this.a;
      case 'b':
        return this.b;
      case 'c':
        return this.c;
      case 'd':
        return this.d;
    }
  }

  abstract toRGB(): RGB;
  abstract toHEX(): HEX;
  abstract toHSL(): HSL;
  abstract toHWB(): HWB;
  abstract toCMYK(): CMYK;
  toModel(base: Model): Model {
    return (this[('to' + base.name.toUpperCase()) as keyof Model] as () => any)() as Model
  }

  update(model: Model): void {
    this.a = model.a;
    this.b = model.b;
    this.c = model.c;
    this.d = model.d;
  }

  default(): void {
    this.a.handle();
    this.b.handle();
    this.c.handle();
    this.d?.handle();
  }

  eq(self: Model, ...models: Model[]): boolean {
    for (let model of models) {
      model = model.toModel(self);
      if (!this.a.eq(model.a) || !this.b.eq(model.b) || !this.c.eq(model.c)) {
        return false;
      }
    }
    return true;
  }

  abstract getGradient(value: string): string;
  abstract toString(): string;
}

export class RGB extends Model {
  override name: string = 'rgb';
  override fullName: string = 'Red Green Blue';

  override a: Integer;
  override b: Integer;
  override c: Integer;

  constructor(red: number, green: number, blue: number) {
    super();
    this.a = new Integer(red, 255);
    this.b = new Integer(green, 255);
    this.c = new Integer(blue, 255);

    this.fields.push(new Field('a', 'R'));
    this.fields.push(new Field('b', 'G'));
    this.fields.push(new Field('c', 'B'));
  }

  getGradient(value: string): string {
    let pre = 'linear-gradient(to right, '
    switch (value) {
      case 'a':
        return pre + 'black, red)';
      case 'b':
        return pre + 'black, lime)';
      case 'c':
        return pre + 'black, blue)';
    }
    return '';
  }

  toRGB(): RGB {
    return this;
  }

  toHEX(): HEX {
    this.default();
    let R = this.a.value.toString(16);
    let G = this.b.value.toString(16);
    let B = this.c.value.toString(16);

    return new HEX(R, G, B);
  }

  toHSL(): HSL {
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

  toHWB(): HWB {
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

  toCMYK(): CMYK {
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

  Add(...rgbs: RGB[]): RGB {
    let R = this.a, G = this.b, B = this.c;
    for (let rgb of rgbs) {
      R = R.Add(rgb.a);
      G = G.Add(rgb.b);
      B = B.Add(rgb.c);
    }
    return new RGB(R.value, G.value, B.value);
  }

  Sub(...rgbs: RGB[]): RGB {
    let R = this.a, G = this.b, B = this.c;
    for (let rgb of rgbs) {
      R = R.Sub(rgb.a);
      G = G.Sub(rgb.b);
      B = B.Sub(rgb.c);
    }
    return new RGB(R.value, G.value, B.value);
  }

  Mix(...rgbs: RGB[]): RGB {
    let R = this.a, G = this.b, B = this.c;
    for (let rgb of rgbs) {
      R = R.Mix(rgb.a);
      G = G.Mix(rgb.b);
      B = B.Mix(rgb.c);
    }
    return new RGB(R.value, G.value, B.value);
  }

  toString(): string {
    return `${this.a}, ${this.b}, ${this.c}`
  }
}

export class HEX extends Model {
  override name: string = 'hex';
  override fullName: string = 'Hexademical';

  override a: String;
  override b: String;
  override c: String;

  constructor(red: string, green: string, blue: string) {
    super();
    this.a = new String(red);
    this.b = new String(green);
    this.c = new String(blue);

    this.fields.push(new Field('a', 'R'));
    this.fields.push(new Field('b', 'G'));
    this.fields.push(new Field('c', 'B'));
  }

  getGradient(): string {
    return '';
  }

  toRGB(): RGB {
    this.default();
    let R = parseInt(this.a.value, 16);
    let G = parseInt(this.b.value, 16);
    let B = parseInt(this.c.value, 16);

    return new RGB(R, G, B);
  }

  toHEX(): HEX {
    return this;
  }

  toHSL(): HSL {
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

  toHWB(): HWB {
    return this.toHSL().toHWB();
  }

  toCMYK(): CMYK {
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

  toString(): string {
    return '#' + [this.a, this.b, this.c].map(el => el.toString()).map(el => el.length == 1 ? '0' + el : el).join('')
  }
}

export class HSL extends Model {
  override name: string = 'hsl';
  override fullName: string = 'Hue Saturation Lightness';

  override a: Integer;
  override b: Integer;
  override c: Integer;

  constructor(hue: number, saturation: number, lightness: number) {
    super();
    this.a = new Integer(hue, 360);
    this.b = new Integer(saturation, 100);
    this.c = new Integer(lightness, 100);

    this.fields.push(new Field('a', 'H'));
    this.fields.push(new Field('b', 'S'));
    this.fields.push(new Field('c', 'L'));
  }

  getGradient(value: string): string {
    let pre = 'linear-gradient(to right,'
    switch (value) {
      case 'a':
        return pre + ` red, yellow, lime, cyan, blue, magenta, red)`;
      case 'b':
        return pre + ` grey, ${this.toHEX().toString()})`;
      case 'c':
        return pre + ` black, ${this.toHEX().toString()}, white)`;
    }
    return '';
  }

  toRGB(): RGB {
    this.default();
    let H = this.a.value;
    let S = this.b.value / 100;
    let L = this.c.value / 100;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let a = S * Math.min(L, 1 - L);
    let f = (n: number): number => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0));
    let G = Math.round(255 * f(8));
    let B = Math.round(255 * f(4));

    return new RGB(R, G, B);
  }

  toHEX(): HEX {
    this.default();
    let H = this.a.value;
    let S = this.b.value / 100;
    let L = this.c.value / 100;

    // wikipedia src: "https://en.wikipedia.org/wiki/HSL_and_HSV"
    let a = S * Math.min(L, 1 - L);
    let f = (n: number): number => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0)).toString(16);
    let G = Math.round(255 * f(8)).toString(16);
    let B = Math.round(255 * f(4)).toString(16);

    return new HEX(R, G, B);
  }

  toHSL(): HSL {
    return this;
  }

  toHWB(): HWB {
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

  toCMYK(): CMYK {
    return this.toRGB().toCMYK();
  }

  toString(): string {
    return `${this.a}, ${this.b}%, ${this.c}%`;
  }
}

export class HWB extends Model {
  override name: string = 'hwb';
  override fullName: string = 'Hue Whiteness Blackness';

  override a: Integer;
  override b: Integer;
  override c: Integer;

  constructor(hue: number, whiteness: number, blackness: number) {
    super();
    this.a = new Integer(hue, 360);
    this.b = new Integer(whiteness, 100);
    this.c = new Integer(blackness, 100);

    this.fields.push(new Field('a', 'H'));
    this.fields.push(new Field('b', 'W'));
    this.fields.push(new Field('c', 'B'));
  }

  getGradient(value: string): string {
    let pre = 'linear-gradient(to right,'
    switch (value) {
      case 'a':
        return pre + ` red, yellow, lime, cyan, blue, magenta, red)`;
      case 'b':
        return pre + ` ${this.toHEX().toString()}, white)`;
      case 'c':
        return pre + ` ${this.toHEX().toString()}, black)`;
    }
    return '';
  }

  toRGB(): RGB {
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
    let f = (n: number): number => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0));
    let G = Math.round(255 * f(8));
    let B = Math.round(255 * f(4));

    return new RGB(R, G, B);
  }

  toHEX(): HEX {
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
    let f = (n: number): number => {
      let k = (n + H / 30) % 12;
      return L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    let R = Math.round(255 * f(0)).toString(16);
    let G = Math.round(255 * f(8)).toString(16);
    let B = Math.round(255 * f(4)).toString(16);

    return new HEX(R, G, B);
  }

  toHSL(): HSL {
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

  toHWB(): HWB {
    return this;
  }

  toCMYK(): CMYK {
    return this.toRGB().toCMYK();
  }

  handle(): void {
    if (this.b.value + this.c.value > 100) {
      if (this.b.value > this.c.value) {
        this.c.value = 100 - this.b.value;
      } else {
        this.b.value = 100 - this.c.value;
      }
    }
  }

  toString(): string {
    return `${this.a}, ${this.b}%, ${this.c}%`;
  }
}

export class CMYK extends Model {
  override name: string = 'cmyk';
  override fullName: string = 'Cyan Magenta Yellow blacK';

  override a: Integer;
  override b: Integer;
  override c: Integer;
  override d: Integer;

  constructor(cyan: number, magenta: number, yellow: number, black: number) {
    super();
    this.a = new Integer(cyan, 100);
    this.b = new Integer(magenta, 100);
    this.c = new Integer(yellow, 100);
    this.d = new Integer(black, 100);

    this.fields.push(new Field('a', 'C'));
    this.fields.push(new Field('b', 'M'));
    this.fields.push(new Field('c', 'Y'));
    this.fields.push(new Field('d', 'K'));
  }

  getGradient(value: string): string {
    let pre = 'linear-gradient(to right,'
    switch (value) {
      case 'a':
        return pre + ` white, cyan)`;
      case 'b':
        return pre + ` white, magenta)`;
      case 'c':
        return pre + ` white, yellow)`;
      case 'd':
        return pre + ` white, black)`;
    }
    return '';
  }

  toRGB(): RGB {
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

  toHEX(): HEX {
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

  toHSL(): HSL {
    return this.toRGB().toHSL();
  }

  toHWB(): HWB {
    return this.toRGB().toHWB();
  }

  toCMYK(): CMYK {
    return this;
  }

  toString(): string {
    return `${this.a}%, ${this.b}%, ${this.c}%, ${this.d}%`;
  }
}

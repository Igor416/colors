import { Sign } from './Equation';
import { Model, RGB, HEX, HSL, HWB, CMYK } from './Model';

export class Color {
  models: Model[];
  rgb: RGB;
  hex: HEX;
  hsl: HSL;
  hwb: HWB;
  cmyk: CMYK;

  constructor(model: Model) {
    this.rgb = model.toRGB();
    this.hex = model.toHEX();
    this.hsl = model.toHSL();
    this.hwb = model.toHWB();
    this.cmyk = model.toCMYK();

    this.models = [this.rgb, this.hex, this.hsl, this.hwb, this.cmyk];
  }

  update(changed: Model): void {
    for (let model of this.models) {
      if (model.name !== changed.name) {
        model.update(changed.toModel(model))
      }
    }
  }

  operate(sign: Sign, ...colors: Color[]) {
    let rgb = this.rgb;
    for (let color of colors) {
      switch (sign) {
        case Sign.Plus: rgb = rgb.Add(color.rgb); break;
        case Sign.Minus: rgb = rgb.Sub(color.rgb); break;
        case Sign.Mix: rgb = rgb.Mix(color.rgb); break;
      }
    }
    return new Color(rgb);
  }

  getShade(): string {
    if (this.hsl.c.value <= 50) {
      return 'white';
    }
    return 'black';
  }

  semiInvert(): Color {
    let R = 0, G = 0, B = 0;
    if (this.rgb.a.value < this.rgb.a.max / 2) {
      R = this.rgb.a.max;
    }
    
    if (this.rgb.b.value < this.rgb.b.max / 2) {
      G = this.rgb.b.max;
    }
    
    if (this.rgb.c.value < this.rgb.c.max / 2) {
      B = this.rgb.c.max;
    }
    
    return new Color(new RGB(R, G, B));
  }

  invert(): Color {
    let color = this.operate(Sign.Minus, new Color(new HSL(0, 100, 100)));
    return color;
  }

  toString(): string {
    return this.hex.toString() + ' ' + this.rgb.toString();
  }

  static toColor(hex: string): Color {
    let R = hex.repeat(1).slice(1, 3);
    let G = hex.repeat(1).slice(3, 5);
    let B = hex.repeat(1).slice(5, 7);

    return new Color(new HEX(R, G, B));
  }
}

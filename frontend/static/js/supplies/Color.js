class Color {
  constructor(model) {
    this.rgb = model.toRGB();
    this.hex = model.toHEX();
    this.hsl = model.toHSL();
    this.hwb = model.toHWB();
    this.cmyk = model.toCMYK();

    this.models = [this.rgb, this.hex, this.hsl, this.hwb, this.cmyk];
  }

  update(changed) {
    this.models.filter(model => model.name !== changed.name).map(model => model.update(changed.toModel(model)))
  }

  operate(sign, ...colors) {
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

  getShade() {
    return this.hsl.c.value <= 50 ? 'white' : 'black';
  }

  semiInvert() {
    const max = 255;
    const half = 128;
    let R = this.rgb.a.value < half ? max : 0;
    let G = this.rgb.b.value < half ? max : 0;
    let B = this.rgb.c.value < half ? max : 0;
    return new Color(new RGB(R, G, B));
  }

  invert() {
    return new Color(new RGB(255, 255, 255).Sub(this.rgb));
  }

  toString() {
    return this.hex.toString() + ' ' + this.rgb.toString();
  }

  static toColor(hex) {
    let R = hex.repeat(1).slice(0, 2);
    let G = hex.repeat(1).slice(2, 4);
    let B = hex.repeat(1).slice(4, 6);
    return new Color(new HEX(R, G, B));
  }
}
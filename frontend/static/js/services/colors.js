class ColorsService {
  constructor() {
    this.cookies = new CookiesService()
  }

  loadColor(key) {
    const color = this.cookies.get(key);
    if (color != '' && !color.includes("NaN")) {
      return Color.toColor(color);
    }
    return Color.toColor('ffffff');
  }

  saveColor(key, color) {
    this.cookies.set(key, color.hex.toString());
  }

  loadEquation() {
    return new Equation(this.cookies.get('calculator_colors'));
  }

  saveEquation(equation) {
    /*
    E.g. hexs = ['ff0080', '507090', '000000']
         signs = ['+', '&']
         result = ['283809']

         row = 'ff0080' +
               ('+' + '507090' + '&' + '000000') - cycle part
               = '283809';
    */
    let row = equation.hexs[0];
    for (let j = 1; j < equation.hexs.length; j++) {
      row += equation.signs[j - 1];
      row += equation.hexs[j];
    }
    this.cookies.set('calculator_colors', row);
  }
}

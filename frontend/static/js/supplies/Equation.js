const Sign = {
  Plus: '+',
  Minus: '-',
  Mix: '&'
}

class Equation {
  constructor(row) {
    /*
    row - the whole equation, consists both from hexs and signs
    hexs - all terms of the equation, except for the result
    signs - all signs except for the '='
    result - the hex, representing the result
    */
    if (row != '') {
      this.hexs = row.split(new RegExp('[+&-]{1}', 'g')); //split at any sign
      this.signs = row.split(new RegExp('[A-Fa-f0-9]{6}', 'g')); //split at any hex

      /*as the row starts with hex and ends,
      when splitted there will be two empty string from both ends*/
      this.signs.shift(); //removing first empty string
      this.signs.pop(); //removing last empty string

      this.getResult();

    } else {
      //default
      this.hexs = ['000000', '000000'];
      this.signs = [Sign.Plus];
      this.result = '000000';
    }
  }

  static getSign(sign) {
    switch (sign) {
      case Sign.Plus: return 'plus';
      case Sign.Minus: return 'minus';
      case Sign.Mix: return 'mix';
    }
  }

  add(hex) {
    this.hexs.push(hex);
    this.signs.push(Sign.Plus);
  }

  remove() {
    this.hexs.pop();
    this.signs.pop();
  }

  toArray() {
    const row = [this.hexs[0]];
    for (let i = 0; i < this.signs.length; i++) {
      row.push(this.signs[i])
      row.push(this.hexs[i + 1])
    }
    
    return row;
  }

  getResult() {
    //updating colors for the rendering and calculating the result
    if (this.hexs.filter(el => el.length < 6).length > 0) {
      return this.result;
    }
    let result = Color.toColor(this.hexs[0]);
    for (let i = 1; i < this.hexs.length; i++) {
      result = result.operate(this.signs[i-1], Color.toColor(this.hexs[i]));
    }
    this.result = result.hex.toString();
    return this.result
  }
}

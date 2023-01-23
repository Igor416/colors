import { Color } from './Color';

export enum Sign {
  Plus = '+',
  Minus = '-',
  Mix = '&'
}

export class Equation {
  hexs: string[];
  signs: Sign[] = [];
  result: string = '';

  constructor(row: string = '') {
    /*
    row - the whole equation, consists both from hexs and signs
    hexs - all terms of the equation, except for the result
    signs - all signs except for the '='
    result - the hex, representing the result
    */
    if (row != '') {
      this.hexs = row.split(new RegExp('[+&=-]{1}', 'g')); //split at any sign
      this.signs = row.split(new RegExp('[#A-Fa-f0-9]{7}', 'g')).map(el => el as Sign); //split at any hex

      /*as the row starts with hex and ends,
      when splitted there will be two empty string from both ends*/
      this.signs.shift(); //removing first emplty string
      this.signs.pop(); //removing last emplty string
      this.signs.pop(); //removing = sign, beacuse it's at the tail of array

      //removing the last hex (result) and storing it
      this.result = this.hexs.pop() as string;

    } else {
      //default
      this.hexs = ['#000000', '#000000'];
      this.signs = [Sign.Plus];
    }
  }

  add(hex: string): void {
    this.hexs.push(hex);
    this.signs.push(Sign.Plus);
  }

  remove(): void {
    this.hexs.pop();
    this.signs.pop();
  }

  getResult(): string {
    //updating colors for the rendering and calculating the result
    if (this.hexs.filter(el => el.length < 7).length > 0) {
      return this.result;
    }
    this.result = this.hexs[0];
    let result;
    for (let i = 1; i < this.hexs.length; i++) {
      result = Color.toColor(this.result);

      this.result = result.operate(this.signs[i-1], Color.toColor(this.hexs[i])).hex.toString();
    }
    return this.result
  }
}

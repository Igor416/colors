import { Component, OnInit } from '@angular/core';
import { Color } from 'src/app/Color';
import { Equation, Sign } from '../../Equation';
import { ColorsService } from '../../services/colors/colors.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  equation!: Equation;
  pickedSignId: number;
  minColors: number;
  maxColors: number;
  isMobile: boolean;

  constructor(private colors: ColorsService) {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
    this.pickedSignId = 0
    this.minColors = 2;
    this.maxColors = 26;
  }

  ngOnInit(): void {
    this.equation = this.colors.loadEquation('calculator_colors');
  }

  getRow(): string[] {
    let row: string[] = [this.equation.hexs[0]];
    for (let i = 0; i < this.equation.signs.length; i++) {
      row.push(this.equation.signs[i])
      row.push(this.equation.hexs[i + 1])
    }
    
    return row;
  }

  getInvertedColor(id: number): string {
    let color = Color.toColor(this.equation.hexs[id]);
    return color.semiInvert().hex.toString(); //to get the text color
  }

  invertColor(id: number) {
    let color = Color.toColor(this.equation.hexs[id]).invert();
    this.equation.hexs[id] = color.hex.toString();
  }

  getResult(): string {
    this.colors.saveEquation('calculator_colors', this.equation);
    return this.equation.getResult();
  }

  getSign(sign: Sign): string {
    switch (sign) {
      case Sign.Plus: return 'plus';
      case Sign.Minus: return 'minus';
      case Sign.Mix: return 'mix';
    }
  }

  getPickedSign(): string {
    return this.getSign(this.equation.signs[this.pickedSignId]);
  }

  changeSign(sign: string): void {
    this.equation.signs[this.pickedSignId] = sign as Sign;
  }

  clear(): void {
    this.equation = new Equation();
  }

  add(): void {
    if (this.equation.hexs.length < this.maxColors) {
      this.equation.add('#000000');
    }
  }

  remove(): void {
    if (this.equation.hexs.length > this.minColors) {
      this.equation.remove();
    }
  }

  trackByFn(index: number, item: any) {
    return index;  
  }
}

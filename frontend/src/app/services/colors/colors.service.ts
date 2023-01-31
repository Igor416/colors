import { Injectable } from '@angular/core';
import { Color } from '../../Color';
import { Equation } from '../../Equation';
import { Sign } from '../../Equation';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor(private cookies: CookieService) { }

  loadColor(key: string): Color {
    let color = this.cookies.get(key) as string;
    if (color != '' && !color.includes("NaN")) {
      return Color.toColor(color);
    }
    return Color.toColor('#ffffff');
  }

  saveColor(key: string, color: Color): void {
    this.cookies.set(key, color.hex.toString());
  }

  loadEquation(key: string): Equation {
    return new Equation(this.cookies.get(key));
  }

  saveEquation(key: string, equation: Equation): void {
    /*
    E.g. hexs = ['#ff0080', '#507090', '#000000']
         signs = ['+', '&']
         result = ['#283809']

         row = '#ff0080' +
               ('+' + '#507090' + '&' + '#000000') - cycle part
               = '#283809';
    */
    let row = equation.hexs[0];
    for (let j = 1; j < equation.hexs.length; j++) {
      row += equation.signs[j - 1] as Sign;
      row += equation.hexs[j];
    }
    row += '=';
    row += equation.result;
    this.cookies.set(key, row);
  }
}

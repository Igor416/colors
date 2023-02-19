import { Injectable } from '@angular/core';
import { Scheme, Monochromatic, Complementary, Analogous, Compound, Triadic, Rectangle, Square } from '../../Scheme';
import { Cursor } from '../../Cursor';
import { Color } from '../../Color';
import { Sign } from 'src/app/Equation';
import { CookieService } from 'ngx-cookie-service';

const SchemeType: any = {
  Monochromatic, Complementary, Analogous, Compound, Triadic, Rectangle, Square
}

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  constructor(private cookies: CookieService) { }

  get(name: string, x: number, y: number, size: number): Scheme {
    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (40, 52) on the canvas,
    though we need to perform calculations, as the center
    of the unit circle is at coords (size / 2, size / 2),
    so the circle_x will be: x - size / 2.
    circle_y will be: size / 2 - y;
    */
    return new SchemeType[name.charAt(0).toUpperCase() + name.slice(1)](x - size / 2, size / 2 - y, size);
  }

  loadCoords(key: string): number[] {
    let coords = this.cookies.get(key) as string;
    return coords.split(',').map(Number);
  }

  saveCoords(key: string, cursor: Cursor): void {
    let x, y;

    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (-40, 52) on the unit circle,
    though we need to draw it on canvas, as the center of circle
    is at coords (size / 2, size / 2), so the canvas_x will be:
    size / 2 + x. If y is positive, then canvas_y will be:
    size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
    */

    x = cursor.x + cursor.canvasSize / 2
    if (cursor.y < 0) {
      y = Math.abs(cursor.y) + cursor.canvasSize / 2;
    } else {
      y = cursor.canvasSize / 2 - cursor.y;
    }
    this.cookies.set(key, Math.round(x * 100) / 100 + ',' + Math.round(y * 100) / 100);
  }
}


export class CursorInfo {
  label: string;
  color: Color;

  constructor(label: string, value: Cursor | Color, value2?: Cursor) {
    this.label = label;
    if (value2 == undefined && value instanceof Cursor) {
      this.color = (value as Cursor).color;
    } else if (value2 == undefined) { //value isn't Cursor
      this.color = value as Color;
    } else if (value instanceof Cursor) { //value2 is defined
      this.color = (value as Cursor).color.operate(Sign.Mix, value2.color)
    } else { //neither of them
      this.color = (value as Color).operate(Sign.Mix, value2.color);
    }
  }
}

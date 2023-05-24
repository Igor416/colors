const SchemeType = {
  Monochromatic, Complementary, Analogous, Compound, Triadic, Rectangle, Square
}

class SchemeService {
  constructor(isMobile, size) {
    this.cookies = new CookiesService()
    this.isMobile = isMobile;
    this.size = size;
  }

  get(name, x, y) {
    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (40, 52) on the canvas,
    though we need to perform calculations, as the center
    of the unit circle is at coords (size / 2, size / 2),
    so the circle_x will be: x - size / 2.
    circle_y will be: size / 2 - y;
    */
    this.scheme = new SchemeType[name.charAt(0).toUpperCase() + name.slice(1)](x - this.size / 2, this.size / 2 - y);
    return this.scheme
  }

  loadCoords(key) {
    let coords = this.cookies.get(key);
    return coords.split(',').map(Number);
  }

  saveCoords(key, cursor) {
    let x, y;

    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (-40, 52) on the unit circle,
    though we need to draw it on canvas, as the center of circle
    is at coords (size / 2, size / 2), so the canvas_x will be:
    size / 2 + x. If y is positive, then canvas_y will be:
    size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
    */

    x = cursor.x + this.size / 2
    if (cursor.y < 0) {
      y = Math.abs(cursor.y) + this.size / 2;
    } else {
      y = this.size / 2 - cursor.y;
    }
    this.cookies.set(key, Math.round(x * 100) / 100 + ',' + Math.round(y * 100) / 100);
  }

  getCursorsInfo() {
    //get label and color of the cursor. For details of the composition, consider using the website
    let container = document.getElementById('cursor_values');
    if (!container) {
      return []
    }
    let info = [];
    let cursors = this.scheme.cursors;
    if (cursors.length == 1) {
      //line
      container.style.gridTemplateColumns = 'auto '.repeat(5)
      let color = cursors[0].color;
      //the hue and saturation remain unchanged
      let H = color.hsl.a.value;
      let S = color.hsl.b.value

      for (let l = 90; l >= 50; l -= 20) {
        info.push(new CursorInfo(l + '%', new Color(new HSL(H, S, l))));
      }

      info.push(new CursorInfo('', new Color(new HSL(0, 0, 96)))); //background-color, simulate space between gradient and picked color
      info.push(new CursorInfo('100%', color));

    } else if (cursors.length == 2) {
      //line
      container.style.gridTemplateColumns = 'auto '.repeat(5)
      let mixed = cursors[0].color.operate(Sign.Mix, cursors[1].color)

      info.push(new CursorInfo('1', cursors[0]));
      if (this.isMobile) {
        info.push(new CursorInfo('1 & 1.2', mixed, cursors[0]));
        info.push(new CursorInfo('1 & 2', mixed));
        info.push(new CursorInfo('1.2 & 2', mixed, cursors[1]));
      } else {
        info.push(new CursorInfo('1 & 1 & 2', mixed, cursors[0]));
        info.push(new CursorInfo('1 & 2', mixed));
        info.push(new CursorInfo('1 & 2 & 2', mixed, cursors[1]));
      }
      info.push(new CursorInfo('2', cursors[1]));

    } else {
      //triangle and rectangle
      let matrix = cursors.length == 3 ? [12, 2, 23, 1, 13, 3] : [1, 12, 2, 13, 14, 24, 3, 34, 4]
      for (let el of matrix) {
        if (el > 10) {
          let scnd = el % 10;
          let frst = (el - scnd) / 10
          info.push(new CursorInfo(`${frst} & ${scnd}`, cursors[frst - 1], cursors[scnd - 1]))
        } else {
          info.push(new CursorInfo(`${el}`, cursors[el - 1]))
        }
      }
    }
    
    return info;
  }
}

class CursorInfo {
  label;
  color;

  constructor(label, value, value2) {
    this.label = label;
    if (value2 == undefined && value instanceof Cursor) {
      this.color = value.color;
    } else if (value2 == undefined) { //value isn't Cursor
      this.color = value;
    } else if (value instanceof Cursor) { //value2 is defined
      this.color = value.color.operate(Sign.Mix, value2.color)
    } else { //neither of them
      this.color = value.operate(Sign.Mix, value2.color);
    }
  }
}

const SchemeType = {
  Custom, Monochromatic, Complementary, Analogous, Compound, Triadic, Rectangle, Square
}

class SchemeService {
  constructor(isMobile, size, saturation) {
    this.cookies = new CookiesService()
    this.isMobile = isMobile;
    this.size = size;
    this.transformToReal = this.transformToReal.bind(this)
    this.transformToTrig = this.transformToTrig.bind(this)
    this.saturation = saturation
  }

  get(name, x, y) {
    [x, y] = this.transformToTrig(x, y)
    this.scheme = new SchemeType[name.charAt(0).toUpperCase() + name.slice(1)](x, y);
    return this.scheme
  }

  loadCoords(key) {
    const coords = this.cookies.get(key);
    return coords.split(',').map(Number);
  }

  saveCoords(key, cursor) {
    const [x, y] = this.transformToReal(cursor.x, cursor.y);
    this.cookies.set(key, Math.round(x * 100) / 100 + ',' + Math.round(y * 100) / 100);
  }

  transformToTrig(x, y) {
    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (40, 52) on the canvas,
    though we need to perform calculations, as the center
    of the unit circle is at coords (size / 2, size / 2),
    so the circle_x will be: x - size / 2.
    circle_y will be: size / 2 - y;
    */

    x -= this.size / 2
    y = this.size / 2 - y
    return [x, y]
  }

  transformToReal(x, y) {
    /*
    Adjust for trigonometric calculations
    E.g. the (x, y) are (-40, 52) on the unit circle,
    though we need to draw it on canvas, as the center of circle
    is at coords (size / 2, size / 2), so the canvas_x will be:
    size / 2 + x. If y is positive, then canvas_y will be:
    size / 2 - y; Else: size / 2 + |y| or size / 2 + abs(y)
    */

    x += this.size / 2
    if (y < 0) {
      y = Math.abs(y) + this.size / 2;
    } else {
      y = this.size / 2 - y;
    }
    return [x, y]
  }

  getCursorsInfo() {
    //get label and color of the cursor. For details of the composition, consider using the website
    const container = document.getElementById('cursor_values');
    if (!container) {
      return []
    }
    const info = [];
    const cursors = this.scheme.cursors;
    for (let cursor of cursors) {
      cursor.color.hsl.b.value = this.saturation
      cursor.color.update(cursor.color.hsl)
    }
    if (this.scheme.name == 'custom') {
      container.style.gridTemplateColumns = 'auto '.repeat(cursors.length)
      for (let i = 0; i < cursors.length; i++) {
        info.push(new CursorInfo(i + 1, cursors[i]))
      }
    }
    else if (cursors.length == 1) {
      //line
      container.style.gridTemplateColumns = 'auto '.repeat(5)
      const color = cursors[0].color;
      //the hue and saturation remain unchanged
      const H = color.hsl.a.value;
      const S = color.hsl.b.value

      for (let L = 90; L >= 50; L -= 20) {
        info.push(new CursorInfo(L + '%', new Color(new HSL(H, S, L))));
      }

      info.push(new CursorInfo('', new Color(new HSL(0, 0, 96)))); //background-color, simulate space between gradient and picked color
      info.push(new CursorInfo('100%', color));

    } else if (cursors.length == 2) {
      //line
      container.style.gridTemplateColumns = 'auto '.repeat(5)
      const mixed = cursors[0].color.operate(Sign.Mix, cursors[1].color)

      info.push(new CursorInfo('1', cursors[0]));
      const [mixed1, mixed2] = this.isMobile ? ['1 & 1.2', '1.2 & 2'] : ['1 & 1 & 2', '1 & 2 & 2']
      info.push(new CursorInfo(mixed1, mixed, cursors[0]));
      info.push(new CursorInfo('1 & 2', mixed));
      info.push(new CursorInfo(mixed2, mixed, cursors[1]));
      info.push(new CursorInfo('2', cursors[1]));

    } else {
      //triangle and rectangle
      const matrix = cursors.length == 3 ? [12, 2, 23, 1, 13, 3] : [1, 12, 2, 13, 14, 24, 3, 34, 4]
      for (let el of matrix) {
        if (el > 10) {
          const scnd = el % 10;
          const frst = (el - scnd) / 10
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

class Scheme {
  name = '';
  cursors = [];
  description;
  lastActive = 0;

  constructor(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.cursors.push(new Cursor(x, y))
    }
    this.description += ' Try clicking on colors.'
    this.update();
  }

  getInitials() {
    const active = this.cursors[this.lastActive];
    const c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    const offset = active.y > 0 ? 90 : 270;
    const angle = active.x == 0 ? 0 : (active.y == 0 ? Math.sign(active.x) * -90 : Math.atan(active.x / active.y) / Math.PI * 180);
    //parentheses for better reading

    return [c, angle, offset]
  }
}

class Monochromatic extends Scheme {
  name = 'monochromatic';
  description = 'Pick any color and see it\'s shadow\'s. The percentage displays the color\'s lightness, by HSL model.';

  constructor(x, y) {
    super(x, y, 1);
  }

  update() { }
}

class Complementary extends Scheme {
  name = 'complementary';
  description = 'This scheme offers two opposite colors (you can check it in our color picker!). Two colors around the middle one are the picked colors mixed in ratio 2:1 and 1:2.';

  constructor(x, y) {
    super(x, y, 2);
  }

  update() {
    this.cursors[this.lastActive ^ 1].invertCoords(this.cursors[this.lastActive]);
  }
}

class Analogous extends Scheme {
  name = 'analogous';
  description = 'The Analogous scheme provides various similar colors, that diversifies the choice from one color to six with a little different hue.';

  constructor(x, y) {
    super(x, y, 3);
  }

  update() {
    const [c, angle, offset] = this.getInitials()
    
    switch (this.lastActive) {
      case 0: {
        this.cursors[1].setCoords(c, offset + 30 - angle);
        this.cursors[2].setCoords(c, offset + 60 - angle);
        break;
      }
      case 1: {
        this.cursors[0].setCoords(c, offset - 30 - angle);
        this.cursors[2].setCoords(c, offset + 30 - angle);
        break;
      }
      case 2: {
        this.cursors[0].setCoords(c, offset - 30 - angle);
        this.cursors[1].setCoords(c, offset - 60 - angle);
        break;
      }
    }
  }
}

class Compound extends Scheme {
  name = 'compound';
  description = 'This scheme is similar to the analagous one, the only difference is that the center color was inverted, scheme is also known as "Split-Complementary".';

  constructor(x, y) {
    super(x, y, 3);
  }

  update() {
    const [c, angle, offset] = this.getInitials()

    switch (this.lastActive) {
      case 0: {
        this.cursors[1].setCoords(c, offset - 150 - angle);
        this.cursors[2].setCoords(c, offset + 60 - angle);
        break;
      }
      case 1: {
        this.cursors[0].setCoords(c, offset - 150 - angle);
        this.cursors[2].setCoords(c, offset + 150 - angle);
        break;
      }
      case 2: {
        this.cursors[1].setCoords(c, offset + 150 - angle);
        this.cursors[0].setCoords(c, offset - 60 - angle);
        break;
      }
    }
  }
}

class Triadic extends Scheme {
  name = 'triadic';
  description = 'The Triadic scheme gives 3 opposite colors. It provides visual contrast, while keeping color harmony and balance.';

  constructor(x, y) {
    super(x, y, 3);
  }

  update() {
    const [c, angle1, offset] = this.getInitials()

    const angle2 = offset - 120 - angle1;
    const angle3 = offset - 240 - angle1;
    switch (this.lastActive) {
      case 0: {
        this.cursors[2].setCoords(c, angle2);
        this.cursors[1].setCoords(c, angle3);
        break;
      }
      case 1: {
        this.cursors[0].setCoords(c, angle2);
        this.cursors[2].setCoords(c, angle3);
        break;
      }
      case 2: {
        this.cursors[1].setCoords(c, angle2);
        this.cursors[0].setCoords(c, angle3);
        break;
      }
    }
  }
}

class Rectangle extends Scheme {
  name = 'rectangle';
  description = 'This scheme is similar to the compound one, expcept for the center color, that is splited in 2. You can look at it as two pairs of opposite colors.';

  constructor(x, y) {
    super(x, y, 4);
  }

  update() {
    const [c, angle1, offset] = this.getInitials()

    const angle2 = offset - 120 - angle1;
    const angle3 = offset - 240 - angle1;
    switch (this.lastActive) {
      case 0: {
        this.cursors[1].setCoords(c, angle2);
        this.cursors[2].setCoords(c, angle2 + 180);
        break;
      }
      case 1: {
        this.cursors[0].setCoords(c, angle3);
        this.cursors[3].setCoords(c, angle3 + 180);
        break;
      }
      case 2: {
        this.cursors[0].setCoords(c, angle3 + 180);
        this.cursors[3].setCoords(c, angle3);
        break;
      }
      case 3: {
        this.cursors[1].setCoords(c, angle2 + 180);
        this.cursors[2].setCoords(c, angle2);
        break;
      }
    }
    this.cursors[3 - this.lastActive].invertCoords(this.cursors[this.lastActive]);
  }
}

class Square extends Scheme {
  name = 'square'
  description = 'The Square scheme is similar to the triadic, though there are 4 colors instead of 3. There are stil two pairs of colors, so the scheme is quite balanced.';

  constructor(x, y) {
    super(x, y, 4);
  }

  update() {
    const [c, angle1, offset] = this.getInitials();

    const angle2 = offset - 90 - angle1;
    switch (this.lastActive) {
      case 0: {
        this.cursors[1].setCoords(c, angle2);
        this.cursors[2].setCoords(c, angle2 + 180);
        break;
      }
      case 1: {
        this.cursors[0].setCoords(c, angle2 + 180);
        this.cursors[3].setCoords(c, angle2);
        break;
      }
      case 2: {
        this.cursors[0].setCoords(c, angle2);
        this.cursors[3].setCoords(c, angle2 + 180);
        break;
      }
      case 3: {
        this.cursors[1].setCoords(c, angle2 + 180);
        this.cursors[2].setCoords(c, angle2);
        break;
      }
    }
    this.cursors[3 - this.lastActive].invertCoords(this.cursors[this.lastActive]);
  }
}
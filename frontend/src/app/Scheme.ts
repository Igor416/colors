import { Cursor } from './Cursor';

export abstract class Scheme {
  name: string = '';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  start(x: number, y: number, size: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.cursors.push(new Cursor(x, y, size))
    }
    this.description += ' Try clicking on colors.'
    this.update();
  }

  getInitials(): [number, number, number] {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let offset = active.y > 0 ? 90 : 270;
    let angle = active.x == 0 ? 0 : (active.y == 0 ? Math.sign(active.x) * -90 : Math.atan(active.x / active.y) / Math.PI * 180);
    //parentheses for better reading

    return [c, angle, offset]
  }

  abstract update(): void;
}

export class Monochromatic extends Scheme {
  override name: string = 'monochromatic';
  override description: string = 'Pick any color and see it\'s shadow\'s. The percentage displays the color\'s lightness, by HSL model.';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 1);
  }

  update(): void { }
}

export class Complementary extends Scheme {
  override name: string = 'complementary';
  override description: string = 'This scheme offers two opposite colors (you can check it in our color picker!). Two colors around the middle one are the picked colors mixed in ratio 2:1 and 1:2.';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 2);
  }

  update(): void {
    this.cursors[this.lastActive ^ 1].invertCoords(this.cursors[this.lastActive]);
  }
}

export class Analogous extends Scheme {
  override name: string = 'analogous';
  override description: string = 'The Analogous scheme provides various similar colors, that diversifies the choice from one color to six with a little different hue.';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 3);
  }

  update(): void {
    let [c, angle1, offset] = this.getInitials()
    
    switch (this.lastActive) {
      case 0: {
        let angle2 = offset + 30 - angle1;
        this.cursors[1].setCoords(c, angle2);

        let angle3 = offset + 60 - angle1;
        this.cursors[2].setCoords(c, angle3);
        break;
      }
      case 1: {
        let angle2 = offset - 30 - angle1;
        this.cursors[0].setCoords(c, angle2);

        let angle3 = offset + 30 - angle1;
        this.cursors[2].setCoords(c, angle3);
        break;
      }
      case 2: {
        let angle2 = offset - 30 - angle1;
        this.cursors[0].setCoords(c, angle2);

        let angle3 = offset - 60 - angle1;
        this.cursors[1].setCoords(c, angle3);
        break;
      }
    }
  }
}

export class Compound extends Scheme {
  override name: string = 'compound';
  override description: string = 'This scheme is similar to the analagous one, the only difference is that the center color was inverted, scheme is also known as "Split-Complementary".';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 3);
  }

  update(): void {
    let [c, angle1, offset] = this.getInitials()

    switch (this.lastActive) {
      case 0: {
        let angle2 = offset - 150 - angle1;
        this.cursors[1].setCoords(c, angle2);

        let angle3 = offset + 60 - angle1;
        this.cursors[2].setCoords(c, angle3);
        break;
      }
      case 1: {
        let angle2 = offset - 150 - angle1;
        this.cursors[0].setCoords(c, angle2);

        let angle3 = offset + 150 - angle1;
        this.cursors[2].setCoords(c, angle3);
        break;
      }
      case 2: {
        let angle2 = offset + 150 - angle1;
        this.cursors[1].setCoords(c, angle2);

        let angle3 = offset - 60 - angle1;
        this.cursors[0].setCoords(c, angle3);
        break;
      }
    }
  }
}

export class Triadic extends Scheme {
  override name: string = 'triadic';
  override description: string = 'The Triadic scheme gives 3 opposite colors. It provides visual contrast, while keeping color harmony and balance.';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 3);
  }

  update(): void {
    let [c, angle1, offset] = this.getInitials()

    let angle2 = offset - 120 - angle1;
    let angle3 = offset - 240 - angle1;
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

export class Rectangle extends Scheme {
  override name: string = 'rectangle';
  override description: string = 'This scheme is similar to the compound one, expcept for the center color, that is splited in 2. You can look at it as two pairs of opposite colors.';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 4);
  }

  update(): void {
    let [c, angle1, offset] = this.getInitials()

    let angle2 = offset - 120 - angle1;
    let angle3 = offset - 240 - angle1;
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

export class Square extends Scheme {
  override name: string = 'square'
  override description: string = 'The Square scheme is similar to the triadic, though there are 4 colors instead of 3. There are stil two pairs of colors, so the scheme is quite balanced.';

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 4);
  }

  update(): void {
    let [c, angle1, offset] = this.getInitials();

    let angle2 = offset - 90 - angle1;
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
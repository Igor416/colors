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
    this.update();
  }

  getInitials(): [number, number, number] {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle = getAngle(active),
        offset = getOffset(active);

    return [c, angle, offset]
  }

  abstract update(): void;
}

export class Monochromatic extends Scheme {
  name: string = 'monochromatic';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 1);
  }

  update(): void { }
}

export class Complementary extends Scheme {
  name: string = 'complementary';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 2);
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    this.cursors[this.lastActive ^ 1].updateCoords(-active.x, -active.y);
  }
}

export class Analogous extends Scheme {
  name: string = 'analogous';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

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
  name: string = 'compound';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 3);
  }

  update(): void {
    let [c, angle1, offset] = this.getInitials()

    let x, y;
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
  name: string = 'triadic';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

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
  name: string = 'rectangle';
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 4);
  }

  update(): void {
    let active = this.cursors[this.lastActive];
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
    this.cursors[3 - this.lastActive].updateCoords(-active.x, -active.y);
  }
}

export class Square extends Scheme {
  name: string = 'square'
  cursors: Cursor[] = [];
  description!: string;
  lastActive: number = 0;

  constructor(x: number, y: number, size: number) {
    super();
    this.start(x, y, size, 4);
  }

  update(): void {
    let active = this.cursors[this.lastActive];
    let c = Math.sqrt(Math.pow(active.x, 2) + Math.pow(active.y, 2));
    let angle1 = getAngle(active),
        offset = getOffset(active);

    let x, y;
    let angle2 = offset - 90 - angle1;
    x = c * Math.cos(angle2 * Math.PI / 180);
    y = c * Math.sin(angle2 * Math.PI / 180);
    switch (this.lastActive) {
      case 0: {
        this.cursors[1].updateCoords(x, y);
        this.cursors[2].updateCoords(-x, -y);
        break;
      }
      case 1: {
        this.cursors[0].updateCoords(-x, -y);
        this.cursors[3].updateCoords(x, y);
        break;
      }
      case 2: {
        this.cursors[0].updateCoords(x, y);
        this.cursors[3].updateCoords(-x, -y);
        break;
      }
      case 3: {
        this.cursors[1].updateCoords(-x, -y);
        this.cursors[2].updateCoords(x, y);
        break;
      }
    }
    this.cursors[3 - this.lastActive].updateCoords(-active.x, -active.y);
  }
}

function getOffset(cursor: Cursor): number {
  if (cursor.y > 0) {
    return 90;
  }
  return 270;
}

function getAngle(cursor: Cursor) {
  if (cursor.x == 0) {
    return 0
  } else if (cursor.y == 0) {
    return Math.sign(cursor.x) * -90;
  }
  return Math.atan(cursor.x / cursor.y) / Math.PI * 180;
}
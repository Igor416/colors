import { Color } from './Color';

export class Cursor {
  x!: number;
  y!: number;
  canvasSize!: number;
  radius: number = 6; //for displaying
  color!: Color;

  constructor (x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.canvasSize = size;
  }

  setCoords(c: number, angle: number) {
    this.x = c * Math.cos(angle * Math.PI / 180);
    this.y = c * Math.sin(angle * Math.PI / 180);
  }

  invertCoords(initial: Cursor) {
    this.x = -initial.x
    this.y = -initial.y
  }
}
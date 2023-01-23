import { Color } from './Color';

export class Cursor {
  x!: number;
  y!: number;
  canvasSize!: number;
  radius!: number;
  color!: Color;

  constructor (x: number, y: number, size: number) {
    const radius = 6; //for displaying
    this.updateCoords(x, y);
    this.canvasSize = size;
    this.radius = radius;
  }

  updateCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setCoords(c: number, angle: number) {
    this.x = c * Math.cos(angle * Math.PI / 180);
    this.y = c * Math.sin(angle * Math.PI / 180);
  }
}
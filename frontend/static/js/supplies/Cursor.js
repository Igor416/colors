class Cursor {
  x;
  y;
  color;

  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  setCoords(c, angle) {
    this.x = c * Math.cos(angle * Math.PI / 180);
    this.y = c * Math.sin(angle * Math.PI / 180);
  }

  invertCoords(cursor) {
    this.x = -cursor.x
    this.y = -cursor.y
  }
}
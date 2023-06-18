class Canvas {
  size
  centerColor
  container
  wheel
  cursors

  constructor(size, centerColor, cursors, isActive, transform) {
    this.size = size;
    this.centerColor = centerColor;
    this.container = document.getElementById('canvas_container_' + centerColor);
    this.container.style.width = this.container.style.height = this.size + 'px';
    this.isActive = isActive;
    this.container.appendChild(this.drawWheel())
    this.container.appendChild(this.drawCursors())
    this.updateCursors(cursors, transform)
  }

  drawWheel() {
    //https://stackoverflow.com/questions/46214072/color-wheel-picker-canvas-javascript
    const degToRad = (deg) => (deg * (Math.PI / 180));

    this.wheel = document.createElement('canvas');
    this.wheel.width = this.wheel.height = this.size;
    this.wheel.style.position = 'absolute';

    // Initiate variables
    let angle = 0;
    let pivotPointer = 0;
    const hexCode = [255, 0, 0];
    const colorOffsetByDegree = 4.322;
    const radius = this.size / 2;
    const context = this.getWheelContext();

    // For each degree in circle, perform operation
    while (angle <= 360) {
      // find index immediately before our pivot
      const pivotPointerbefore = (pivotPointer + 2) % 3;

      // Modify colors
      if (hexCode[pivotPointer] < 255) {
        // If main points isn't full, add to main pointer
        if (hexCode[pivotPointer] + colorOffsetByDegree > 255) {
          hexCode[pivotPointer] = 255;
        } else {
          hexCode[pivotPointer] += colorOffsetByDegree;
        }
      } else if (hexCode[pivotPointerbefore] > 0) {
        // If color before main isn't zero, subtract
        if (hexCode[pivotPointerbefore] > colorOffsetByDegree) {
          hexCode[pivotPointerbefore] -= colorOffsetByDegree
        } else {
          hexCode[pivotPointerbefore] = 0;
        }
      } else if (hexCode[pivotPointer] >= 255) {
        // If main color is full, move pivot
        hexCode[pivotPointer] = 255;
        pivotPointer = (pivotPointer + 1) % 3;
      }
      const rgb = `rgb(${hexCode.map(h => Math.floor(h)).join(', ')})`;
      const grad = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
      grad.addColorStop(0, this.centerColor);
      grad.addColorStop(1, rgb);
      context.fillStyle = grad;

      // draw circle portion
      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      context.moveTo(radius, radius);
      context.arc(radius, radius, radius, degToRad(angle), 2 * Math.PI);
      context.closePath();
      context.fill();

      angle++;
    }

    return this.wheel
  }

  saturateWheel(percentage) {
    this.container.style.filter = `grayscale(${percentage / 100})`
  }

  drawCursors() {
    this.cursors = document.createElement('canvas')
    this.cursors.id = this.centerColor
    this.cursors.width = this.cursors.height = this.size;
    this.cursors.style.position = 'absolute';
    return this.cursors
  }

  updateCursors(cursors, transform) {
    const ctx = this.getCursorsContext();
    ctx.clearRect(0, 0, this.size, this.size)
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 3;
    for (let cursor of cursors) {
      cursor.radius = this.isActive ? 15 : 12
      ctx.beginPath();
      const [x, y] = transform(cursor.x, cursor.y)
      if (this.isActive) {
        cursor.color = this.getColor(x, y);
      }
      ctx.arc(x, y, cursor.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = this.centerColor == 'black' ? 'white' : 'black';
      ctx.stroke();
      ctx.closePath();
    }
  }

  getColor(x, y) {
    const ctx = this.getWheelContext(this.wheel);
    const data = ctx.getImageData(x, y, 1, 1);
    const rgb = data.data.slice(0, 3);
    return new Color(new RGB(rgb[0], rgb[1], rgb[2]));
  }

  getWheelContext() {
    return this.wheel.getContext('2d', { willReadFrequently: true });
  }

  getCursorsContext() {
    return this.cursors.getContext('2d', { willReadFrequently: true });
  }
}
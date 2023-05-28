class PrimitiveType {
  constructor(value, max, min) {
    this.value = value;
    this.max = max;
    this.min = min;
    this.handle()
  }

  toString() {
    return this.value.toString();
  }
}

class Integer extends PrimitiveType {
  constructor(value, max, min = 0) {
    super(value, max, min);
  }

  handle() {
    if (this.value == null) {
      this.value = 0;
    } else {
      if (this.value > this.max) {
        this.value = this.max;
      } else if (this.value < this.min) {
        this.value = this.min;
      }
    }
  }

  Add(int) {
    let value = this.value + int.value;
    if (value > this.max) {
      value -= this.max;
    }
    if (value != 0 && value % this.max == 0) {
      value = this.max
    }
    return new Integer(value, this.max);
  }

  Sub(int) {
    let value = this.value - int.value;
    if (value < this.min) {
      value = this.max - Math.abs(value);
    }
    if (value != 0 && value % this.max == 0) {
      value = this.max
    }
    return new Integer(value, this.max);
  }

  Mix(int) {
    return new Integer(Math.round((this.value + int.value) / 2), this.max);
  }
}

class String extends PrimitiveType {
  constructor(value, max = 255, min = 0) {
    super(value, max, min);
  }

  handle() {
    const regex = new RegExp('([A-Fa-f0-9]{1}|[A-Fa-f0-9]{2})');
    if (!this.value.match(regex)) {
      this.value = '0';
    } else {
      if (parseInt(this.value, 16) > this.max) {
        this.value = this.max.toString(16);
      } else if (parseInt(this.value, 16) < this.min) {
        this.value = this.min.toString(16);
      }
    }
  }
}

export abstract class PrimitiveType {
  max!: number;
  min!: number;
  value!: number | string;

  abstract handle(): void;
  abstract eq(int: PrimitiveType): boolean;
  toString(): string {
    return this.value.toString();
  }
}

export class Integer extends PrimitiveType {
  max: number;
  min: number;
  value: number;

  constructor(value: number, max: number, min = 0) {
    super()
    this.max = max;
    this.min = min;
    if (value > max) {
      this.value = max;
    } else if (value < min) {
      this.value = min;
    } else {
      this.value = value;
    }
  }

  handle(): void {
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

  Add(int: Integer): Integer {
    let value = this.value + int.value;
    if (value > this.max) {
      value -= this.max;
    }
    if (value != 0 && value % this.max == 0) {
      value = this.max
    }
    return new Integer(value, this.max);
  }

  Sub(int: Integer): Integer {
    let value = this.value - int.value;
    if (value < this.min) {
      value = Math.abs(value);
    }
    if (value != 0 && value % this.max == 0) {
      value = this.max
    }
    return new Integer(value, this.max);
  }

  Mix(int: Integer): Integer {
    let value = Math.round((this.value + int.value) / 2);
    return new Integer(value, this.max);
  }

  eq(int: Integer): boolean {
    int = int as Integer;
    if (this.value == int.value) {
      return true;
    }
    return false;
  }
}

export class String extends PrimitiveType {
  max: number;
  min: number;
  value: string;

  constructor(value: string, max = 255, min = 0) {
    super()
    this.max = max;
    this.min = min;
    if (parseInt(value, 16) > max) {
      this.value = max.toString(16);
    } else if (parseInt(value, 16) < min) {
      this.value = min.toString(16);
    } else {
      this.value = value;
    }
  }

  handle(): void {
    let regex = new RegExp('([A-Fa-f0-9]{1}|[A-Fa-f0-9]{2})');
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

  eq(str: String): boolean {
    if (parseInt(this.value, 16) == parseInt(str.value, 16)) {
      return true;
    }
    return false;
  }
}

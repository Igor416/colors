class FieldService {
  constructor(name, isPassword=false, original=null) {
    this.name = name;
    this.value = undefined;
    this.isPassword = isPassword;
    this.original = original;
    this.error = '';
  }

  validate() {
    this.error = '';
    if (this.value == undefined) {
      return;
    }

    const passwordMinLen = 6;
    if (this.value == '') {
      this.error = 'Empty field.';
    }
    else if (this.value.includes(' ')) {
      this.error = `Invalid symbol occured (space).`;
    }
    else if (this.isPassword && this.value.length < passwordMinLen) {
      this.error = `Min. length is ${passwordMinLen}.`;
    }
    else if (this.original != null && this.value != this.original.value) {
      this.error = `Passwords don't match.`;
    }
  }

  isValid() {
    return this.value != undefined && this.error == '';
  }
}
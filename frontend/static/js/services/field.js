class FieldService {
  constructor(value='', isPassword=false, original=null) {
    this.value = value
    this.isPassword = isPassword
    this.original = original
    this.error = ''
  }

  validate() {
    const passwordMinLen = 6;

    if (this.value != undefined) {
      if (this.value == '') {
        this.error = 'Empty field.';
        return;
      }
      if (this.value.includes(' ')) {
        this.error = `Invalid symbol occured (space).`;
        return;
      }
      if (this.isPassword && this.value.length < passwordMinLen) {
        this.error = `Min. length is ${passwordMinLen}.`;
        return;
      }
      if (this.original != null) {
        if (this.value != this.original.value) {
          this.error = `Passwords don't match.`;
          return;
        }
      }
    }
    this.error = '';
  }

  isValid() {
    return this.value != undefined && this.error == '';
  }
}
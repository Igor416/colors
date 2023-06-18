class SignInComponent extends FormComponent {
  constructor() {
    super()
    this.name = new FieldService('name')
    this.password2 = new FieldService('password2', true, this.password)
    this.password.original = this.password2
  }

  render() {
    return (`
    <form id="sign_in" class="box whitesmoke d-flex flex-column justify-content-between align-items-center text-center">
      <span id="title">Sign Up</span>
      <div id="inputs" class="d-flex flex-column">
        ${this.renderInput(
          this.name,
          'Make up a login',
        )}
        ${this.renderInput(
          this.email,
          'Your email',
          'username',
          `<a href="/log_in" class="redirect h5"><span>Already have an account?</span></a>`
        )}
        ${this.renderInput(
          this.password,
          'Make up a password',
          'new-password'
        )}
        ${this.renderInput(
          this.password2,
          'Type in your password',
          'new-password'
        )}
        <div id="remember_me_container">
          ${this.remember_me.render()}
        </div>
      </div>
      <input id="submit" type="submit" value="Sign Up" class="form-control transition h2">
    </form>
    `)
  }

  update(event) {
    super.update(event)
    const field = this[event.srcElement.name]
    let otherField
    if (field == this.password) {
      otherField = this.password2;
    } else if (field == this.password2) {
      otherField = this.password;
    }
    
    if (otherField) {
      this.updateField(otherField)
    }
  }

  sendForm = (event) =>  {
    event.preventDefault()
    const data = {
      'name': this.name.value,
      'email': this.email.value,
      'password': this.password.value,
      'password2': this.password2.value,
      'remember_me': this.remember_me.value
    };
    
    if (this.name.value && this.email.value && this.password.value && this.password2.value) {
      this.auth.signup(data).then(data => {
        window.location.reload();
      }).catch((e) => this.auth.displayError(e));
    }
  }
}

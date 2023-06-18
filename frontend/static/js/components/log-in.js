class LogInComponent extends FormComponent {
  render() {
    return (`
    <form id="log_in" class="box whitesmoke d-flex flex-column justify-content-between align-items-center text-center">
      <span id="title">Log in</span>
      <div id="inputs" class="d-flex flex-column">
        ${this.renderInput(
          this.email,
          'Your email',
          'username',
          `<a href="/sign_in" class="redirect h5"><span>Don't have an account?</span></a>`
        )}
        ${this.renderInput(
          this.password,
          'Your password',
          'current-password'
        )}
        <div id="remember_me_container">
          ${this.remember_me.render()}
        </div>
      </div>
      <input id="submit" type="submit" value="Log In" class="form-control transition h2">
    </form>
    `)
  }

  sendForm = (event) =>  {
    event.preventDefault()
    const data = {
      'email': this.email.value,
      'password': this.password.value,
      'remember_me': this.remember_me.value
    };
    
    if (this.email.value && this.password.value) {
      this.auth.login(data).then(data => {
        window.location.reload();
      }).catch((e) => this.auth.displayError(e));
    }
  }
}

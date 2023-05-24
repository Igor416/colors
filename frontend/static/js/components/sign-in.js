class SignInComponent {
  constructor() {
    this.auth = new AuthService()
    if (this.auth.isAuth()) {
      window.history.back()
    }
    this.name = new FieldService()
    this.email = new FieldService()
    this.password = new FieldService('', true)
    this.password2 = new FieldService('', true, this.password)
    this.password.original = this.password2
    this.remember_me = new RememberMeComponent()
  }

  render() {
    return (`
    <form id="sign_in" class="box whitesmoke d-flex flex-column justify-content-between align-items-center text-center">
      <span id="title">Log in</span>
      <div id="inputs" class="d-flex flex-column">
        <div class="position-relative d-flex flex-column field text-start">
          <label id="name_label" for="name_input">${this.name.error}</label>
          <div id="name" class="d-flex flex-column justify-content-center text-start input valid">
            <input
              type="text"
              id="name_input"
              placeholder="Make up a login"
              class="form-control transition"
              value="${this.name.value}">
          </div>
        </div>
        <div class="position-relative d-flex flex-column field text-start">
          <label id="email_label" for="email_input">${this.email.error}</label>
          <div id="email" class="d-flex flex-column justify-content-center text-start input valid">
            <input
              type="email"
              id="email_input"
              placeholder="Your email"
              class="form-control transition"
              value="${this.email.value}"
              autocomplete="username">
            <a href="/log_in" class="redirect">
              <span>Already have an account?</span>
            </a>
          </div>
        </div>
        <div class="position-relative d-flex flex-column field text-start">
          <label id="password_label" for="password_input">${this.password.error}</label>
          <div id="password" class="d-flex flex-column justify-content-center text-start input valid">
            <input
              type="password"
              id="password_input"
              placeholder="Make up a password"
              class="form-control transition"
              value="${this.password.value}"
              autocomplete="new-password">
          </div>
        </div>
        <div class="position-relative d-flex flex-column field text-start">
          <label id="password2_label" for="password2_input">${this.password2.error}</label>
          <div id="password2" class="d-flex flex-column justify-content-center text-start input valid">
            <input
              type="password"
              id="password2_input"
              placeholder="Type in your password"
              class="form-control transition"
              value="${this.password.value}"
              autocomplete="new-password">
          </div>
        </div>
        <div id="remember_me_container">
          ${this.remember_me.render()}
        </div>
      </div>
      <input id="submit" type="submit" value="Sign Up" class="form-control transition">
    </form>
    `)
  }

  init() {
    this.setStaticEventListeners()
    this.setDynamicEventListeners()
  }

  setStaticEventListeners() {
    this.check = this.check.bind(this)
    this.sendForm = this.sendForm.bind(this)
    document.getElementById('submit').addEventListener('click', this.sendForm)
    this.update = this.update.bind(this)
    Array.from(document.getElementById('inputs').getElementsByTagName('input')).forEach(el => el.addEventListener('input', this.update))
  }

  setDynamicEventListeners() {
    document.getElementById('checkbox').addEventListener('click', this.check)
  }

  check() {
    this.remember_me.value = !this.remember_me.value;
    document.getElementById('remember_me_container').innerHTML = this.remember_me.render()
    this.setDynamicEventListeners()
  }

  update(event) {
    let field = this[event.srcElement.name]
    field.value = event.srcElement.value
    field.validate()
    document.getElementById(event.srcElement.name + '_label').innerHTML = field.error
    let container = document.getElementById(event.srcElement.name)
    if (field.error) {
      container.classList.remove('valid')
      container.classList.add('invalid')
    } else {
      container.classList.remove('invalid')
      container.classList.add('valid')
    }
    let otherField, otherName;
    if (field == this.password) {
      [otherField, otherName] = [this.password2, 'password2'];
    } else if (field == this.password2) {
      [otherField, otherName] = [this.password, 'password'];
    }
    if (otherField) {
      otherField.validate()
      document.getElementById(otherName + '_label').innerHTML = otherField.error
      let container = document.getElementById(otherName)
      if (otherField.error) {
        container.classList.remove('valid')
        container.classList.add('invalid')
      } else {
        container.classList.remove('invalid')
        container.classList.add('valid')
      }
    }
  }

  sendForm(event) {
    event.preventDefault()
    let data = {
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

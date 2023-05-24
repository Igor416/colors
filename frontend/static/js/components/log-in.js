class LogInComponent {
  constructor() {
    this.auth = new AuthService()
    if (this.auth.isAuth()) {
      window.history.back()
    }
    this.email = new FieldService()
    this.password = new FieldService('', true)
    this.remember_me = new RememberMeComponent()
  }

  render() {
    return (`
    <form id="log_in" class="box whitesmoke d-flex flex-column justify-content-between align-items-center text-center">
      <span id="title">Log in</span>
      <div id="inputs" class="d-flex flex-column">
        <div class="position-relative d-flex flex-column field text-start">
          <label id="email_label" for="email">${this.email.error}</label>
          <div id="email" class="d-flex flex-column justify-content-center text-start input valid">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              class="form-control transition"
              value="${this.email.value}"
              autocomplete="username">
            <a href="/sign_in" class="redirect">
              <span>Don't have an account?</span>
            </a>
          </div>
        </div>
        <div class="position-relative d-flex flex-column field text-start">
          <label id="password_label" for="password">${this.password.error}</label>
          <div id="password" class="d-flex flex-column justify-content-center text-start input valid">
            <input
              type="password"
              name="password"
              placeholder="Your password"
              class="form-control transition"
              value="${this.password.value}"
              autocomplete="current-password">
          </div>
        </div>
        <div id="remember_me_container">
          ${this.remember_me.render()}
        </div>
      </div>
      <input id="submit" type="submit" value="Log In" class="form-control transition">
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
  }

  sendForm(event) {
    event.preventDefault()
    let data = {
      'email': this.email.value,
      'password': this.password.value,
      'remember_me': this.remember_me.value
    };
    
    if (this.email.value && this.password.value) {
      this.auth.login(data).then(data => {
        this.auth.setAuth(true, this.remember_me);
        window.location.href = (`/profile`);
      }).catch((e) => this.auth.displayErrors(e));
    }
  }
}

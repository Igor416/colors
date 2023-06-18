class FormComponent extends Component {
  constructor() {
    super()
    this.auth = new AuthService()
    if (this.auth.isAuth()) {
      window.history.back()
    }
    this.email = new FieldService('email')
    this.password = new FieldService('password', true)
    this.remember_me = new RememberMeComponent()
  }

  renderInput(field, placeholder, autocomplete=undefined, href=undefined) {
    return `<div class="position-relative d-flex flex-column field h4 text-start">
      <label id="${field.name}_label" class="h4" for="${field.name}_input">${field.error}</label>
      <div id="${field.name}" class="d-flex flex-column justify-content-center text-start input">
        <span class="d-flex flex-nowrap align-items-center valid">
          <input
            type="${field.isPassword}"
            id="${field.name}_input"
            name="${field.name}"
            placeholder="${placeholder}"
            class="form-control transition"
            ${autocomplete ? `autocomplete="${autocomplete}"` : ''}>
          </span>
        ${this.renderIf(href, href)}
      </div>
    </div>`
  }

  setStaticEventListeners() {
    this.listenOne('submit', this.sendForm)
    this.update = this.update.bind(this)
    this.listenMany('form-control', this.update, 'input')
  }

  setDynamicEventListeners() {
    this.listenOne('checkbox', this.check)
  }

  check = () => {
    this.remember_me.value = !this.remember_me.value;
    document.getElementById('remember_me_container').innerHTML = this.remember_me.render()
    this.setDynamicEventListeners()
  }

  update(event) {
    const field = this[event.srcElement.name]
    field.value = event.srcElement.value
    this.updateField(field)
  }

  updateField(field) {
    field.validate()
    document.getElementById(field.name + '_label').innerHTML = field.error
    const container = document.getElementById(field.name).firstElementChild
    container.classList.replace.apply(container.classList, field.error ? ['valid', 'invalid'] : ['invalid', 'valid']);
  }
}
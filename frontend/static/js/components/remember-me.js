class RememberMeComponent {
  constructor(value=true) {
    this.value = value
  }

  render() {
    return (`
      <div id="remember_me" class="d-flex justify-content-between align-items-center text-start">
        <label id="label" for="remember_me">${this.value ? 'Remember me for 3 days' : 'Expire in 1 hour'}</label>
        <input id="checkbox" type="checkbox" name="remember_me" ${this.value ? 'checked' : ''}>
      </div>
    `)
  }
}

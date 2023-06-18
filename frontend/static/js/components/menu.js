class MenuComponent extends Component {
  hrefs = [];

  constructor() {
    super()
    this.auth = new AuthService()
    this.signedIn = this.auth.isAuth();

    const names = ['schemes', 'picker', 'calculator', 'trends', 'models']
    const links = ['schemes/analogous', 'picker', 'calculator', 'trends/years', 'models']

    names.forEach((_, i) => {
      this.hrefs.push({
        name: names[i],
        link: links[i]
      })
    });
  }

  render() {
    return (`
    <div id="menu" class="d-flex flex-column justify-content-between bg-white p-5">
      <div id="logo" class="d-flex h1">
        <span>Colors</span>
        <img class="ms-3" src="/static/assets/favicon.png" alt="logo">
      </div>
      <div id="hrefs" class="d-flex flex-column">
        ${this.hrefs.map((href) => {return `<a
          id="${href.name}_link"
          class="transition href h4 d-flex align-items-center justify-content-between"
          href="/${href.link}">
          <span class="transition">${href.name}</span>
        </a>`}).join('')}
      </div>
      <div id="links" class="d-flex flex-column">
        <a
          id="home"
          class="transition href h4 d-flex align-items-center text-nowrap"
          href="/">
          <i class="fa fa-home"></i>
          &nbsp;
          <span class="transition text-nowrap">home</span>
        </a>
        ${this.renderIf(
          this.signedIn,
          `<a
            id="profile"
            class="transition href h4 d-flex flex-nowrap align-items-center text-nowrap"
            href="/">
            <i class="fa fa-user"></i>
            &nbsp;
            <span class="transition text-nowrap">profile</span>
          </a>
          <div
            id="exit"
            class="transition href h4 d-flex flex-nowrap align-items-center text-nowrap">
            <i class="fas fa-sign-out-alt"></i>
            &nbsp;
            <span class="transition text-nowrap">exit</span>
          </div>`,
          `<a
            id="log_in"
            class="transition href h4 d-flex flex-nowrap align-items-center text-nowrap"
            href="/log_in">
            <i class="fas fa-sign-in-alt"></i>
            &nbsp;
            <span class="transition text-nowrap">log in</span>
          </a>
          <a
            id="sign_in"
            class="transition href h4 d-flex flex-nowrap align-items-center text-nowrap"
            href="/sign_in">
            <i class="fas fa-sign-in-alt"></i>
            &nbsp;
            <span class="transition">sign up</span>
          </a>`
        )}
      </div>
    </div>
    `)
  }
}

class MenuComponent {
  hrefs = [];

  constructor() {
    this.auth = new AuthService()
    this.signedIn = this.auth.isAuth();
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches

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
    if (this.isMobile) {
      return (`
        <div id="menu_mobile" class="bg-white">
          <div id="row" class="d-flex justify-content-between">
            <div id="link_icons" class="d-flex justify-content-start">
              <a
                id="home"
                class="transition row_href d-flex align-items-center justify-content-between px-3"
                href="/">
                <span class="transition"><i class="fa fa-home"></i></span>
              </a>
              ${this.signedIn ? 
              `<a
                id="profile"
                class="transition row_href d-flex align-items-center justify-content-between px-3"
                href="/">
                <span class="transition"><i class="fa fa-user"></i></span>
              </a>
              <div
                id="exit"
                class="transition row_href d-flex align-items-center justify-content-between px-3">
                <span class="transition"><i class="fas fa-sign-out-alt"></i></span>
              </div>` :
              `<a
                id="log_in"
                class="transition row_href d-flex align-items-center justify-content-between px-3"
                href="/log_in">
                <span class="transition"><i class="fas fa-sign-in-alt"></i></span>
              </a>`}
            </div>
            <div class="transition d-flex align-items-center justify-content-between px-3" id="times">
              <span class="transition"><i class="fas fa-bars"></i></span>
            </div>
          </div>
          <div class="position-fixed transition d-flex flex-column justify-content-between" id="column">
            <div class="flex-column align-items-center">
              ${this.hrefs.map((href) => {return `<a
                id="${href.name}_link"
                class="transition column_href d-flex align-items-center justify-content-between px-5 h4"
                href="/${href.link}">
                <span class="transition">${href.name}</span>
              </a>`}).join('')}
            </div>
            <div class="flex-column align-items-center">
              <a
                id="home"
                class="transition column_href d-flex align-items-center justify-content-between px-5 h4"
                href="/">
                <span class="transition">home&nbsp;<i class="fa fa-home"></i></span>
              </a>
              ${this.signedIn ?
              `<a
                id="profile"
                class="transition column_href d-flex align-items-center justify-content-between px-5 h4"
                href="/">
                <span class="transition">profile&nbsp;<i class="fa fa-user"></i></span>
              </a>
              <div
                id="exit"
                class="transition column_href d-flex align-items-center justify-content-between px-5 h4">
                <span class="transition">exit&nbsp;<i class="fas fa-sign-out-alt"></i></span>
              </div>` :
              `<a
                id="log_in"
                class="transition column_href d-flex align-items-center justify-content-between px-5 h4"
                href="/log_in">
                <span class="transition">log in&nbsp;<i class="fas fa-sign-in-alt"></i></span>
              </a>
              <a
                id="sign_in"
                class="transition column_href d-flex align-items-center justify-content-between px-5 h4"
                href="/sign_in">
                <span class="transition">sign up&nbsp;<i class="fas fa-sign-in-alt"></i></span>
              </a>`}
            </div>
          </div>
        </div>
      `)
    }
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
          ${this.signedIn ?
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
          </div>` :
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
          </a>`}
        </div>
      </div>
    `)
  }

  init() {
    this.setStaticEventListeners()
    if (this.isMobile) {
      const menu = document.getElementById("menu_mobile")
      this.opener = document.getElementById('times').firstElementChild.firstElementChild
      this.column = menu.children[1];
      this.opened = false;
      this.closeMenu();
    }
  }

  setStaticEventListeners() {
    this.toggleMenu = this.toggleMenu.bind(this)
    this.exit = this.exit.bind(this)
    document.getElementById('times')?.addEventListener('click', this.toggleMenu)
    document.getElementById('exit')?.addEventListener('click', this.exit)
  }

  exit() {
    this.toggleMenu()
    this.auth.logout().then(resp => {
      window.location.reload();
    }).catch((e) => this.auth.displayError(e));
  }

  toggleMenu() {
    this.opened ? this.closeMenu() : this.openMenu()
    this.opened = !this.opened
  }

  openMenu() {
    if (this.isMobile) {
      this.column.style.height = "100%";
      this.column.style.padding = "10vh 0";
      this.opener.classList.remove('fa-bars')
      this.opener.classList.add('fa-times')

      for (let i = 0; i < this.column.children.length; i++) {
        this.column.children[i].style.display = "flex"
      }
    }
  }

  closeMenu() {
    if (this.isMobile) {
      this.column.style.height = "0%";
      this.column.style.padding = "0";
      this.opener.classList.remove('fa-times')
      this.opener.classList.add('fa-bars')
  
      for (let i = 0; i < this.column.children.length; i++) {
        this.column.children[i].style.display = "none"
      }
    }
  }
}

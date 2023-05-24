class MenuComponent {
  hrefs = [];

  constructor() {
    this.auth = new AuthService()
    this.signedIn = this.auth.isAuth();
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches

    let names = ['schemes', 'picker', 'calculator', 'trends', 'models']
    let links = ['schemes/analogous', 'picker', 'calculator', 'trends/years', 'models']

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
        <div id="menu_mobile">
          <div id="row" class="d-flex justify-content-between">
            <div id="link_icons" class="justify-content-start">
              <a
                id="home"
                class="transition row_href"
                href="/">
                <span class="transition"><i class="fa fa-home"></i></span>
              </a>
              ${this.signedIn ? 
              `<a
                id="profile"
                class="transition row_href"
                href="/profile">
                <span class="transition"><i class="fa fa-user"></i></span>
              </a>
              <div
                id="exit"
                class="transition row_href">
                <span class="transition"><i class="fas fa-sign-out-alt"></i></span>
              </div>` :
              `<a
                id="log_in"
                class="transition row_href"
                href="/log_in">
                <span class="transition"><i class="fas fa-sign-in-alt"></i></span>
              </a>`}
            </div>
            <div class="transition" id="times">
              <span class="transition"><i class="fas ${this.opened ? 'fa-times' : 'fa-bars' }"></i></span>
            </div>
          </div>
          <div class="transition d-flex flex-column justify-content-between" id="column">
            <div id="column_hrefs" class="flex-column align-items-center">
              ${this.hrefs.map((href) => {return `<a
                id="${href.name}_link"
                class="transition column_href"
                href="/${href.link}">
                <span class="transition">${href.name}</span>
              </a>`}).join('')}
            </div>
            <div id="column_links" class="flex-column align-items-center">
              <a
                id="home"
                class="transition column_href"
                href="/">
                <span class="transition">home&nbsp;<i class="fa fa-home"></i></span>
              </a>
              ${this.signedIn ?
              `<a
                id="profile"
                class="transition column_href"
                href="/profile">
                <span class="transition">profile&nbsp;<i class="fa fa-user"></i></span>
              </a>
              <div
                id="exit"
                class="transition column_href">
                <span class="transition">exit&nbsp;<i class="fas fa-sign-out-alt"></i></span>
              </div>` :
              `<a
                id="log_in"
                class="transition column_href"
                href="/log_in">
                <span class="transition">log in&nbsp;<i class="fas fa-sign-in-alt"></i></span>
              </a>
              <a
                id="sign_in"
                class="transition column_href"
                href="/sign_in">
                <span class="transition">sign up&nbsp;<i class="fas fa-sign-in-alt"></i></span>
              </a>`}
            </div>
          </div>
        </div>
      `)
    }
    return (`
      <div id="menu" class="d-flex flex-column justify-content-between p-5">
        <div id="logo" class="d-flex h1">
          <span>Colors</span>
          <img class="ms-3" src="/static/assets/favicon.png" alt="logo">
        </div>
        <div id="hrefs" class="d-flex flex-column">
          ${this.hrefs.map((href) => {return `<a
            id="${href.name}_link"
            class="transition href d-flex align-items-center justify-content-between"
            href="/${href.link}">
            <span class="transition">${href.name}</span>
          </a>`}).join('')}
        </div>
        <div id="links" class="d-flex flex-column">
          <a
            id="home"
            class="transition href d-flex align-items-center justify-content-between"
            href="/">
            <span class="transition">home&nbsp;<i class="fa fa-home"></i></span>
          </a>
          ${this.signedIn ?
          `<a
            id="profile"
            class="transition href d-flex align-items-center justify-content-between"
            href="/profile">
            <span class="transition">profile&nbsp;<i class="fa fa-user"></i></span>
          </a>
          <div
            id="exit"
            class="transition href d-flex align-items-center justify-content-between">
            <span class="transition">exit&nbsp;<i class="fas fa-sign-out-alt"></i></span>
          </div>` :
          `<a
            id="log_in"
            class="transition href d-flex align-items-center justify-content-between"
            href="/log_in">
            <span class="transition">log in&nbsp;<i class="fas fa-sign-in-alt"></i></span>
          </a>
          <a
            id="sign_in"
            class="transition href d-flex align-items-center justify-content-between"
            href="/sign_in">
            <span class="transition">sign up&nbsp;<i class="fas fa-sign-in-alt"></i></span>
          </a>`}
        </div>
      </div>
    `)
  }

  init() {
    this.setStaticEventListeners()
    if (this.isMobile) {
      let menu = document.getElementById("menu_mobile")
      this.row = menu.children[0].children[0];
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
    this.auth.logout().subscribe({
      next: (resp) => {
        this.auth.setAuth(false)
        window.location.href = `/`;
      },
      error: (e) => {
        this.auth.displayErrors(e);
      }
    });
  }

  toggleMenu() {
    this.opened ? this.closeMenu() : this.openMenu()
    this.opened = !this.opened
  }

  openMenu() {
    if (this.isMobile) {
      this.column.style.height = "100%";
      this.row.style.display = "none";
      this.column.style.padding = "10vh 0";

      for (let i = 0; i < this.column.children.length; i++) {
        this.column.children[i].style.display = "flex"
      }
    }
  }

  closeMenu() {
    if (this.isMobile) {
      this.column.style.height = "0%";
      this.row.style.display = "flex";
      this.column.style.padding = "0";
  
      for (let i = 0; i < this.column.children.length; i++) {
        this.column.children[i].style.display = "none"
      }
    }
  }
}

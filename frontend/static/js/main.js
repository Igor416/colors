const menu = new MenuComponent()
const node = document.createRange().createContextualFragment(menu.render())
document.getElementById('sidebar').appendChild(node)
menu.init()

const routes = {
  '/picker': PickerComponent,
  '/calculator': CalculatorComponent,
  '/calculator/help': CalculatorHelpComponent,
  '/trends/years': YearsComponent,
  '/trends/decades': DecadesComponent,
  '/schemes': SchemesComponent,
  '/models': ModelsComponent,
  '/log_in': LogInComponent,
  '/sign_in': SignInComponent
};

function catchRedirect(e) {
  e.preventDefault();//prevent going by link address
  let el = e.srcElement;
  while (!el.href) {
    el = el.parentElement
  }//maybe not the element fired an event, so find it's closest parent
  let href = el.href;
  let urlParametr = title = href.split('/').slice(-1)[0];

  for (let path of ['trends/decades/', 'trends/years', 'calculator/help', 'schemes']) {
    if (href.includes(path)) {
      title = path;
      break;
    }
  }
  
  main.setUrlParametr(urlParametr)
  main.setComponent('/' + title)

  menu.closeMenu()//if on mobile, then close menu on end
}

class Main {
  constructor() {
    this.urlParametr = ''
    this.title = ''
    this.isFile = false
    if (this.isFile) {
      this.catchLinks()
    } else {
      this.parseUrl()
    }
  }

  parseUrl() {
    const pathname = location.pathname
    for (let route in routes) {
      if (pathname.startsWith(route)) {
        if (route != pathname) {
          this.setUrlParametr(pathname.split('/').slice(-1)[0])
        }
        this.setComponent(route)
        break
      }
    }
  }

  setUrlParametr(value) {
    this.urlParametr = value
  }

  setComponent(title) {
    if (title == '') {
      if (this.isFile) {
        window.location.reload()
      } else {
        window.location.pathname
      }
    }
    this.title = title
    
    let component;
    if (this.title.startsWith('/trends/decades')) {
      component = new DecadesComponent(this.urlParametr)
    } else if (this.title.startsWith('/schemes')) {
      component = new SchemesComponent(this.urlParametr)
    } else {
      component = new routes[this.title]()
    }

    document.getElementById('main').innerHTML = component.render()
    component.init()
    if (this.isFile) {
      this.catchLinks()
    }
  }

  catchLinks() {
    for (let anchor of document.getElementsByTagName('a')) {
      if (anchor.href.startsWith('file:')) {
        anchor.addEventListener('click', catchRedirect)
      }
    }
  }
}

const main = new Main()
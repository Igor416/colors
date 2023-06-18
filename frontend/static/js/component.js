class Component {
  constructor() {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
  }
  
  listenOne(id, f, event='click') {
    document.getElementById(id)?.addEventListener(event, f)
  }

  listenMany(cls, f, event='click') {
    Array.from(document.getElementsByClassName(cls)).forEach(el => el.addEventListener(event, f))
  }

  renderIf(condition, code, alt='') {
    return condition ? code : alt;
  }

  init() {
    try {
      this.setStaticEventListeners()
    } catch { }
    try {
      this.setDynamicEventListeners()
    } catch { }
  }

  navigateTo(path, value) {
    if (value) {
      window.history.pushState({}, '', window.location.href)
      window.location.replace(path + '/' + value)
      //main.setUrlParametr(value)
      //main.setComponent(path)
    }
  }

  reload(item) {
    document.getElementById(item).innerHTML = this.getReloadable(item).join('')
    try {
      this.setDynamicEventListeners()
    } catch { }
  }
}
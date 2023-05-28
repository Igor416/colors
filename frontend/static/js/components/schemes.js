class SchemesComponent {
  constructor(name) {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
    this.size = screen.availWidth / 100 * (this.isMobile ? 80 /*80vw*/ : 20 /*20vw*/)
    this.schemeService = new SchemeService(this.isMobile, this.size)
    let scheme;
    const coords = this.schemeService.loadCoords(name);
    if (coords.length == 2) { //the cookie may expire, then length will be 0
      scheme = this.schemeService.get(name, coords[0], coords[1]);
    } else {
      scheme = this.schemeService.get(name, this.size / 2, this.size / 4); //tint of violet
    }

    if (scheme == null) {
      window.location.replace('/');
    } else {
      this.scheme = scheme;
      this.picked_scheme = scheme.name;
    }

    this.schemes = ['monochromatic', 'complementary', 'analogous', 'compound', 'triadic', 'rectangle', 'square'];
    this.mouseIsDown = false;
    this.colors_shown = false;
  }

  render() {
    return (`
    <div class="box whitesmoke">
      <div id="schemes_header" class="d-flex flex-sm-row flex-column justify-content-between">
        <span class="h3">${this.scheme.constructor.name} Scheme</span>
        <select id="schemes_options" class="whitesmoke transition underlined h4 p-2" value="${this.picked_scheme}">
          ${this.schemes.map((scheme) => {return `<option
            class="whitesmoke text-black h5"
            ${scheme == this.picked_scheme ? 'selected' : ''}
            value="${scheme}">
            ${scheme}
          </option>`}).join('')}
        </select>
      </div>
      <div id="description" class="my-5 h3">${this.scheme.description}</div>
      ${this.isMobile ? `<input type="checkbox" id="switch" /><label class="w-100 d-block bg-secondary position-relative" for="switch"></label>` : ''}
      <div id="scheme" class="d-flex justify-content-sm-between justify-content-center align-items-center mt-5">
        <div id="canvas_container_white" style="display: block" class="position-relative"></div>
        <div id="canvas_container_black" style="display: ${this.isMobile ? 'none' : 'block'}" class="position-relative"></div>
      </div>
      <div class="d-flex flex-column justify-content-between h3 mt-5">
        <div id="cursor_values"></div>
      </div>
    </div>
    `)
  }

  init() {
    this.whiteCanvas = new Canvas(this.size, 'white', this.scheme.cursors, true)
    this.blackCanvas = new Canvas(this.size, 'black', this.scheme.cursors, false)

    this.setStaticEventListeners()
    this.setDynamicEventListeners()
    this.reload('cursor_values')
  }

  setStaticEventListeners() {
    this.navigateTo = this.navigateTo.bind(this)
    document.getElementById("schemes_options").addEventListener('change', this.navigateTo)

    this.toggle = this.toggle.bind(this)
    document.getElementById("cursor_values").addEventListener('click', this.toggle)
    this.copy = this.copy.bind(this)

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onCursorDrag = this.onCursorDrag.bind(this)
    //cursor can only be moved when the mouse is down, so we need to track mouse state
    if (this.isMobile) {
      this.whiteCanvas.cursors.addEventListener('touchstart', this.onMouseDown)
      this.whiteCanvas.cursors.addEventListener('touchend', this.onMouseUp)
      this.whiteCanvas.cursors.addEventListener('touchmove', this.onCursorDrag)
      this.blackCanvas.cursors.addEventListener('touchstart', this.onMouseDown)
      this.blackCanvas.cursors.addEventListener('touchend', this.onMouseUp)
      this.blackCanvas.cursors.addEventListener('touchmove', this.onCursorDrag)

      this.chooseWheel = this.chooseWheel.bind(this)
      document.getElementById('switch').addEventListener('click', this.chooseWheel)
    } else {
      this.whiteCanvas.cursors.addEventListener('mousedown', this.onMouseDown)
      this.whiteCanvas.cursors.addEventListener('mouseup', this.onMouseUp)
      this.whiteCanvas.cursors.addEventListener('mousemove', this.onCursorDrag)
      this.blackCanvas.cursors.addEventListener('mousedown', this.onMouseDown)
      this.blackCanvas.cursors.addEventListener('mouseup', this.onMouseUp)
      this.blackCanvas.cursors.addEventListener('mousemove', this.onCursorDrag)
    }
  }

  setDynamicEventListeners() {
    Array.from(document.getElementsByClassName('fa-copy')).forEach(el => el.addEventListener('click', this.copy))
  }

  navigateTo(value) {
    if (value) {
      window.history.pushState({}, '', window.location.href)
      main.setUrlParametr(value.srcElement.value)
      main.setComponent('/schemes')
    }
  }

  toggle() {
    this.colors_shown = !this.colors_shown
    this.reload('cursor_values')
  }

  chooseWheel() {
    this.blackCanvas.isActive = this.whiteCanvas.isActive
    this.whiteCanvas.isActive = !this.whiteCanvas.isActive
    document.getElementById('canvas_container_white').style.display = this.whiteCanvas.isActive ? 'block' : 'none'
    document.getElementById('canvas_container_black').style.display = this.blackCanvas.isActive ? 'block' : 'none'
  }

  copy(event) {
    this.toggle()
    const hex = event.srcElement.getAttribute('data-hex')
    navigator.clipboard.writeText(hex);
  }

  onMouseDown(event) {
    /*
    if user clicked on any cursor, update the lastActive with cursor's index, else don't update the lastActive field
    */
    const [mouseX, mouseY] = this.getMousePos(event)

    const inRange = (center, radius, point) => center - radius < point && point < center + radius;
    
    for (let cursor of this.scheme.cursors) {
      let [x, y] = this.schemeService.transformCoords(cursor)
      if (inRange(x, cursor.radius, mouseX) && inRange(y, cursor.radius, mouseY)) {
        this.scheme.lastActive = this.scheme.cursors.indexOf(cursor);
        this.mouseIsDown = true;
        return
      }
    }
  }

  onMouseUp(event) {
    this.mouseIsDown = false;
  }

  onCursorDrag(event) {
    if (!this.mouseIsDown) {
      return;
    }
    let [mouseX, mouseY] = this.getMousePos(event)

    const cursor = this.scheme.cursors[this.scheme.lastActive]

    //cursor can't go beyond the wheel, we handling it using Pythagoras's theorem
    mouseX -= this.size / 2;
    mouseY = this.size / 2 - mouseY;
    if (Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) <= this.size / 2) {
      cursor.x = mouseX;
      cursor.y = mouseY;
      
      this.scheme.update();
      //as the cursors aren't independent we need to redraw every one. The dependencies are in the scheme.ts file
      this.whiteCanvas.isActive = event.srcElement.id == 'white'
      this.blackCanvas.isActive = event.srcElement.id == 'black'
      this.whiteCanvas.updateCursors(this.scheme.cursors)
      this.blackCanvas.updateCursors(this.scheme.cursors)
      this.schemeService.saveCoords(this.picked_scheme, this.scheme.cursors[0])
    }
    this.reload('cursor_values')
  }

  getMousePos(event) {
    let mouseX, mouseY;
    if (this.isMobile) {
      mouseX = event.targetTouches[0].clientX;
      mouseY = event.targetTouches[0].clientY;
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    const rect = event.srcElement.getBoundingClientRect();
    mouseX = (mouseX - rect.left) / (rect.right - rect.left) * event.srcElement.width
    mouseY = (mouseY - rect.top) / (rect.bottom - rect.top) * event.srcElement.height
    return [mouseX, mouseY]
  }

  reload(item) {
    document.getElementById(item).innerHTML = this.getReloadable(item)
    this.setDynamicEventListeners()
  }

  getReloadable(item) {
    switch (item) {
      case 'cursor_values': return this.schemeService.getCursorsInfo().map(info => {return `<div
      class="d-flex justify-content-center align-items-center cursor-value h4 mb-0 ${this.whiteCanvas.isActive ? 'text-black' : 'text-white'}"
      style="background-color: #${info.color.hex.toString()}">
        ${info.label != '' ? `<span>${this.colors_shown ? info.color.hex.toString() : info.label}&nbsp;<i data-hex=${info.color.hex.toString()} class="fas fa-copy"></i></span>` : ''}
    </div>`}).join('')
    }
  }
}

class SchemesComponent extends Component {
  constructor(name) {
    super()
    this.size = screen.availWidth / 100 * (this.isMobile ? 80 /*80vw*/ : 20 /*20vw*/)
    this.colorsService = new ColorsService()
    this.schemeService = new SchemeService(this.isMobile, this.size, 100)
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
    }

    this.schemes = ['custom', 'monochromatic', 'complementary', 'analogous', 'compound', 'triadic', 'rectangle', 'square'];
    this.mouseIsDown = false;
    this.colors_shown = false;
  }

  render() {
    return (`
    <div class="box whitesmoke">
      <div id="schemes_header" class="d-flex flex-sm-row flex-column justify-content-between">
        <span class="h3">${this.scheme.constructor.name} Scheme</span>
        <select id="schemes_options" class="whitesmoke transition underlined h4 p-2" value="${this.scheme.name}">
          ${this.schemes.map((scheme) => {return `<option
            class="whitesmoke text-black h5"
            ${this.renderIf(scheme == this.scheme.name, 'selected')}
            value="${scheme}">
            ${scheme}
          </option>`}).join('')}
        </select>
      </div>
      <div id="description" class="my-5 h3">${this.scheme.description}</div>
      <button id="import" class="whitesmoke border-0 outline-0 w-100 h3 text-primary">Import color from picker</button>
      ${this.renderIf(
        this.scheme.name == 'custom',
        `<div>
          <div class="d-flex justify-content-between h3">
            <span>add</span>
            <button id="add_button" class="whitesmoke transition border-0 outline-0">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="d-flex justify-content-between h3">
            <span>remove</span>
            <button id="remove_button" class="whitesmoke transition border-0 outline-0">
              <i class="fas fa-minus"></i>
            </button>
          </div>
        </div>`
      )}
      ${this.renderIf(
        this.isMobile,
        `<input type="checkbox" id="switch" class="h-0 w-0 invisible" />
        <label id="switch_label" class="w-100 d-block bg-secondary position-relative" for="switch"></label>`
      )}
      <div id="scheme" class="d-flex flex-sm-row flex-column justify-content-sm-between justify-content-center align-items-center mt-5">
        <div id="canvas_container_white" style="display: block" class="position-relative"></div>
        <div id="saturation" class="d-flex flex-sm-row flex-column-reverse align-items-sm-stretch align-items-center h3 mb-0">
          <input id="saturation_input" orient="${this.renderIf(this.isMobile, 'horizontal', 'vertical')}" class="px-sm-1 p-0" type="range" max="100" value="0" min="0">
          <span>Saturation</span>
        </div>
        <div id="canvas_container_black" style="display: ${this.renderIf(this.isMobile, 'none', 'block')}" class="position-relative"></div>
      </div>
      <div class="d-flex flex-column justify-content-between h3 mt-5">
        <div id="cursor_values"></div>
      </div>
    </div>
    `)
  }

  init() {
    this.whiteCanvas = new Canvas(this.size, 'white', this.scheme.cursors, true, this.schemeService.transformToReal)
    this.blackCanvas = new Canvas(this.size, 'black', this.scheme.cursors, false, this.schemeService.transformToReal)
    super.init()
    this.reload()
  }

  setStaticEventListeners() {
    this.listenOne('schemes_options', this.navigateTo, 'change')
    this.listenOne('import', this.import)
    this.listenOne('saturation_input', this.saturate, this.isMobile ? 'touchmove' : 'mousemove')
    this.listenOne('cursor_values', this.toggle)

    if (this.scheme.name == 'custom') {
      this.listenOne('add_button', this.add)
      this.listenOne('remove_button', this.remove)
    }
    //cursor can only be moved when the mouse is down, so we need to track mouse state
    const events = {
      onMouseDown: ['mousedown', 'touchstart'],
      onMouseUp: ['mouseup', 'touchend'],
      onCursorDrag: ['mousemove', 'touchmove'],
    }
    for (let color of ['white', 'black']) {
      for (let event in events) {
        this[color + 'Canvas'].cursors.addEventListener(events[event][Number(this.isMobile)], this[event])
      }
    }
    if (this.isMobile) {
      this.listenOne('switch', this.chooseWheel)
    }
  }

  setDynamicEventListeners() {
    this.listenMany('fa-copy', this.copy)
  }

  set activeCanvas(value) {
    this.whiteCanvas.isActive = value;
    this.blackCanvas.isActive = !value;
  }

  navigateTo = (event) => {
    super.navigateTo('/schemes', event.srcElement.value)
  }

  import = () => {
    const hsl = this.colorsService.loadColor('picked_color').hsl
    
    if (hsl.c.value < 50) {
      hsl.c.value = 100 - hsl.c.value
      this.activeCanvas = false
    }
    const cursor = this.scheme.cursors[this.scheme.lastActive]
    //find values on circle
    cursor.x = Math.cos(-hsl.a.value * Math.PI / 180) * this.size / 2
    cursor.y = Math.sin(-hsl.a.value * Math.PI / 180) * this.size / 2
    
    //adjust ligntness
    cursor.x += (cursor.x / 50 * (50 - hsl.c.value))
    cursor.y += (cursor.y / 50 * (50 - hsl.c.value))
    
    this.scheme.update()
    this.whiteCanvas.saturateWheel(100 - hsl.b.value)
    this.blackCanvas.saturateWheel(100 - hsl.b.value)
    this.whiteCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
    this.blackCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
    document.getElementById('saturation').firstElementChild.value = 100 - hsl.b.value
    this.schemeService.saturation = hsl.b.value
    this.reload()
  }

  add = () => {
    if (this.scheme.cursors.length > 5) {
      return
    }
    const [x, y] = this.schemeService.transformToTrig(this.size / 2, this.size / 4)
    this.scheme.addCursor(x, y)
    this.whiteCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
    this.blackCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
    this.reload()
  }

  remove = () => {
    if (this.scheme.cursors.length <= 1) {
      return
    }
    
    this.scheme.removeCursor(this.scheme.lastActive)
    this.whiteCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
    this.blackCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
    this.reload()
  }

  saturate = (event) => {
    this.whiteCanvas.saturateWheel(event.srcElement.value)
    this.blackCanvas.saturateWheel(event.srcElement.value)
    this.schemeService.saturation = 100 - event.srcElement.value
    this.reload()
  }

  toggle = () => {
    this.colors_shown = !this.colors_shown
    this.reload()
  }

  chooseWheel = () => {
    this.activeCanvas = !this.whiteCanvas.isActive
    document.getElementById('canvas_container_white').style.display = this.whiteCanvas.isActive ? 'block' : 'none'
    document.getElementById('canvas_container_black').style.display = this.blackCanvas.isActive ? 'block' : 'none'
    document.getElementById('scheme').classList.toggle('flex-column')
    document.getElementById('scheme').classList.toggle('flex-column-reverse')
  }

  copy = (event) => {
    this.toggle()
    const hex = event.srcElement.getAttribute('data-hex')
    navigator.clipboard.writeText(hex);
  }

  onMouseDown = (event) => {
    /*
    if user clicked on any cursor, update the lastActive with cursor's index, else don't update the lastActive field
    */
    const [mouseX, mouseY] = this.getMousePos(event)

    const inRange = (center, radius, point) => center - radius < point && point < center + radius;
    
    for (let cursor of this.scheme.cursors) {
      const [x, y] = this.schemeService.transformToReal(cursor.x, cursor.y)
      if (inRange(x, cursor.radius, mouseX) && inRange(y, cursor.radius, mouseY)) {
        this.scheme.lastActive = this.scheme.cursors.indexOf(cursor);
        this.mouseIsDown = true;
        return
      }
    }
  }

  onMouseUp = (event) => {
    this.mouseIsDown = false;
  }

  onCursorDrag = (event) => {
    if (!this.mouseIsDown) {
      return;
    }
    const [mouseX, mouseY] = this.schemeService.transformToTrig.apply(null, this.getMousePos(event)) 

    //cursor can't go beyond the wheel, we handling it using Pythagoras's theorem
    if (Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) <= this.size / 2) {
      this.scheme.cursors[this.scheme.lastActive].x = mouseX;
      this.scheme.cursors[this.scheme.lastActive].y = mouseY;
      
      this.scheme.update();
      //as the cursors aren't independent we need to redraw every one. The dependencies are in the scheme.ts file
      this.activeCanvas = event.srcElement.id == 'white'
      this.whiteCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
      this.blackCanvas.updateCursors(this.scheme.cursors, this.schemeService.transformToReal)
      this.schemeService.saveCoords(this.scheme.name, this.scheme.cursors[this.scheme.lastActive])
    }
    this.reload()
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

  reload(item='cursor_values') {
    super.reload(item)
  }

  getReloadable(item) {
    switch (item) {
      default: return this.schemeService.getCursorsInfo().map(info => {return `<div
      class="d-flex justify-content-center align-items-center cursor-value h4 mb-0 ${this.renderIf(this.whiteCanvas.isActive, 'text-black', 'text-white')}"
      style="background-color: #${info.color.hex.toString()}">
        ${this.renderIf(
          info.label != '',
          `<span>
            ${this.renderIf(this.colors_shown, info.color.hex.toString(), info.label)}
            &nbsp;
            <i data-hex=${info.color.hex.toString()} class="fas fa-copy"></i>
          </span>`
        )}
    </div>`})
    }
  }
}

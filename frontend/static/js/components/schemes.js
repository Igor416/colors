class SchemesComponent {
  constructor(name) {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
    this.size = screen.availWidth / 100 * (this.isMobile ? 80 /*80vw*/ : 20 /*20vw*/)
    this.canvasService = new CanvasService(this.size)
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
      <div id="schemes_header" class="d-flex justify-content-between">
        <span class="h3">${this.scheme.constructor.name} Scheme</span>
        <select class="whitesmoke transition underlined h4 p-2" value="${this.picked_scheme}">
          ${this.schemes.map((scheme) => {return `<option
            class="whitesmoke text-black h5"
            ${scheme == this.picked_scheme ? 'selected' : ''}
            value="${scheme}">
            ${scheme}
          </option>`}).join('')}
        </select>
      </div>
      <div id="scheme" class="d-flex justify-content-between align-items-center mt-5">
        <div id="canvas_container"></div>
        <div id="scheme_info" class="d-flex flex-column justify-content-between h3">
          <div id="description">${this.scheme.description}</div>
          <div id="cursor_values"></div>
        </div>
      </div>
    </div>
    `)
  }

  init() {
    const container = document.getElementById('canvas_container');

    this.wheel = this.canvasService.drawWheel();
    container.style.width = container.style.height = this.size + 'px';
    this.wheel.style.position = 'absolute';
    container.appendChild(this.wheel);
    this.canvasService.wheel = this.wheel;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.size;
    this.canvas.style.position = 'absolute';
    container.appendChild(this.canvas);
    this.canvasService.canvas = this.canvas;

    this.canvasService.drawAllCursors(this.scheme.cursors);
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
      this.canvas.addEventListener('touchstart', this.onMouseDown)
      this.canvas.addEventListener('touchend', this.onMouseUp)
      this.canvas.addEventListener('touchmove', this.onCursorDrag)
    } else {
      this.canvas.addEventListener('mousedown', this.onMouseDown)
      this.canvas.addEventListener('mouseup', this.onMouseUp)
      this.canvas.addEventListener('mousemove', this.onCursorDrag)
    }
  }

  setDynamicEventListeners() {
    Array.from(document.getElementsByClassName('fa-copy')).forEach(el => el.addEventListener('click', this.copy))
  }

  navigateTo(value) {
    if (value) {
      window.history.pushState({}, '', window.location.href)
      //window.location.replace(`/schemes/${value.srcElement.value}`)
      main.setUrlParametr(value.srcElement.value)
      main.setComponent('/schemes')
    }
  }

  toggle() {
    this.colors_shown = !this.colors_shown
    this.reload('cursor_values')
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
    let mouseX, mouseY;
    if (this.isMobile) {
      mouseX = event.targetTouches[0].clientX;
      mouseY = event.targetTouches[0].clientY;
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    mouseX -= this.canvas.offsetLeft + this.size / 2;
    mouseY = this.size / 2 - mouseY + this.canvas.offsetTop;

    const inRange = (center, radius, point) => center - radius < point && point < center + radius;
    
    for (let i = 0; i < this.scheme.cursors.length; i++) {
      let cursor = this.scheme.cursors[i];
      if (inRange(cursor.x, cursor.radius, mouseX) && inRange(cursor.y, cursor.radius, mouseY)) {
        this.scheme.lastActive = i;
        break;
      }
    }

    this.mouseIsDown = true;
  }

  onMouseUp(event) {
    this.mouseIsDown = false;
  }

  onCursorDrag(event) {
    if (!this.mouseIsDown) {
      return;
    }
    let mouseX, mouseY;
    if (this.isMobile) {
      mouseX = event.targetTouches[0].clientX;
      mouseY = event.targetTouches[0].clientY;
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    mouseX -= this.canvas.offsetLeft + this.size / 2;
    mouseY = this.size / 2 - mouseY + this.canvas.offsetTop;

    const ctx = this.canvas.getContext('2d');

    const cursor = this.scheme.cursors[this.scheme.lastActive]

    //cursor can't go beyond the wheel, we handling it using Pythagoras's theorem
    if (Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) <= this.size / 2) {
      cursor.x = mouseX;
      cursor.y = mouseY;

      this.scheme.update();
      //as the cursors aren't independent we need to redraw every one. The dependencies are in the scheme.ts file
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasService.drawAllCursors(this.scheme.cursors);
      this.schemeService.saveCoords(this.picked_scheme, this.scheme.cursors[0])
    }
    this.reload('cursor_values')
  }

  reload(item) {
    document.getElementById(item).innerHTML = this.getReloadable(item)
    this.setDynamicEventListeners()
  }

  getReloadable(item) {
    switch (item) {
      case 'cursor_values': return this.schemeService.getCursorsInfo().map(info => {return `<div
      class="d-flex justify-content-center align-items-center cursor-value h4"
      style="background-color: #${info.color.hex.toString()}">
        <span>${this.colors_shown ? info.color.hex.toString() : info.label}&nbsp;<i data-hex=${info.color.hex.toString()} class="fas fa-copy"></i></span>
    </div>`}).join('')
    }
  }
}

class SchemesComponent {
  constructor(name) {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
    let size = screen.availWidth
    if (this.isMobile) {
      size *= 80 / 100 //80vw
    } else {
      size *= 20 / 100 //20vw
    }
    this.canvasService = new CanvasService()
    this.schemeService = new SchemeService(this.isMobile, size)
    let scheme;
    let coords = this.schemeService.loadCoords(name);
    if (coords.length == 2) { //the cookie may expire, then length will be 0
      scheme = this.schemeService.get(name, coords[0], coords[1]);
    } else {
      scheme = this.schemeService.get(name, size / 2, size / 4); //tint of violet
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
        <span id="schemes_title">${this.scheme.constructor.name} Scheme</span>
        <select id="schemes_options" class="whitesmoke transition underlined" value="${this.picked_scheme}">
          ${this.schemes.map((scheme) => {return `<option
            class="whitesmoke schemes_option"
            ${scheme == this.picked_scheme ? 'selected' : ''}
            value="${scheme}">
            ${scheme}
          </option>`}).join('')}
        </select>
      </div>
      <div id="scheme" class="d-flex justify-content-between align-items-center">
        <div id="canvas_container"></div>
        <div id="scheme_info" class="d-flex flex-column justify-content-between">
          <div id="description">${this.scheme.description}</div>
          <div id="cursor_values">
            
          </div>
        </div>
      </div>
    </div>
    `)
  }

  init() {
    //there are 2 different canvas elements so that when user drags any of the cursors we may redraw only the cursors, the wheel is only drawn once, at the beginind, remains unchanged
    let size = screen.availWidth
    if (this.isMobile) {
      size *= 80 / 100 //80vw
    } else {
      size *= 20 / 100 //20vw
    }
    let container = document.getElementById('canvas_container');

    this.wheel = this.canvasService.drawWheel(size);
    container.style.width = container.style.height = size + 'px';
    this.wheel.style.position = 'absolute';
    container.appendChild(this.wheel);
    this.canvasService.wheel = this.wheel;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = size;
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
    let hex = event.srcElement.getAttribute('data-hex')
    navigator.clipboard.writeText(hex);
  }

  onMouseDown(event) {
    /*
    if user clicked on any cursor, update the lastActive with cursor's index, else don't update the lastActive field
    */
    let evt, mouseX, mouseY;
    if (this.isMobile) {
      evt = event;
      mouseX = evt.targetTouches[0].clientX;
      mouseY = evt.targetTouches[0].clientY;
    } else {
      evt = event;
      mouseX = evt.clientX;
      mouseY = evt.clientY;
    }

    let size = this.canvas.width;
    mouseX -= this.canvas.offsetLeft + size / 2;
    mouseY = size / 2 - mouseY + this.canvas.offsetTop;

    let inRange = (center, radius, point) => center - radius < point && point < center + radius;
    
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
    let evt, mouseX, mouseY;
    if (this.isMobile) {
      evt = event;
      mouseX = evt.targetTouches[0].clientX;
      mouseY = evt.targetTouches[0].clientY;
    } else {
      evt = event;
      mouseX = evt.clientX;
      mouseY = evt.clientY;
    }

    let size = this.canvas.width;
    mouseX -= this.canvas.offsetLeft + size / 2;
    mouseY = size / 2 - mouseY + this.canvas.offsetTop;

    let ctx = this.canvas.getContext('2d');

    let cursor = this.scheme.cursors[this.scheme.lastActive]

    //cursor can't go beyond the wheel, we handling it using Pythagoras's theorem
    if (Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) <= size / 2) {
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
      class="d-flex justify-content-center align-items-center cursor-value"
      style="background-color: #${info.color.hex.toString()}">
        <span>${this.colors_shown ? (info.label == '' ? '' : info.color.hex.toString()) : info.label}&nbsp;<i data-hex=${info.color.hex.toString()} class="fas fa-copy"></i></span>
    </div>`}).join('')
    }
  }
}

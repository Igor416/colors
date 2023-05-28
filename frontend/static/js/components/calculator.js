class CalculatorComponent {
  constructor() {
    this.colors = new ColorsService()
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches;
    this.pickedSignId = 0
    this.minColors = 2;
    this.maxColors = 26;
    this.equation = this.colors.loadEquation();
  }

  render() {
    return (`
    <div class="box whitesmoke d-flex flex-column justify-content-between">
      <div id="equation" class="d-flex justify-content-start w-100 mt-5 flex-nowrap border-0">
        <div id="equation_row" class="d-flex flex-wrap justify-content-start">${this.getReloadable('equation_row')}</div>
        <div class="element sign equals"></div>
        <div class="hex_color d-flex flex-column justfiy-content-start align-items-center p-0 mb-5">
          <div id="result_color" class="color d-flex justify-content-center align-items-center mb-3 rounded-circle" style="background-color: #${this.equation.getResult()}"></div>
          <input id="result" disabled class="underlined h3" type="text" value="${this.equation.getResult()}">
        </div>
      </div>
      <div id="buttons" class="whitesmoke d-flex flex-column align-items-center w-100 h3">
        <div id="sign_buttons" class="d-flex flex-column justify-content-center w-100">
          <div id="choosen_sign" class="d-flex justify-content-between align-items-center mb-0">
            <span>Current Sign</span>
            <div class="sign ${this.getPickedSign()}"></div>
          </div>
          <div id="change_sign_buttons" class="d-flex justify-content-between align-items-center mb-0 h3">
            <span>Change Sign</span>
            <div>
              <div data-sign="+" class="sign plus"></div>
              <div data-sign="-" class="sign minus"></div>
              <div data-sign="&" class="sign mix"></div>
            </div>
          </div>
        </div>
        <div id="global_buttons" class="whitesmoke d-flex flex-column justify-content-around align-items-center p-0 w-100">
          <div class="d-flex justify-content-between w-100">
            <span>add</span>
            <button id="add_button">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div class="d-flex justify-content-between w-100">
            <span>remove</span>
            <button id="remove_button">
              <i class="fas fa-minus"></i>
            </button>
          </div>
          <div class="d-flex justify-content-between w-100">
            <span>clear</span>
            <button id="clear_button">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <a id="help" class="transition position-absolute" href="/calculator/help">
        <i class="fas fa-question"></i>
      </a>
    </div>
    `)
  }

  init() {
    this.setStaticEventListeners()
    this.setDynamicEventListeners()
  }

  setStaticEventListeners() {
    this.pickSign = this.pickSign.bind(this)
    this.invertColor = this.invertColor.bind(this)
    this.update = this.update.bind(this)
    this.changeSign = this.changeSign.bind(this)
    Array.from(document.getElementById('change_sign_buttons').getElementsByClassName('sign')).forEach(el => el.addEventListener('click', this.changeSign))
    this.clear = this.clear.bind(this)
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
    document.getElementById('clear_button').addEventListener('click', this.clear)
    document.getElementById('add_button').addEventListener('click', this.add)
    document.getElementById('remove_button').addEventListener('click', this.remove)
  }

  setDynamicEventListeners() {
    Array.from(document.getElementById('equation_row').getElementsByClassName('sign')).forEach(el => el.addEventListener('click', this.pickSign))
    Array.from(document.getElementsByClassName('invert_picked_color')).forEach(el => el.addEventListener('click', this.invertColor))
    Array.from(document.getElementsByClassName('hex_color')).forEach(el => el.children[1].addEventListener('input', this.update))
  }

  getInvertedColor(id) {
    const color = Color.toColor(this.equation.hexs[id]);
    return color.semiInvert().hex.toString(); //to get the text color
  }

  invertColor(event) {
    const id = Number(event.srcElement.getAttribute('data-id')) / 2;
    const color = Color.toColor(this.equation.hexs[id]).invert();
    this.equation.hexs[id] = color.hex.toString();
    this.reload('equation_row')
  }

  update(event) {
    const val = event.srcElement.value.slice(0, 6);
    const id = Number(event.srcElement.getAttribute('data-id'));
    this.equation.hexs[id / 2] = val// + '0'.repeat(6 - val.length)
    this.reload('equation_row')
    document.getElementsByTagName('input')[id / 2].focus()
  }

  pickSign(event) {
    const old = this.getPickedSign();
    this.pickedSignId = (event.srcElement.getAttribute('data-id') - 1) / 2
    this.setPickedSign(old, this.getPickedSign())
  }

  getPickedSign() {
    return Equation.getSign(this.equation.signs[this.pickedSignId]);
  }

  setPickedSign(o, n) {
    document.getElementById('choosen_sign').getElementsByTagName('div')[0].classList.replace(o, n)
  }

  changeSign(event) {
    this.setPickedSign(this.getPickedSign(), Equation.getSign(event.srcElement.getAttribute('data-sign')))
    this.equation.signs[this.pickedSignId] = event.srcElement.getAttribute('data-sign');
    this.reload('equation_row')
  }

  clear() {
    this.equation = new Equation('');
    this.reload('equation_row')
  }

  add() {
    if (this.equation.hexs.length < this.maxColors) {
      this.equation.add('000000');
      this.reload('equation_row')
    }
  }

  remove() {
    if (this.equation.hexs.length > this.minColors) {
      this.equation.remove();
      this.reload('equation_row')
    }
  }

  calculate() {
    const result = this.equation.getResult()
    this.colors.saveEquation(this.equation);
    document.getElementById('result').value = result;
    document.getElementById('result_color').style.backgroundColor = '#' + result;
  }

  reload(item) {
    this.calculate()
    document.getElementById(item).innerHTML = this.getReloadable(item)
    this.setDynamicEventListeners()
  }

  getReloadable(item) {
    switch (item) {
      case 'equation_row': return this.equation.toArray().map((el, id) => {return `<div
      data-id="${id}"
      class="${
        id % 2 == 0 ?
        'hex_color d-flex flex-column justfiy-content-start align-items-center p-0 mb-5 h4'
        :
        'sign ' + Equation.getSign(el)
      }">
      ${id % 2 == 0 ? `<div class="color d-flex justify-content-center align-items-center mb-3 rounded-circle" data-id="${id}"
        style="background-color: #${el}">
        <button data-id="${id}" class="invert_picked_color h3 border-0 outline-0"
          style="color: #${this.getInvertedColor(id / 2)}">invert
        </button>
      </div>
      <input data-id=${id} type="text" class="underlined" value="${el}">` : ''}
    </div>`}).join('')
    }
  }
}


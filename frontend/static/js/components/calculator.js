class CalculatorComponent extends Component {
  constructor() {
    super()
    this.colors = new ColorsService()
    this.pickedSignId = 0
    this.minColors = 2;
    this.maxColors = 26;
    this.equation = this.colors.loadEquation();
  }

  render() {
    return (`
    <div class="box whitesmoke d-flex flex-column justify-content-between">
      <div id="equation" class="d-flex justify-content-start w-100 mt-5 flex-nowrap border-0">
        <div id="equation_row" class="d-flex flex-wrap justify-content-start">${this.getReloadable()}</div>
        <div class="element sign equals"></div>
        <div class="hex-color d-flex flex-column justfiy-content-start align-items-center p-0 mb-5">
          <div id="result_color" class="color d-flex justify-content-center align-items-center mb-3 rounded-circle" style="background-color: #${this.equation.getResult()}"></div>
          <input id="result" disabled class="underlined h3" type="text" value="${this.equation.getResult()}">
        </div>
      </div>
      <div id="buttons" class="whitesmoke d-flex flex-column align-items-center w-100 h3">
        <div id="sign_buttons" class="d-flex flex-column justify-content-center w-100">
          <div id="choosen_sign" class="d-flex justify-content-between align-items-center mb-0">
            <span>Current Sign</span>
            <div class="sign ${this.pickedSign}"></div>
          </div>
          <div id="change_sign_buttons" class="d-flex justify-content-between align-items-center mb-0 h3">
            <span>Change Sign</span>
            <div>
              <div data-sign="+" class="sign change plus"></div>
              <div data-sign="-" class="sign change minus"></div>
              <div data-sign="&" class="sign change mix"></div>
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

  setStaticEventListeners() {
    for (let action of ['clear', 'add', 'remove']) {
      this.listenOne(action + '_button', this[action])
    }
    
    this.listenMany('change sign', this.changeSign)
  }

  setDynamicEventListeners() {
    this.listenMany('row sign', this.pickSign)
    this.listenMany('invert-picked-color', this.invertColor)
    this.listenMany('hex-color', this.update, 'input')
  }

  get pickedSign() {
    return Equation.getSign(this.equation.signs[this.pickedSignId]);
  }

  update = (event) => {
    const val = event.srcElement.value.slice(0, 6);
    const id = Number(event.srcElement.getAttribute('data-id'));
    this.equation.hexs[id / 2] = val + '0'.repeat(6 - val.length)
    document.getElementsByClassName('color')[id].style.backgroundColor = '#' + val + '0'.repeat(6 - val.length)
    this.calculate()
    document.getElementsByTagName('input')[id / 2].focus()
  }

  invertColor = (event) => {
    const id = Number(event.srcElement.getAttribute('data-id')) / 2;
    const color = Color.toColor(this.equation.hexs[id]).invert();
    this.equation.hexs[id] = color.hex.toString();
    this.reload()
  }

  pickSign = (event) => {
    const old = this.pickedSign;
    this.pickedSignId = (event.srcElement.getAttribute('data-id') - 1) / 2
    document.getElementById('choosen_sign').getElementsByTagName('div')[0].classList.replace(old, this.pickedSign)
  }

  changeSign = (event) => {
    const n = event.srcElement.getAttribute('data-sign');
    document.getElementById('choosen_sign').getElementsByTagName('div')[0].classList.replace(this.pickedSign, Equation.getSign(n))
    this.equation.signs[this.pickedSignId] = n;
    this.reload()
  }

  clear = () => {
    this.equation = new Equation('');
    this.reload()
  }

  add = () => {
    if (this.equation.hexs.length < this.maxColors) {
      this.equation.add('000000');
      this.reload()
    }
  }

  remove = () => {
    if (this.equation.hexs.length > this.minColors) {
      this.equation.remove();
      this.reload()
    }
  }

  getInvertedColor(id) {
    const color = Color.toColor(this.equation.hexs[id]);
    return color.semiInvert().hex.toString(); //to get the text color
  }

  async calculate() {
    const result = this.equation.getResult()
    this.colors.saveEquation(this.equation);
    document.getElementById('result').value = result;
    document.getElementById('result_color').style.backgroundColor = '#' + result;
  }

  reload(item='equation_row') {
    this.calculate()
    super.reload(item)
  }

  getReloadable(item) {
    switch (item) {
      default: return this.equation.toArray().map((el, id) => {return `<div
      data-id="${id}"
      class="${this.renderIf(
        id % 2 == 0,
        'hex-color d-flex flex-column justfiy-content-start align-items-center p-0 mb-5 h4',
        'row sign ' + Equation.getSign(el)
      )}">
      ${id % 2 == 0 ? `<div class="color d-flex justify-content-center align-items-center mb-3 rounded-circle" data-id="${id}"
        style="background-color: #${el}">
        <button data-id="${id}" class="invert-picked-color h3 border-0 outline-0"
          style="color: #${this.getInvertedColor(id / 2)}">invert
        </button>
      </div>
      <input data-id=${id} type="text" class="underlined" value="${el}">` : ''}
    </div>`})
    }
  }
}
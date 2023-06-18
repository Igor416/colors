class PickerComponent extends Component {
  constructor() {
    super()
    this.colors = new ColorsService()
    this.picked_color = this.colors.loadColor('picked_color');
    this.picked_model = this.picked_color.rgb;
    this.models = this.picked_color.models.filter(el => el.name !== 'hex');
  }

  render() {
    return (`
    <div class="d-flex flex-column justify-content-between box whitesmoke">
      <div id="picker_header" class="d-flex justify-content-between w-100">
        <span class="h3">${this.picked_model.name.toUpperCase()} (${this.picked_model.fullName}) Picker</span>
        <select id="picker_options" class="whitesmoke underlined transition h4 p-2" value="${this.picked_model.name}">
          ${this.models.map((model) => {return `<option
            class="whitesmoke h5"
            ${this.renderIf(model == this.picked_model, 'selected')}
            value="${model.name}">
            ${model.name}
          </option>`}).join('')}
        </select>
      </div>
      <div id="picker_representer" class="d-flex justify-content-between">
        <div
          id="picked_color"
          [ngStyle]="{ 'background-color': representColor() }"
          class="d-flex justify-content-center align-items-center rounded-circle">
          <button id="invert_picked_color" class="border-0 h1">invert</button>
        </div>
        <div id="picked_color_models" class="d-flex flex-column justify-content-between align-items-end h4">
          ${this.getReloadable('picked_color_models').join('')}
          ${this.renderIf(this.isMobile, `<div class="w-100 text-center mb-2">
            <span>Copy <i data-model=${this.picked_model.name} class="fas fa-copy"></i><span>
          </div>`)}
        </div>
      </div>
      <div id="picker_chooser" class="flex-column">
        ${this.getReloadable().join('')}
      </div>
    </div>  
    `)
  }

  init() {
    super.init()
    this.representColor(this.picked_model)
  }

  setStaticEventListeners() {
    this.listenOne('invert_picked_color', this.invertColor)
    this.listenOne('picker_options', this.setModel, 'change')
  }

  setDynamicEventListeners() {
    this.listenMany('field', this.updateField, 'input')
    this.listenMany('fa-copy', this.copy)
  }

  get modelsOrder() {
    const order = this.picked_color.models;
    for (let i = 0; i < order.length; i++) {
      if (order[i].name == this.picked_model.name) {
        order.splice(i, 1);
        break;
      }
    }
    order.unshift(this.picked_model);

    return order;
  }

  setModel = (event) => {
    this.picked_model = this.picked_color.models.filter(el => el.name == event.srcElement.value)[0]
    this.reload('picked_color_models')
    this.reload()
  }

  invertColor = () => {
    this.picked_color = this.picked_color.invert();
    this.picked_model = this.picked_color[this.picked_model.name]
    this.representColor(this.picked_model)
    this.reload('picked_color_models')
    this.reload()
  }

  copy = (event) => {
    const model = this.picked_color[event.srcElement.getAttribute('data-model')]
    navigator.clipboard.writeText(model.toString());
  }

  updateField = (event) => {
    if (event.srcElement.getAttribute('type') == 'range') {
      return this.updateSlider(event)
    }

    const model = this.picked_color[event.srcElement.getAttribute('data-model')]
    model[event.srcElement.getAttribute('data-id')].value = model.name == 'hex' ? event.srcElement.value : Number(event.srcElement.value)
    this.representColor(model)
    this.reload('picked_color_models')
    this.reload()
  }

  representColor(model) {
    this.picked_color.update(model);
    this.colors.saveColor('picked_color', this.picked_color);
    document.getElementById('picked_color').style.backgroundColor = '#' + this.picked_color.hex.toString();
    document.getElementById('invert_picked_color').style.color = '#' + this.picked_color.semiInvert().hex.toString();
  }

  updateSlider(event) {
    this.picked_model[event.srcElement.getAttribute('data-id')].value = Number(event.srcElement.value)
    this.representColor(this.picked_model)
    this.reload('picked_color_models')
    this.picked_model.fields.slice(1).forEach((field, i) => {
      document.getElementsByClassName('picker-chooser-gradient')[i + 1].style.background = this.picked_model.getGradient(field.value)
    })
  }

  reload(item='picker_chooser') {
    super.reload(item)
  }

  getReloadable(item) {
    switch (item) {
      case 'picked_color_models': return this.modelsOrder.map(model => {return `<div class="d-flex justify-content-end picked_color_model ${this.renderIf(this.picked_model.name == model.name, 'h3')}">
        ${model.fields.map(field => {return `<div class="d-flex justify-content-between picked-color-field">
          <span class="picker_chooser_label">${field.name}: &nbsp;</span>
          <input
            data-model=${model.name}
            data-id=${field.value}
            type="${this.renderIf(model.name == 'hex', 'text', 'number')}"
            class="underlined field"
            ${this.renderIf(model.name != 'hex', `min="${model[field.value].min}" max="${model[field.value].max}"`)}
            value="${model[field.value].value}">
        </div>`}).join('')}
        ${this.renderIf(!this.isMobile, `<i data-model=${model.name} class="fas fa-copy"></i>`)}
      </div>`})
      default: return this.picked_model.fields.map(field => {return `<div class="picker_chooser_field">
        <span class="picker_chooser_label">${field.name}: &nbsp;</span>
        <div
          class="picker-chooser-gradient"
          style="background: ${this.picked_model.getGradient(field.value)}">
        </div>
        <input
        class="w-100 field"
        data-id=${field.value}
        type="range"
        min="${this.picked_model[field.value].min}"
        max="${this.picked_model[field.value].max}"
        value="${this.picked_model[field.value].value}">
      </div>`})
    }
  }
}

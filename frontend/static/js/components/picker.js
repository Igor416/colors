class PickerComponent {
  constructor() {
    this.colors = new ColorsService()
    this.picked_color = this.colors.loadColor('picked_color');
    this.picked_model = this.picked_color.rgb;
    this.models = this.picked_color.models.filter(el => el.name !== 'hex');
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
  }

  render() {
    return (`
    <div class="d-flex flex-column justify-content-between box whitesmoke">
      <div id="picker_header" class="d-flex justify-content-between w-100">
        <span id="picker_title">${this.picked_model.name.toUpperCase()} (${this.picked_model.fullName}) Picker</span>
        <select id="picker_options" class="whitesmoke underlined transition" value="${this.picked_model.name}">
          ${this.models.map((model) => {return `<option
            class="whitesmoke picker_option"
            ${model == this.picked_model ? 'selected' : ''}
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
          <button id="invert_picked_color" class="border-0">invert</button>
        </div>
        <div id="picked_color_models" class="d-flex flex-column justify-content-between align-items-end">
          ${this.getReloadable('picked_color_models')}
          ${this.isMobile ? `<div class="w-100 text-center mb-2">
            <span>Copy <i data-model=${this.picked_model.name} class="fas fa-copy"></i><span>
          </div>` : ''}
        </div>
      </div>
      <div id="picker_chooser" class="flex-column">
        ${this.getReloadable('picker_chooser')}
      </div>
    </div>  
    `)
  }

  init() {
    this.setStaticEventListeners()
    this.setDynamicEventListeners()
    this.representColor(this.picked_model)
  }

  setStaticEventListeners() {
    this.invertColor = this.invertColor.bind(this)
    document.getElementById('invert_picked_color').addEventListener('click', this.invertColor)
    this.setModel = this.setModel.bind(this)
    document.getElementById("picker_options").addEventListener('change', this.setModel)
    this.updateField = this.updateField.bind(this)
    this.copy = this.copy.bind(this)
  }

  setDynamicEventListeners() {
    Array.from(document.getElementsByTagName('input')).forEach(el => el.addEventListener('input', this.updateField))
    Array.from(document.getElementsByClassName('fa-copy')).forEach(el => el.addEventListener('click', this.copy))
  }

  setModel(event) {
    this.picked_model = this.picked_color.models.filter(el => el.name == event.srcElement.value)[0]
    this.reload('picked_color_models')
    this.reload('picker_chooser')
  }

  invertColor() {
    this.picked_color = this.picked_color.invert();
    this.picked_model = this.picked_color[this.picked_model.name]
    document.getElementById('picked_color').style.backgroundColor = `hsl(${this.picked_color.hsl.toString()})`;
    document.getElementById('invert_picked_color').style.color = `hsl(${this.picked_color.semiInvert().hsl.toString()})`;
    this.reload('picked_color_models')
    this.reload('picker_chooser')
  }

  representColor(model) {
    this.picked_color.update(model);
    this.colors.saveColor('picked_color', this.picked_color);
    document.getElementById('picked_color').style.backgroundColor = '#' + this.picked_color.hex.toString();
    document.getElementById('invert_picked_color').style.color = '#' + this.picked_color.semiInvert().hex.toString();
  }

  copy(event) {
    let model = this.picked_color[event.srcElement.getAttribute('data-model')]
    navigator.clipboard.writeText(model.toString());
  }

  updateField(event) {
    if (event.srcElement.getAttribute('type') == 'range') {
      return this.updateSlider(event)
    }

    let model = this.picked_color[event.srcElement.getAttribute('data-model')]
    model[event.srcElement.getAttribute('data-id')].value = model.name == 'hex' ? event.srcElement.value : Number(event.srcElement.value)
    this.representColor(model)
    this.reload('picked_color_models')
    this.reload('picker_chooser')
  }

  updateSlider(event) {
    this.picked_model[event.srcElement.getAttribute('data-id')].value = Number(event.srcElement.value)
    this.representColor(this.picked_model)
    this.reload('picked_color_models')
    this.picked_model.fields.slice(1).map((field, i) => {
      document.getElementsByClassName('picker_chooser_gradient')[i + 1].style.background = this.picked_model.getGradient(field.value)
    })
  }

  getModelsOrder() {
    let order = this.picked_color.models;
    for (let i = 0; i < order.length; i++) {
      if (order[i].name == this.picked_model.name) {
        order.splice(i, 1);
        break;
      }
    }
    order.unshift(this.picked_model);

    return order;
  }

  reload(item) {
    document.getElementById(item).innerHTML = this.getReloadable(item)
    this.setDynamicEventListeners()
  }

  getReloadable(item) {
    switch (item) {
      case 'picked_color_models': return this.getModelsOrder().map(model => {return `<div class="d-flex justify-content-end picked_color_model ${this.picked_model.name == model.name ? 'active' : '' }">
        ${model.fields.map(field => {return `<div class="d-flex justify-content-between picked_color_field">
          <span class="picker_chooser_label">${field.name}: &nbsp;</span>
          <input
            data-model=${model.name}
            data-id=${field.value}
            type="${model.name == 'hex' ? "text" : "number"}"
            class="underlined"
            ${model.name != 'hex' ? 
            `min="${model[field.value].min}"
            max="${model[field.value].max}"` :
            ""}
            value="${model[field.value].value}">
        </div>`}).join('')}
        ${this.isMobile ? '' : `<i data-model=${model.name} class="fas fa-copy"></i>`}
      </div>`}).join('')
      case 'picker_chooser': return this.picked_model.fields.map(field => {return `<div class="picker_chooser_field">
        <span class="picker_chooser_label">${field.name}: &nbsp;</span>
        <div
          class="picker_chooser_gradient"
          style="background: ${this.picked_model.getGradient(field.value)}">
        </div>
        <input
        class="w-100"
        data-id=${field.value}
        type="range"
        min="${this.picked_model[field.value].min}"
        max="${this.picked_model[field.value].max}"
        value="${this.picked_model[field.value].value}">
      </div>`}).join('')
    }
  }
}

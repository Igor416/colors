class DecadesComponent extends Component {
  constructor(decade) {
    super()
    this.decades = []
    this.trends = new TrendsService();
    this.decade = this.trends.getDecadePallete(decade);

    for (let i = 1920; i <= 2010; i += 10) {
      this.decades.push(i.toString())
    }
  }

  render() {
    return (`
    <div class="box whitesmoke">
      <div id="decades_header" class="d-flex justify-content-between align-items-center h2">
        <div id="decades_title">
          <span>Trends through the decades</span>
          <br>
          <span id="years_link" class="h2 my-sm-0 my-4">
            See also: <a class="transition" href="/trends/years">Trends through years</a>
          </span>
        </div>
        <select id="decades_links" class="underlined whitesmoke transition h4" value="${this.decade.decade}">
          ${this.decades.map((decade) => {return `<option
            class="whitesmoke underlined"
            ${this.renderIf(decade == this.decade.decade, 'selected')}
            value="${decade}">
            ${decade}
          </option>`}).join('')}
        </select>
      </div>
      <div id="decade_content_container" class="d-flex flex-column align-items-center mt-5 h3">
        <div id="decade_content" class="d-flex flex-column w-100">
          <div id="decade_description">
            <span>${this.decade.description}</span><br><br>
            <span>Photos took from
              <a href="https://juiceboxinteractive.com/blog/color/" target="_blank">here</a>.
            </span>
          </div>
          <div id="decade_colors" class="d-flex flex-column w-100">
            ${this.decade.colors.map((color, id) => {return `<div
              class="color d-flex flex-column align-items-center justify-content-center py-2 w-100 rounded-0"
              style="color: ${color.getShade()}; background-color: #${color.hex.toString()}">
              <span>${this.decade.names[id]}</span>
              <span>#${color.hex.toString()}</span>
            </div>`}).join('')}
          </div>
        </div>
        ${new ImageComponent(`/static/assets/${this.decade.decade}_trends.jpg`, `${this.decade.decade} trends`, { width: 'auto'}, "90vw").render()}
      </div>
    </div>
    `)
  }

  setStaticEventListeners() {
    this.listenOne('decades_links', this.navigateTo, 'change')
  }

  navigateTo = (event) => {
    super.navigateTo('/trends/decades', event.srcElement.value)
  }
}

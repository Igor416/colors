class YearsComponent extends Component {
  constructor() {
    super()
    this.trends = new TrendsService()
    this.colors = this.trends.getYearColors();
    this.choosed_color = this.colors[0];
  }

  render() {
    return (`
    <div class="box whitesmoke">
      <div id="years_header" class="d-flex justify-content-between align-items-end">
        <span class="h2">Trends through the years</span>
        <span class="h3">
          See also: <a class="transition" href="/trends/decades/2010">Trends through decades</a>
        </span>
      </div>
      <div class="d-flex flex-column my-5 w-100 pe-0 h3">
        <span>
        Since 2000, Pantone’s color experts at the Pantone Color Institute comb the world looking for new color influences. The selection process requires thoughtful consideration and trend analysis. including the entertainment industry and films in production, traveling art collections and new artists, fashion, all areas of design, popular travel destinations, as well as new lifestyles, playstyles, and socio-economic conditions. Influences may also stem from new technologies, materials, textures, and effects that impact color, relevant social media platforms and even upcoming sporting events that capture worldwide attention.
        </span>
        <div id="years_colors" class="d-flex flex-wrap mt-5 align-items-center justify-content-center">
          ${(this.colors.map((color, id) => {return `<div
            id="${id}"
            class="d-flex justify-content-center align-items-center text-center color"
            style="background-color: #${color.color.hex.toString()}"
          >
            <div class="color-info" style="color: ${color.color.getShade()}">
              <span>${color.name}</span><br>
              <span>${color.year}</span><br>
              <span>Code: ${color.pantone}</span>
            </div>
          </div>`})).join('')}
        </div>
      </div>
    </div>
    `)
  }
}

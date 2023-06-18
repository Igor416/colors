class CalculatorHelpComponent extends Component {
  constructor() {
    super()
    this.examples = [
      {
        name: 'Adding',
        text: 'In this operation we are just adding every one of the color\'s vectors (red, green, blue) to the other color\'s vectors responsizely.\nIf the result is too big, then we subtract maximum value from it.',
        equations: [
          new Equation('123456+654321'),
          new Equation('123456+aabbcc'),
        ]
      },
      {
        name: 'Subtracting',
        text: 'In this operation we are just subtracting every one of the color\'s vectors (red, green, blue) from the other color\'s vectors responsizely.\nIf the result is too small, then we subtract from them max it\'s absolute value (-46 will be 255 - 46 = 209)',
        equations: [
          new Equation('654321-123456'),
          new Equation('123456-aabbcc'),
        ]
      },
      {
        name: 'Mixing',
        text: 'In this operation we are just finding the mean value of every one of the color\'s vectors (red, green, blue) and the other color\'s vectors responsizely.\nThe mean value is never bigger or lower than it\'s parents, so there is no need in rounding.',
        equations: [
          new Equation('123456&654321')
        ]
      },
    ]
  }

  render() {
    return (`
    <div class="box whitesmoke">
      <span id="heading">Calculator User Guide</span>
      <h4>There are 3 operations available in the calculator:</h4>
      <ol>
        <li class="operation-name h3">adding (+)</li>
        <li class="operation-name h3">subtracting (-)</li>
        <li class="operation-name h3">mixing (&)</li>
      </ol>
      <h4>
        Calculator works in hex color-model, so the max value is 'ff' (255), and the minimum one is '0' (0);
      </h4>
      <ol id="operation-guides" class="h2 p-0">
        ${this.examples.map(example => {return (`<li>
          <div class="operation-guide h4">
            <span class="h1">${example.name}</span>
            <h4>${example.text}</h4>
            <span class="h1">Example: </span>
            ${example.equations.map(equation => {return (`<div class="example d-flex flex-wrap p-4">
              ${equation.toArray().map((el, i) => {this.renderIf(
                i % 2 == 0,
                `<div class="operation d-flex flex-column justify-content-between align-items-center p-0">
                  <div class="d-flex justify-content-center align-items-center rounded-circle" style="background-color: #${el};">
                  </div>
                  <input class="border-0 outline-0 border-bottom" type="text" value="${el}" disabled>
                </div>`,
                `<div class="sign ${Equation.getSign(el)}"></div>`
                )
              }).join('')}
              <div class="sign equals"></div>
              <div class="operation d-flex flex-column justify-content-between align-items-center p-0">
                <div class="d-flex justify-content-center align-items-center rounded-circle" style="background-color: #${equation.result};">
                </div>
                <input class="border-0 outline-0 border-bottom" type="text" value="${equation.result}" disabled>
              </div>
            </div>`)}).join('')}
          </div>
        </li>`)}).join('')}
      </ol>
      <a id="back" href="/calculator">
        <i class="transition fas fa-arrow-left"></i>
      </a>
    </div>
    `)
  }
}

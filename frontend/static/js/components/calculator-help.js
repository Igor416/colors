class CalculatorHelpComponent {

  constructor() {
  }

  render() {
    return (`
    <div class="box whitesmoke">
      <span id="heading">
        Calculator User Guide
      </span>
      <p>There are 3 operations available in the calculator:</p>
      <ol>
        <li class="operation-name">adding (+)</li>
        <li class="operation-name">subtracting (-)</li>
        <li class="operation-name">mixing (&)</li>
      </ol>
      <p>
        Calculator works in hex color-model, so the max value is 'ff' (255), and the minimum one is '0' (0);
      </p>
      <ol id="operation-guides">
        <li>
          <div class="operation-guide">
            <span>Adding</span>
            <p>
              In this operation we are just adding every one of the color's vectors (red, green, blue) to the other color's vectors responsizely
            </p>
            <p>
              If the result is too big, then we subtract maximum value from it.
            </p>
            <span>Example: </span>
            <div class="equation-example">
              <div class="operation-example">
                <div class="operation-color" style="background-color: #123456;">
                </div>
                <input type="text" value="#123456" disabled>
              </div>
              <div class="sign plus"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #654321;">
                </div>
                <input type="text" value="#654321" disabled>
              </div>
              <div class="sign equals"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #777777;">
                </div>
                <input type="text" value="#777777" disabled>
              </div>
            </div>
            <div class="equation-example">
              <div class="operation-example">
                <div class="operation-color" style="background-color: #123456;">
                </div>
                <input type="text" value="#123456" disabled>
              </div>
              <div class="sign plus"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #aabbcc;">
                </div>
                <input type="text" value="#aabbcc" disabled>
              </div>
              <div class="sign equals"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #bcef23;">
                </div>
                <input type="text" value="#bcef23" disabled>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="operation-guide">
            <span>Subtracting</span>
            <p>
              In this operation we are just subtracting every one of the color's vectors (red, green, blue) from the other color's vectors responsizely
            </p>
            <p>
              If the result is too small, then we replace the value with it's absolute value (-46 will be 46).
            </p>
            <span>Example: </span>
            <div class="equation-example">
              <div class="operation-example">
                <div class="operation-color" style="background-color: #654321;">
                </div>
                <input type="text" value="#654321" disabled>
              </div>
              <div class="sign minus"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #123456;">
                </div>
                <input type="text" value="#123456" disabled>
              </div>
              <div class="sign equals"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #530f35;">
                </div>
                <input type="text" value="#530f35" disabled>
              </div>
            </div>
            <div class="equation-example">
              <div class="operation-example">
                <div class="operation-color" style="background-color: #123456;">
                </div>
                <input type="text" value="#123456" disabled>
              </div>
              <div class="sign minus"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #aabbcc;">
                </div>
                <input type="text" value="#aabbcc" disabled>
              </div>
              <div class="sign equals"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #988776;">
                </div>
                <input type="text" value="#988776" disabled>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="operation-guide">
            <span>Mixing</span>
            <p>
              In this operation we are just finding the mean value of every one of the color's vectors (red, green, blue) and the other color's vectors responsizely
            </p>
            <p>
              The mean value is never bigger or lower than it's parents, so there is no need in rounding;
            </p>
            <span>Example: </span>
            <div class="equation-example">
              <div class="operation-example">
                <div class="operation-color" style="background-color: #654321;">
                </div>
                <input type="text" value="#654321" disabled>
              </div>
              <div class="sign mix"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #123456;">
                </div>
                <input type="text" value="#123456" disabled>
              </div>
              <div class="sign equals"></div>
              <div class="operation-example">
                <div class="operation-color" style="background-color: #3c3c3c;">
                </div>
                <input type="text" value="#3c3c3c" disabled>
              </div>
            </div>
          </div>
        </li>
      </ol>
      <a id="back" href="/calculator">
        <i class="transition fas fa-arrow-left"></i>
      </a>
    </div>
    `)
  }

  init() {
  }
}

class ModelsComponent extends Component {
  constructor() {
    super()
    this.models = [
      {
        name: 'rgb',
        text: 'Media that transmit light (such as television) use additive color mixing with primary colors of red, green, and blue, each of which stimulates one of the three types of the eye\'s color receptors with as little stimulation as possible of the other two. This is called "RGB" color space. Mixtures of light of these primary colors cover a large part of the human color space and thus produce a large part of human color experiences. This is why color television sets or color computer monitors need only produce mixtures of red, green and blue light.'
      },
      {
        name: 'hsl',
        text: 'HSL is a cylindrical geometry, with hue, it\'s angular dimension, starting at the red primary at 0°, passing through the green primary at 120° and the blue primary at 240°, and then wrapping back to red at 360°. In each geometry, the central vertical axis comprises the neutral, achromatic, or gray colors, ranging from black at lightness 0 or value 0, the bottom, to white at lightness 1 or value 1, the top.'
      },
      {
        name: 'hwb',
        text: 'HWB is a cylindrical-coordinate representation of points in an RGB color model, similar to HSL and HSV. It was developed by HSV’s creator Alvy Ray Smith in 1996 to address some of the issues with HSV. HWB was designed to be more intuitive for humans to use and slightly faster to compute. The first coordinate, H (Hue), is the same as the Hue coordinate in HSL and HSV. W and B stand for Whiteness and Blackness respectively and range from 0–100% (or 0–1). The mental model is that the user can pick a main hue and then “mix” it with white and/or black to produce the desired color.'
      },
      {
        name: 'cmyk',
        text: 'It is possible to achieve a large range of colors seen by humans by combining cyan, magenta, and yellow transparent dyes/inks on a white substrate. These are the subtractive primary colors. Often a fourth ink, black, is added to improve reproduction of some dark colors. This is called the "CMY" or "CMYK" color space.'
      },
    ]
  }

  render() {
    return (`
    <div class="d-flex flex-column align-items-center box whitesmoke">
      <div id="models_header" class="d-flex justify-content-between h1">
        <span>Models</span>
      </div>
      <table id="models_content" class="d-flex flex-column">
        ${(this.models.map((model) => {return `<tr class="d-flex align-items-center model h3">
          <td class="d-flex flex-column">
            <span class="h2">${this.renderIf(model.name == 'rgb', 'RGB | HEX', model.name.toUpperCase())} Model</span>
            <span>${model.text}</span>
          </td>
          <td>
            ${new ImageComponent(`/static/assets/${model.name}_model.png`, `${model.name} model`, {width: '17.5vw'}, "80vw").render()}
          </td>
        </tr>`})).join('')}
      </table>
      <span class="h1">Educative video. Credits to: <a class="underlined" href="https://www.youtube.com/@rhumbline" target="_blank">@rhumbline</a></span>
      <div id="video">
        <video controls poster="/static/assets/preview.png">
          <source src="/static/assets/video.mp4" type="video/mp4">
          Download the
          <a href="/static/assets/video.mp4">MP4</a>
          video.
        </video>
      </div>
    <div>
    `)
  }
}

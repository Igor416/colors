class ImageComponent {
  constructor(src, alt, style, widthSmall) {
    this.isMobile = window.matchMedia("(max-width: 1080px)").matches
    this.src = src;
    this.alt = alt
    this.style = style
    if (this.isMobile) {
      this.style['width'] = widthSmall;
    }
  }

  render() {
    const el = document.createElement('img')
    el.src = this.src
    el.alt = this.alt
    for (let key in this.style) {
      el.style[key] = this.style[key]
    }
    return el.outerHTML
  }
}

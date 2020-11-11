const images = require('images');

function render(viewport, element) {
  if (element.style) {
    let image = images(element.style.width, element.style.height);

    if (element.style['background-color']) {
      let color = element.style['background-color'] || "rgb(0,0,0)";
      let match = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      console.log(match[1], match[2], match[3])
      image.fill(Number(match[1]), Number(match[2]), Number(match[3]));
      viewport.draw(image, element.style.left||0, element.style.top||0)
    }
  }

  if (element.children) {
    for (let child of element.children) {
      render(viewport, child)
    }
  }
}

module.exports = render
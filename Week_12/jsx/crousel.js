import {Component} from "./framework.js"

export class Carousel extends Component {

  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel")
    for(let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url('${record}')`;
      this.root.appendChild(child);
    }

    // let currentIndex = 0
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;

    //   let current = children[currentIndex];
    //   let next = children[nextIndex];

    //   next.style.transition = "none";
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`;
    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 3000)

    let position = 0;
    this.root.addEventListener("mousedown", event => {
      let children = this.root.children;
      let startX = event.clientX;

      let width = this.root.getBoundingClientRect().width;
      console.log('width: ', width);
      let move = event => {
        let x = event.clientX - startX;

        let current = position - ((x - x % width) / width);

        // 前一张图片，后一张图片和当前的图片
        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = "none"

          // -pos * 500 图片对应的偏移
          // offset * width 前后图片的位置
          // x % 500 当前图片往左或者右的偏差
          children[pos].style.transform = `translateX(${- pos * width + offset * width + x % width}px)`
        }

        // for (const child of children) {
        //   if (width === 0)
        //     width = child.getBoundingClientRect().width;
        //   child.style.transition = "none"
        //   child.style.transform = `translateX(${-position * width + x}px)`
        // }
      }
      let up = event => {
        let x = event.clientX - startX;
        position = position - Math.round(x / width);

        for (let offset of [0, -Math.sign(- x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = ""

          // -pos * 500 图片对应的偏移
          // offset * width 前后图片的位置
          // x % 500 当前图片往左或者右的偏差
          children[pos].style.transform = `translateX(${- pos * width + offset * width}px)`
        }
        // for (const child of children) {
        //   child.style.transition = "";
        //   child.style.transform = `translateX(${- position * width}px)`;
        // }

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      }
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    })

    return this.root;
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}
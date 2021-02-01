const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol('animations')

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
  }
  start() {

    let startTime = Date.now();
    this[TICK] = () => {
      let t = Date.now() - startTime
      for (const animation of this[ANIMATIONS]) {
        let t0 = t;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t0 = andimation.duration;
        }
        animation.reciveTime(t0);
      }
      console.log("tick")
      requestAnimationFrame(this[TICK]);
    }

    this[TICK]();
  }

  pasuse() {

  }
  resume() {

  }

  reset() {

  }
  add(andimation) {
    this[ANIMATIONS].add(animation);
  }
}


export class Animation {
  constructor(object, property, startValue, endValue, duration, timingFunction) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  
  reciveTime(time) {
    let range = this.endValue - this.startValue;
    this.object[this.property] = this.startValue + range * time / this.duration;
  }
}
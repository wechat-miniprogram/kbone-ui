import {Spring} from './spring'

export class Spring2D {
    constructor(mass, springConstant, damping) {
        this._springX = new Spring(mass, springConstant, damping)
        this._springY = new Spring(mass, springConstant, damping)
        this._springScale = new Spring(mass, springConstant, damping)
        this._startTime = 0
    }
    setEnd(x, y, scale, velocity) {
        const t = (new Date()).getTime()
        this._springX.setEnd(x, velocity, t)
        this._springY.setEnd(y, velocity, t)
        this._springScale.setEnd(scale, velocity, t)
        this._startTime = t
    }
    x() {
        const dt = ((new Date()).getTime() - this._startTime) / 1000.0
        return {
            x: this._springX.x(dt),
            y: this._springY.x(dt),
            scale: this._springScale.x(dt)
        }
    }
    done() {
        const t = (new Date()).getTime()
        return this._springX.done(t) && this._springY.done(t) && this._springScale.done(t)
    }
    reconfigure(mass, springConstant, damping) {
        this._springX.reconfigure(mass, springConstant, damping)
        this._springY.reconfigure(mass, springConstant, damping)
        this._springScale.reconfigure(mass, springConstant, damping)
    }
}

import {almostEqual} from './utils'

export class Friction {
    constructor(mass, frictionCoefficient) {
        this._m = mass
        this._f = frictionCoefficient * 1000
        this._startTime = 0
        this._v = 0
    }
    setV(x_v, y_v) {
        const _v = ((x_v ** 2) + (y_v ** 2)) ** 0.5
        this._x_v = x_v
        this._y_v = y_v
        this._x_a = -this._f * this._x_v / _v
        this._y_a = -this._f * this._y_v / _v
        this._t = Math.abs(x_v / this._x_a) || Math.abs(y_v / this._y_a)
        this._lastDt = null
        this._startTime = (new Date()).getTime()
    }
    setS(x_s, y_s) {
        this._x_s = x_s
        this._y_s = y_s
    }
    s(dt) {
        if (dt === undefined) dt = ((new Date()).getTime() - this._startTime) / 1000.0
        if (dt > this._t) {
            dt = this._t
            this._lastDt = dt
        }

        let x = this._x_v * dt + 0.5 * this._x_a * (dt ** 2) + this._x_s
        let y = this._y_v * dt + 0.5 * this._y_a * (dt ** 2) + this._y_s

        if (this._x_a > 0 && x < this._endPositionX || this._x_a < 0 && x > this._endPositionX) x = this._endPositionX
        if (this._y_a > 0 && y < this._endPositionY || this._y_a < 0 && y > this._endPositionY) y = this._endPositionY

        return {x, y}
    }
    ds(dt) {
        if (dt === undefined) dt = ((new Date()).getTime() - this._startTime) / 1000.0
        if (dt > this._t) dt = this._t
        return {
            dx: this._x_v + this._x_a * dt,
            dy: this._y_v + this._y_a * dt
        }
    }
    delta() {
        return {
            x: -1.5 * (this._x_v ** 2) / this._x_a || 0,
            y: -1.5 * (this._y_v ** 2) / this._y_a || 0
        }
    }
    dt() {
        return -this._x_v / this._x_a
    }
    done() {
        const isDone = almostEqual(this.s().x, this._endPositionX) || almostEqual(this.s().y, this._endPositionY) || this._lastDt === this._t
        this._lastDt = null
        return isDone
    }
    setEnd(x, y) {
        this._endPositionX = x
        this._endPositionY = y
    }
    reconfigure(mass, frictionCoefficient) {
        this._m = mass
        this._f = frictionCoefficient * 1000
    }
}

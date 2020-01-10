import {EPSILON, almostEqual, almostZero} from './utils'

export class Spring {
    constructor(mass, springConstant, damping) {
        this._m = mass
        this._k = springConstant
        this._c = damping
        this._solution = null
        this._endPosition = 0
        this._startTime = 0
    }
    _solve(initial, velocity) {
        const c = this._c
        const m = this._m
        const k = this._k
        const cmk = c * c - 4 * m * k
        if (cmk === 0) {
            const r = -c / (2 * m)
            const c1 = initial
            const c2 = velocity / (r * initial)
            return {
                x(t) { return (c1 + c2 * t) * (Math.E ** (r * t)) },
                dx(t) { const pow = (Math.E ** (r * t)); return r * (c1 + c2 * t) * pow + c2 * pow }
            }
        } else if (cmk > 0) {
            const r1 = (-c - Math.sqrt(cmk)) / (2 * m)
            const r2 = (-c + Math.sqrt(cmk)) / (2 * m)
            const c2 = (velocity - r1 * initial) / (r2 - r1)
            const c1 = initial - c2

            return {
                x(t) {
                    let powER1T; let
                        powER2T
                    if (t === this._t) {
                        powER1T = this._powER1T
                        powER2T = this._powER2T
                    }

                    this._t = t

                    if (!powER1T) {
                        powER1T = this._powER1T = Math.E ** (r1 * t)
                    }
                    if (!powER2T) {
                        powER2T = this._powER2T = Math.E ** (r2 * t)
                    }

                    return (c1 * powER1T + c2 * powER2T)
                },
                dx(t) {
                    let powER1T; let
                        powER2T
                    if (t === this._t) {
                        powER1T = this._powER1T
                        powER2T = this._powER2T
                    }

                    this._t = t

                    if (!powER1T) {
                        powER1T = this._powER1T = Math.E ** (r1 * t)
                    }
                    if (!powER2T) {
                        powER2T = this._powER2T = Math.E ** (r2 * t)
                    }

                    return (c1 * r1 * powER1T + c2 * r2 * powER2T)
                }
            }
        } else {
            const w = Math.sqrt(4 * m * k - c * c) / (2 * m)
            const r = -(c / 2 * m)
            const c1 = initial
            const c2 = (velocity - r * initial) / w

            return {
                x(t) { return (Math.E ** (r * t)) * (c1 * Math.cos(w * t) + c2 * Math.sin(w * t)) },
                dx(t) {
                    const power = (Math.E ** (r * t))
                    const cos = Math.cos(w * t)
                    const sin = Math.sin(w * t)
                    return power * (c2 * w * cos - c1 * w * sin) + r * power * (c2 * sin + c1 * cos)
                }
            }
        }
    }
    x(dt) {
        if (dt === undefined) dt = ((new Date()).getTime() - this._startTime) / 1000.0
        return this._solution ? this._endPosition + this._solution.x(dt) : 0
    }
    dx(dt) {
        if (dt === undefined) dt = ((new Date()).getTime() - this._startTime) / 1000.0
        return this._solution ? this._solution.dx(dt) : 0
    }
    setEnd(x, velocity, t) {
        if (!t) t = (new Date()).getTime()
        if (x === this._endPosition && almostZero(velocity, EPSILON)) return
        velocity = velocity || 0
        let position = this._endPosition
        if (this._solution) {
            if (almostZero(velocity, EPSILON)) velocity = this._solution.dx((t - this._startTime) / 1000.0)

            position = this._solution.x((t - this._startTime) / 1000.0)

            if (almostZero(velocity, EPSILON)) velocity = 0
            if (almostZero(position, EPSILON)) position = 0
            position += this._endPosition
        }
        if (this._solution && almostZero(position - x, EPSILON) && almostZero(velocity, EPSILON)) {
            return
        }
        this._endPosition = x
        this._solution = this._solve(position - this._endPosition, velocity)
        this._startTime = t
    }
    snap(x) {
        this._startTime = (new Date()).getTime()
        this._endPosition = x
        this._solution = {
            x() { return 0 },
            dx() { return 0 }
        }
    }
    done(t) {
        if (!t) t = (new Date()).getTime()
        return almostEqual(this.x(), this._endPosition, EPSILON) && almostZero(this.dx(), EPSILON)
    }
    reconfigure(mass, springConstant, damping) {
        this._m = mass
        this._k = springConstant
        this._c = damping

        if (this.done()) return
        this._solution = this._solve(this.x() - this._endPosition, this.dx())
        this._startTime = (new Date()).getTime()
    }
    springConstant() { return this._k }
    damping() { return this._c }
    configuration() {
        function setSpringConstant(s, c) { s.reconfigure(1, c, s.damping()) }
        function setSpringDamping(s, d) { s.reconfigure(1, s.springConstant(), d) }
        return [
            {
                label: 'Spring Constant', read: this.springConstant.bind(this), write: setSpringConstant.bind(this, this), min: 100, max: 1000
            },
            {
                label: 'Damping', read: this.damping.bind(this), write: setSpringDamping.bind(this, this), min: 1, max: 500
            }
        ]
    }
}

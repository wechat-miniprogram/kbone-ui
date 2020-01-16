const EPSILON = 0.1
const almostEqual = (a, b, epsilon = EPSILON) =>
    (a > (b - epsilon)) && (a < (b + epsilon))
const almostZero = (a, epsilon) => almostEqual(a, 0, epsilon)

const rpxReg = /[+-]?\d+(\.\d+)?rpx/
const isRpxString = str => str.match(rpxReg)

const pxReg = /[+-]?\d+(\.\d+)?px/
const isPxString = str => str.match(pxReg)

const transformStrToNumber = input => {
    if (isRpxString(input)) input = wx.transformRpx('%%?' + input + '?%%')
    if (isPxString(input)) input = parseFloat(input, 10)
    input = +input
    if (typeof input === 'number' && !isNaN(input)) return input
    return 0
}

const getElementOffsetX = (elem, parent) => {
    if (elem === parent) {
        return 0
    }
    let pos_x = elem.offsetLeft
    if (elem.offsetParent) {
        pos_x += getElementOffsetX(elem.offsetParent, parent)
    } else {
        return 0
    }
    return pos_x
}

const getElementOffsetY = (elem, parent) => {
    if (elem === parent) {
        return 0
    }
    let pos_y = elem.offsetTop
    if (elem.offsetParent) {
        pos_y += getElementOffsetY(elem.offsetParent, parent)
    } else {
        return 0
    }
    return pos_y
}

const subtract = (arg1, arg2) => +((arg1 * 1000 - arg2 * 1000) / 1000).toFixed(1)

const createAnimation = (physicsModel, callback, doneFn) => {
    const onFrame = (handle, model, cb, doneFn) => {
        if (handle && handle.cancelled) return
        cb(model)
        const done = physicsModel.done()
        if (!done && !handle.cancelled) {
            handle.id = requestAnimationFrame(onFrame.bind(null, handle, model, cb, doneFn))
        }
        if (done && doneFn) {
            doneFn(model)
        }
    }
    const cancel = (handle) => {
        if (handle && handle.id) {
            cancelAnimationFrame(handle.id)
        }
        if (handle) {
            handle.cancelled = true
        }
    }
    const handle = {
        id: 0,
        cancelled: false,
    }
    onFrame(handle, physicsModel, callback, doneFn)
    return {
        cancel: cancel.bind(null, handle),
        model: physicsModel,
    }
}

const getLength = v => Math.sqrt(v.x * v.x + v.y * v.y)

export {
    EPSILON,
    almostEqual,
    almostZero,
    getLength,
    transformStrToNumber,
    getElementOffsetX,
    getElementOffsetY,
    subtract,
    createAnimation
}

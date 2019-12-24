export const ismp = typeof Page === 'function' && typeof Component === 'function'

export function findUpComponent(context, componentName, componentNames) {
    if (typeof componentName === 'string') {
        componentNames = [componentName]
    } else {
        componentNames = componentName
    }

    let parent = context.$parent
    let name = parent.$options.name
    while (parent && (!name || componentNames.indexOf(name) < 0)) {
        parent = parent.$parent
        if (parent) name = parent.$options.name
    }
    return parent
}

// Find components downward
export function findDownComponent(context, componentName) {
    return context.$children.reduce((components, child) => {
        if (child.$options.name === componentName) components.push(child)
        const foundChilds = findDownComponent(child, componentName)
        return components.concat(foundChilds)
    }, [])
}


// https://github.com/chenglou/tween-functions/blob/master/index.js
export const tweenFunctions = {
    linear(t, b, _c, d) {
        const c = _c - b
        return c * t / d + b
    },
    easeInCubic(t, b, _c, d) {
        const c = _c - b
        return c * (t /= d) * t * t + b
    },
    easeOutCubic(t, b, _c, d) {
        const c = _c - b
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic(t, b, _c, d) {
        const c = _c - b
        // eslint-disable-next-line no-cond-assign
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b
        } else {
            return c / 2 * ((t -= 2) * t * t + 2) + b
        }
    },
}

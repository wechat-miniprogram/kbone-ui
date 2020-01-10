const BASE_DEVICE_WIDTH = 750
const isIOS = navigator.userAgent.match('iPhone')
let deviceWidth = window.screen.width || 375
let deviceDPR = window.devicePixelRatio || 2
let newDeviceWidth = window.screen.width || 375
const newDeviceDPR = window.devicePixelRatio || 2
const newDeviceHeight = window.screen.height || 375
if (window.screen.orientation &&
        /^landscape/.test(window.screen.orientation.type ||
        '')) {
    newDeviceWidth = newDeviceHeight
}
if (newDeviceWidth !== deviceWidth || newDeviceDPR !== deviceDPR) {
    deviceWidth = newDeviceWidth
    deviceDPR = newDeviceDPR
}
const eps = 1e-4
const transformRPX = (number, newDeviceWidth) => {
    if (number === 0) return 0
    number = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth)
    number = Math.floor(number + eps)
    if (number === 0) {
        if (deviceDPR === 1 || !isIOS) {
            return 1
        } else {
            return 0.5
        }
    }
    return number
}

export {
    transformRPX
}

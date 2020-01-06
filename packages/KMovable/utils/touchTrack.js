export function createTouchTrack() {
    let startX = 0
    let startY = 0
    let prevX = 0
    let prevY = 0
    let startEvent = null
    const assignDetail = (e, state, x, y) => {
        e.touchDetail = {
            state,
            x,
            y,
            dx: x - startX,
            dy: y - startY,
            ddx: x - prevX,
            ddy: y - prevY,
            timeStamp: e.timeStamp
        }
        return e
    }
    return {
        onTouchEvent(e) {
            if (e.type === 'touchstart') return this.onTouchStart(e)
            else if (e.type === 'touchmove') return this.onTouchMove(e)
            else if (e.type === 'touchend') return this.onTouchEnd(e)
            else if (e.type === 'touchcancel') return this.onTouchCancel(e)
            else return e
        },
        onTouchStart(e) {
            if (e.touches.length === 1 && !startEvent) {
                startEvent = e
                startX = prevX = e.touches[0].pageX
                startY = prevY = e.touches[0].pageY
                return assignDetail(e, 'start', startX, startY)
            }
        },
        onTouchMove(e) {
            if (e.touches.length === 1 && startEvent) {
                const ret = assignDetail(e, 'move', e.touches[0].pageX, e.touches[0].pageY)
                prevX = e.touches[0].pageX
                prevY = e.touches[0].pageY
                return ret
            }
        },
        onTouchEnd(e) {
            if (e.touches.length === 0 && startEvent) {
                startEvent = null
                return assignDetail(e, 'end', e.changedTouches[0].pageX, e.changedTouches[0].pageY)
            }
        },
        onTouchCancel(e) {
            if (startEvent) {
                const ev = startEvent
                startEvent = null
                return assignDetail(e, 'end', ev.touches[0].pageX, ev.touches[0].pageY)
            }
        },
    }
}

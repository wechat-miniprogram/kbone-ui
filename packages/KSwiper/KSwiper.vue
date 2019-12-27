<template>
  <KView
    ref="slidesWrapper"
    class="weui-swiper weui-swiper-wrapper"
    @touchstart="handleStart"
    @touchmove="handleMove"
    @touchend="handleEnd">
    <KView
      ref="slides"
      class="weui-swiper-slides">
      <KView
        id="slideFrame"
        ref="slideFrame"
        class="weui-swiper-slide-frame">
        <slot/>
      </KView>
    </KView>
    <KView
      v-if="indicatorDots"
      ref="slidesDots"
      class="weui-swiper-dots"/>
  </KView>
</template>

<script>
import {findDownComponent, tweenFunctions, ismp} from '@utils/util'
import KView from '../KView/'

export default {
    name: 'KSwiper',
    components: {
        KView
    },
    props: {
        indicatorDots: {
            type: Boolean,
            default: false
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        circular: {
            type: Boolean,
            default: false,
        },
        interval: {
            type: Number,
            default: 5000,
        },
        duration: {
            type: Number,
            default: 500,
        },
        current: {
            type: Number,
            default: 0,
        },
        indicatorColor: {
            type: String,
            default: '',
        },
        indicatorActiveColor: {
            type: String,
            default: '',
        },
        previousMargin: {
            type: String,
            default: '',
        },
        nextMargin: {
            type: String,
            default: '',
        },
        currentItemId: {
            type: String,
            default: '',
        },
        skipHiddenItemLayout: {
            type: Boolean,
            default: false,
        },
        displayMultipleItems: {
            type: Number,
            default: 1,
        },
        easingFunction: {
            type: String,
            default: 'default',
        },
    },
    data() {
        return {
            start: {
                x: 0, // 手指按下时的位置
                y: 0,
                preX: 0, // move 或 touch 按下的位置
                preY: 0,
            },
            currentPos: {
                x: 0,
                y: 0,
                dx: 0, // 和手指按下时位置的差值
                dy: 0,
                ddx: 0, // 和前一个 move 位置的差值
                ddy: 0
            },
            currentOrder: this.current,
            contentTrackViewport: 0,
            viewportPosition: 0,
            contentTrackT: 0,
            contentTrackSpeed: 0,
            multipleItems: 1,
            marginSpecified: false,
            viewportMoveRatio: 1,
            circularEnabled: false, // 循环展示 flag
            ismp,
        }
    },
    mounted() {
        if (!ismp) {
            this.$refs.slidesWrapper.$el.addEventListener('touchstart', this.handleStart, false)
            this.$refs.slidesWrapper.$el.addEventListener('touchmove', this.handleMove, false)
            this.$refs.slidesWrapper.$el.addEventListener('touchend', this.handleEnd, false)
        } else {
            this.$refs.slideFrame.$el = document.querySelector('#slideFrame')
            document.querySelector('#slideFrame').$$getBoundingClientRect()
                .then(res => {
                    this.$refs.slideFrame.$el.offsetWidth = res.width
                    this.$refs.slideFrame.$el.offsetHeight = res.height
                })
                .catch({})
        }
        this._resetLayout()
    },
    methods: {
        _getItems() {
            return findDownComponent(this, 'KSwiperItem')
        },
        handleStart(event) {
            if (event.type === 'touchstart') {
                event.clientY = event.touches[0].clientY
                event.clientX = event.touches[0].clientX
            }

            this.start = {
                x: event.clientX,
                y: event.clientY,
                preX: event.clientX,
                preY: event.clientY,
            }
            this.contentTrackViewport = this.viewportPosition
            this.contentTrackT = Date.now()
            this.contentTrackSpeed = 0
        },
        handleMove(event) {
            // TODO 解决当出现 scroll-view 和 swiper 嵌套时出现诡异滑动的异常点

            if (!this.contentTrackT) return
            if (event.type === 'touchmove') {
                event.clientY = event.touches[0].clientY
                event.clientX = event.touches[0].clientX
            }

            this.currentPos = {
                x: event.clientX,
                y: event.clientY,
                dx: event.clientX - this.start.x,
                dy: event.clientY - this.start.y,
                ddx: event.clientX - this.start.preX,
                ddy: event.clientY - this.start.preY
            }

            this.start.preX = event.clientX
            this.start.preY = event.clientY

            const prevT = this.contentTrackT
            this.contentTrackT = Date.now()
            const count = this._getItems().length
            this.viewportMax = count - this.multipleItems // 默认先只支持一个 swiper 内显示一个 item 内容
            let deltaT = this.contentTrackT - prevT
            if (deltaT === 0) deltaT = 1

            if (this.vertical) {
                //
            } else {
                // 先只管水平运行
                this.updateView(
                    -this.currentPos.dx / this.$refs.slideFrame.$el.offsetWidth,
                    -this.currentPos.ddx / deltaT
                )
            }
        },
        handleEnd(event) {
            if (this.autoplay) this._scheduleAutoplay()
            this.contentTrackT = false
            let direction
            if (this.contentTrackSpeed === 0) {
                direction = 0
            } else {
                direction = this.contentTrackSpeed / Math.abs(this.contentTrackSpeed)
            }

            let extraMovement = 0
            //  if (!isCancel && Math.abs(this._contentTrackSpeed) > 0.2) {
            if (Math.abs(this.contentTrackSpeed) > 0.2) {
                extraMovement = 0.5 * direction
            }
            const toPos = this._normalizeCurrentValue(this.viewportPosition + extraMovement)
            // if (isCancel) {
            // if (false) {
            const _temp = false
            if (_temp) {
                // TODO: 处理 touchcancel 事件
                this.updateSwiper(this.contentTrackViewport)
            } else if (this.current !== toPos) {
                this._currentChangeSource = 'touch'
                this.currentOrder = toPos
                this._animateViewport(toPos, 'touch', extraMovement)
            } else {
                this._animateViewport(toPos, 'touch', extraMovement)
            }
        },
        _scheduleAutoplay() {
            this._cancelSchedule()
            if (this._getItems().length <= this.displayMultipleItems) {
                return
            }
            const frameFunc = () => {
                this._scheduleTimeout = null
                this._currentChangeSource = 'autoplay'
                if (this.circularEnabled) {
                    this.currentOrder = this._normalizeCurrentValue(this.currentOrder + 1)
                } else {
                    // 到底部，默认返回 0 位置
                    this.currentOrder = this.currentOrder + this.displayMultipleItems < this._getItems().length
                        ? this.currentOrder + 1 : 0
                }
                this._animateViewport(this.currentOrder, 'autoplay', this.circularEnabled ? 1 : 0)
                this._scheduleTimeoutObj = setTimeout(frameFunc, this.interval)
            }

            this._scheduleTimeoutObj = setTimeout(frameFunc, this.interval)
        },
        _animateViewport(position, source, direction) {
            this._cancelViewportAnimation()
            const duration = this.duration
            const itemCount = this._getItems().length
            let fromPos = this.viewportPosition
            if (this.circularEnabled) {
                if (direction < 0) {
                    while (fromPos < position) fromPos += itemCount
                    while (fromPos - itemCount > position) fromPos -= itemCount
                } else if (direction > 0) {
                    while (fromPos > position) fromPos -= itemCount
                    while (fromPos + itemCount < position) fromPos += itemCount
                } else {
                    while (fromPos + itemCount < position) fromPos += itemCount
                    while (fromPos - itemCount > position) fromPos -= itemCount
                    if (fromPos + itemCount - position < position - fromPos) fromPos += itemCount
                    if (position - (fromPos - itemCount) < fromPos - position) fromPos -= itemCount
                }
            }
            this._animating = {
                fromPos,
                toPos: position,
                acc: (fromPos - position) * 2 / (duration * duration),
                startTime: Date.now(),
                endTime: Date.now() + duration,
                source
            }
            if (!this._requestedAnimation) {
                this._requestedAnimation = true
                if (ismp) window.requestAnimationFrame(this._animateFrameFunc.bind(this))
                else requestAnimationFrame(this._animateFrameFunc.bind(this))
            }
        },
        _animateFrameFunc() {
            if (!this._animating) {
                this._requestedAnimation = false
                return
            }
            this._transitioning = true
            const {
                toPos, acc, endTime, source, fromPos, startTime
            } = this._animating

            // 在 duration 指定完毕后的回调函数
            // 执行完毕当前的滚动
            const curDuration = endTime - Date.now()
            if (curDuration <= 0) {
                this.updateSwiper(toPos)
                this._animating = null
                this._requestedAnimation = false
                const curItem = this._getItems()[this.currentOrder]
                if (curItem) {
                    this._swiping = false
                    this._transitioning = false
                    this._transposed = false
                    this._lastPosX = null
                    this._lastPosY = null
                    this._previous = this.currentOrder
                }
                return
            }
            let delta
            const elapsed = Date.now() - startTime
            switch (this.easingFunction) {
            case 'easeInCubic':
            {
                delta = tweenFunctions.easeInCubic(elapsed, fromPos, toPos, this.duration)
                break
            }
            case 'easeOutCubic':
            {
                delta = tweenFunctions.easeOutCubic(elapsed, fromPos, toPos, this.duration)
                this.updateSwiper(delta)
                break
            }
            case 'easeInOutCubic':
            {
                delta = tweenFunctions.easeInOutCubic(elapsed, fromPos, toPos, this.duration)
                break
            }
            case 'linear':
            {
                delta = tweenFunctions.linear(elapsed, fromPos, toPos, this.duration)
                break
            }
            case 'default':
            default:
            {
                const curDist = acc * curDuration * curDuration / 2
                delta = toPos + curDist
                break
            }
            }
            this.updateSwiper(delta)
            if (ismp) window.requestAnimationFrame(this._animateFrameFunc.bind(this))
            else requestAnimationFrame(this._animateFrameFunc.bind(this))
        },
        _cancelViewportAnimation() {
            this._animating = null
        },
        _cancelSchedule() {
            clearTimeout(this._scheduleTimeoutObj)
            this._scheduleTimeoutObj = null
        },
        _normalizeCurrentValue(val) {
            const itemCount = this._getItems().length
            if (!itemCount) return -1
            // eslint-disable-next-line
            const roundedValue = (Math.round(val) % itemCount + itemCount) % itemCount
            if (this.circularEnabled) {
                if (itemCount <= this.displayMultipleItems) {
                    return 0
                }
            } else if (roundedValue > itemCount - this.displayMultipleItems) {
                return itemCount - this.displayMultipleItems
            }
            return roundedValue
        },
        updateView(moveRate, v) {
            // moveRate 为当前手指滑动距离相比于 当前 swiper 的宽度或高度
            // v 为 两次 move 之间移动的速率

            // 当前 swiper-item 移动距离的比例位置(0-100)
            let newViewport = this.contentTrackViewport + moveRate
            this.contentTrackSpeed = this.contentTrackSpeed * 0.6 + v * 0.4
            if (!this.circularEnabled) {
                // 循环展示
                if (newViewport < 0 || newViewport > this.viewportMax) {
                    if (newViewport < 0) newViewport = -this.overflowRate(-newViewport)
                    // eslint-disable-next-line
                  else if (newViewport > this.viewportMax) newViewport = this.viewportMax + this.overflowRate(newViewport - this.viewportMax)
                    this.contentTrackSpeed = 0
                }
            }
            this.updateSwiper(newViewport)
        },
        updateSwiper(position) {
            if (
                Math.floor(this.viewportPosition * 2) !== Math.floor(position * 2) ||
                Math.ceil(this.viewportPosition * 2) !== Math.ceil(position * 2)
            ) {
                if (this.circularEnabled) { this._checkCircularLayout(position) }
            }
            const x = this.vertical ? '0' : -position * 100 * this.viewportMoveRatio + '%'
            const y = this.vertical ? -position * 100 * this.viewportMoveRatio + '%' : '0'
            const transform = 'translate(' + x + ', ' + y + ') translateZ(0)'
            const slideFrame = this.$refs.slideFrame.$el
            slideFrame.style['-webkit-transform'] = transform
            slideFrame.style.transform = transform
            this.viewportPosition = position

            const _itemsLen = this._getItems().length
            const _scrollPosition = {
                scrollLeft: this.vertical
                    ? 0
                    : position * this.viewportMoveRatio * slideFrame.offsetWidth,
                scrollTop: this.vertical
                    ? position * this.viewportMoveRatio * slideFrame.offsetHeight
                    : 0,
                scrollWidth: (this.vertical ? 1 : _itemsLen) * slideFrame.offsetWidth,
                scrollHeight: (this.vertical ? _itemsLen : 1) * slideFrame.offsetHeight,
            }

            if (!this._scrollPosition ||
                (this._scrollPosition.scrollLeft !== _scrollPosition.scrollLeft ||
                    this._scrollPosition.scrollTop !== _scrollPosition.scrollTop)
            ) {
                const {source} = this._animating || {}
                if (source === 'touch' && !this._swiping || !this._transitioning) {
                    this._scrollPosition = _scrollPosition
                    return
                }
                const x = _scrollPosition.scrollLeft
                const y = _scrollPosition.scrollTop
                let dx = 0
                let dy = 0
                if (!this.vertical) {
                    dx = this._getTransitionDeltaX(x)
                } else {
                    dy = this._getTransitionDeltaY(y)
                }
            }

            this._scrollPosition = _scrollPosition
        },
        _getTransitionDeltaX(x) {
            const frameWidth = this.$refs.slideFrame.$el.offsetWidth
            const offset = Math.abs(parseInt(this._lastPosX, 10) - parseInt(x, 10))
            if (this._lastPosX !== null && offset > frameWidth || this._transposed) {
                this._transposed = true
                const rearFramePosX = (this._getItems().length - 1) * frameWidth
                if (this.circularEnabled) {
                // head -> rear
                    if (Math.sign(this._lastPosX) < 0) {
                        x = -(frameWidth - (x - rearFramePosX))
                    } else if (Math.sign(this._lastPosX) > 0) {
                    // rear -> head
                        x = rearFramePosX + (frameWidth + x)
                    } else {
                    // ignore 0 case
                    }
                }
            } else if (
                this.autoplay &&
                this._previous === this._getItems().length - 1 &&
                x <= 0 &&
                (this._lastPosX == null || x > this._lastPosX)
            ) {
                this._lastPosX = x
                const delta = frameWidth - Math.abs(x)
                return delta
            } else {
                this._lastPosX = x
            }
            return x - this._previous * frameWidth
        },
        _getTransitionDeltaY(y) {
            // const frameWidth = this.$refs.slideFrame.$el.offsetWidth
            const frameHeight = this.$refs.slideFrame.$el.offsetHeight
            const offset = Math.abs(parseInt(this._lastPosY, 10) - parseInt(y, 10))
            if (this._lastPosY !== null && offset > frameHeight || this._transposed) {
                this._transposed = true
                const rearFramePosY = (this._getItems().length - 1) * frameHeight
                if (this.circularEnabled) {
                // head -> rear
                    if (Math.sign(this._lastPosY) < 0) {
                        y = -(frameHeight - (y - rearFramePosY))
                    } else if (Math.sign(this._lastPosY) > 0) {
                        // rear -> head
                        y = rearFramePosY + (frameHeight + y)
                    } else {
                        // ignore 0 case
                    }
                }
            } else if (
                this.autoplay &&
              this._previous === this._getItems().length - 1 &&
              y <= 0 &&
              (this._lastPosY == null || y > this._lastPosY)
            ) {
                this._lastPosY = y
                const delta = frameHeight - Math.abs(y)
                return delta
            } else {
                this._lastPosY = y
            }
            return y - this._previous * frameHeight
        },
        overflowRate(rate) {
            return 0.5 - 0.25 / (rate + 0.5)
        },
        _checkCircularLayout(viewportPosition) {
            if (this._invalid) return
            const items = this._getItems()
            const itemCount = items.length
            const viewportPositionEnd = viewportPosition + this.displayMultipleItems
            for (let i = 0; i < itemCount; i++) {
                const item = items[i]
                const oldPos = item._position
                const expectPos1 = Math.floor(viewportPosition / itemCount) * itemCount + i
                const expectPos2 = expectPos1 + itemCount
                const expectPos3 = expectPos1 - itemCount
                const dist1 = Math.max(
                    viewportPosition - (expectPos1 + 1),
                    expectPos1 - viewportPositionEnd,
                    0
                )
                const dist2 = Math.max(
                    viewportPosition - (expectPos2 + 1),
                    expectPos2 - viewportPositionEnd,
                    0
                )
                const dist3 = Math.max(
                    viewportPosition - (expectPos3 + 1),
                    expectPos3 - viewportPositionEnd,
                    0
                )
                const dist = Math.min(dist1, dist2, dist3)
                const expectPos = [expectPos1, expectPos2, expectPos3][[dist1, dist2, dist3].indexOf(dist)]
                if (oldPos !== expectPos) this._updateItemPos(i, expectPos)
            }
        },
        _updateItemPos(index, position) {
            const x = this.vertical ? '0' : position * 100 + '%'
            const y = this.vertical ? position * 100 + '%' : '0'
            const transform = 'translate(' + x + ', ' + y + ') translateZ(0)'
            const item = this._getItems()[index].$el
            item.style['-webkit-transform'] = transform
            item.style.transform = transform
            item._position = position
        },
        _resetLayout({triggeredBy} = {}) {
            this._cancelSchedule()
            this._cancelViewportAnimation()
            const items = this._getItems()

            const slides = this.$refs.slides.$el
            const slideFrame = this.$refs.slideFrame.$el
            if (this.vertical) {
                //
            } else {
                if (this.marginSpecified) {
                    slides.style.top = 0
                    slides.style.bottom = 0
                    slides.style.left = this.previousMargin
                    slides.style.right = this.nextMargin
                }
                slideFrame.style.height = '100%'
                slideFrame.style.width = Math.abs(100 / this.displayMultipleItems) + '%'
            }

            const itemPos = []
            for (let i = 0; i < items.length; i++) {
                if (this._skipHiddenItemLayoutModified) {
                    // TODO: 先不处理这块
                    // items[i].style.display = items[i]._originalDisplay
                }
                this._updateItemPos(i, i)
            }

            // HACK 兼容以前开发者直接改 item width 的情况
            this._viewportMoveRatio = 1
            if (this.displayMultipleItems === 1 && items.length) {
                const rect = items[0].$el.getBoundingClientRect()
                const baseRect = this.$refs.slideFrame.$el.getBoundingClientRect()
                this._viewportMoveRatio = rect.width / baseRect.width
                if (!(this._viewportMoveRatio > 0 && this._viewportMoveRatio < 1)) {
                    this._viewportMoveRatio = 1
                }
            }

            this._circularEnabled = this.circular && items.length > this.displayMultipleItems
            const oldPosition = this._viewportPosition
            this._viewportPosition = -2
            const position = this.currentOrder
            if (position >= 0) {
                this._invalid = false
                if (this.contentTrackT) {
                    this.updateSwiper(oldPosition + position - this.contentTrackViewport)
                    this.contentTrackViewport = position
                } else {
                    this.updateSwiper(position)
                }
            }

            // 更新一下 dots 内容
            // this._updateDots(position)
        }

    },
}
</script>
